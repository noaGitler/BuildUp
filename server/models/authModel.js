import pool from '../config/db.js';

class authModel {
    // Checks if the email exists in the users table
    static async checkEmailExists(email) {
        const query = 'SELECT id FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        return rows[0];
    }

    static async createPendingRegistration(email, password) {
        const query = `
            INSERT INTO pending_registrations (email, password) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE password = ?, created_at = CURRENT_TIMESTAMP
        `;
        const [rows] = await pool.query(query, [email, password, password]);
        return rows;
    }

    static async registerFullUser(userData) {
        const { email, password, name, role, phone, profile_image_url, tag_line, bio, city, categoryIds } = userData;

        // Establish an isolated connection from the allocation pool to manage the transaction state
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Retrieving from the temporary table
            const pendingQuery = 'SELECT * FROM pending_registrations WHERE email = ? FOR UPDATE';
            const [pendingRows] = await connection.query(pendingQuery, [email]);
            const pendingData = pendingRows[0];

            if (!pendingData) {
                throw new Error("Temporary registration record missing or expired.");
            }

            // Cross-checking passwords
            let finalPassword = password;
            if (!finalPassword) {
                finalPassword = pendingData.password;
            }

            // Insert core entity row into 'users' table
            const userQuery = `
                INSERT INTO users (name, email, phone, role, profile_image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            const [userResult] = await connection.query(userQuery, [name, email, phone, role, profile_image_url]);
            const userId = userResult.insertId;

            // Insert the raw plain-text password directly into the secure isolation table 'password'
            const passwordQuery = 'INSERT INTO password (user_id, password) VALUES (?, ?)';
            await connection.query(passwordQuery, [userId, finalPassword]);

            // Conditional profile generation logic for specialized professional roles
            if (role === 'professional') {
                const profileQuery = `
                    INSERT INTO professional_profiles (user_id, tagline, bio, city) 
                    VALUES (?, ?, ?, ?)
                `;
                await connection.query(profileQuery, [userId, tag_line, bio, city]);

                // Bulk insert selected relationship indices into 'professional_categories' mapping table
                if (categoryIds && categoryIds.length > 0) {
                    const categoryValues = categoryIds.map(catId => [userId, catId]);
                    const bulkCategoryQuery = 'INSERT INTO professional_categories (user_id, category_id) VALUES ?';
                    await connection.query(bulkCategoryQuery, [categoryValues]);
                }
            }

            // After inserting the values, delete from the temporary table
            const deletePendingQuery = 'DELETE FROM pending_registrations WHERE email = ?';
            await connection.query(deletePendingQuery, [email]);

            // Commit transaction parameters permanently to persistent storage disk rows
            await connection.commit();
            return userId;

        } catch (error) {
            // Rollback execution block parameters to preserve database sanity
            await connection.rollback();
            throw error;
        } finally {
            // Relinquish operational connection blueprint footprints back to pool allocation
            connection.release();
        }
    }

    // Corrected to perform a JOIN with your exact 'password' table name
    // static async login (email) {
    //     const query = `
    //         SELECT u.id, u.email, u.name, u.role, u.profile_image_url, p.password 
    //         FROM users u
    //         JOIN password p ON u.id = p.user_id
    //         WHERE u.email = ?
    //     `;
    //     const [rows] = await pool.query(query, [email]);
    //     return rows[0];
    // }

    // // Retrieves user details by ID
    // static async findById (id) {
    //     const query = 'SELECT id, email, name, role, profile_image_url FROM users WHERE id = ?';
    //     const [rows] = await pool.query(query, [id]);
    //     return rows[0];
    // }

    // Corrected to perform a JOIN with your exact 'password' table name and fetch categories
    static async login(email) {
        const query = `
            SELECT u.id, u.email, u.name, u.role, u.profile_image_url, p.password 
            FROM users u
            JOIN password p ON u.id = p.user_id
            WHERE u.email = ?
        `;
        const [rows] = await pool.query(query, [email]);
        const user = rows[0];

        // אם המשתמש נמצא והוא איש מקצוע, נשלוף את הקטגוריות שלו
        if (user && user.role === 'professional') {
            const catQuery = 'SELECT category_id FROM professional_categories WHERE user_id = ?';
            const [catRows] = await pool.query(catQuery, [user.id]);
            // הפיכת מערך האובייקטים למערך מספרים פשוט: [1, 2]
            user.categoryIds = catRows.map(row => row.category_id);
        } else if (user) {
            user.categoryIds = [];
        }

        return user;
    }

    // // Retrieves user details by ID along with their assigned categories
    // static async findById (id) {
    //     const query = 'SELECT id, email, name, role, profile_image_url FROM users WHERE id = ?';
    //     const [rows] = await pool.query(query, [id]);
    //     const user = rows[0];

    //     // שליפת הקטגוריות גם בעת טעינת משתמש לפי ID כדי שהסטייט יישאר מסונכרן ברענון דף
    //     if (user && user.role === 'professional') {
    //         const catQuery = 'SELECT category_id FROM professional_categories WHERE user_id = ?';
    //         const [catRows] = await pool.query(catQuery, [user.id]);
    //         user.categoryIds = catRows.map(row => row.category_id);
    //     } else if (user) {
    //         user.categoryIds = [];
    //     }

    //     return user;
    // }
    static async findById(id) {
        try {
            const query = `
            SELECT id, email, name, role, profile_image_url 
            FROM users 
            WHERE id = ?
        `;
            const [rows] = await pool.query(query, [id]);
            const user = rows[0];

            if (user && user.role === 'professional') {
                const catQuery = 'SELECT category_id FROM professional_categories WHERE user_id = ?';
                const [catRows] = await pool.query(catQuery, [user.id]);

                user.categoryIds = catRows.map(row => row.category_id);
            } else if (user) {
                user.categoryIds = [];
            }

            return user;
        } catch (error) {
            console.error("Error in findById category assembly:", error);
            throw error;
        }
    }
}

export default authModel;