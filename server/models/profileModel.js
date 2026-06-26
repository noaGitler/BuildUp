import pool from '../config/db.js';

class ProfileModel {

    // Get all professionals with category names, review rating averages, and dynamic filters
    static async getAllProfessionals(filters = {}) {
        const { category_id, search, city, sortBy } = filters;

        let query = `
            SELECT 
                u.id, u.name, u.email, u.phone, u.profile_image_url, u.created_at,
                pp.tagline, pp.bio, pp.city,
                GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_name,
                IFNULL(AVG(pr.rating), 0) AS average_rating
            FROM users u
            INNER JOIN professional_profiles pp ON u.id = pp.user_id
            LEFT JOIN professional_categories pc ON u.id = pc.user_id
            LEFT JOIN categories c ON pc.category_id = c.id
            LEFT JOIN professional_reviews pr ON u.id = pr.professional_id
            WHERE u.role = 'professional'
        `;
        const queryParams = [];

        // Apply city filter inside WHERE clause (Before GROUP BY)
        if (city) {
            query += ` AND pp.city = ?`;
            queryParams.push(city);
        }

        // Apply text search filter inside WHERE clause (Before GROUP BY)
        if (search) {
            query += ` AND u.name LIKE ?`;
            queryParams.push(`%${search}%`);
        }

        // Group records after filtering to allow aggregation calculations
        query += ` GROUP BY u.id, pp.tagline, pp.bio, pp.city`;

        // Apply category filter using HAVING after grouping
        if (category_id) {
            query += ` HAVING u.id IN (SELECT user_id FROM professional_categories WHERE category_id = ?)`;
            queryParams.push(category_id);
        }

        // Apply sorting preference dynamically based on dashboard component triggers
        if (sortBy === 'newest') {
            query += ` ORDER BY u.created_at DESC`;
        } else if (sortBy === 'popular') {
            query += ` ORDER BY average_rating DESC`;
        } else {
            query += ` ORDER BY u.name ASC`;
        }

        const [rows] = await pool.query(query, queryParams);
        return rows;
    };

    static async getProfileById(id) {
        // const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        const query = `
        SELECT u.*, pp.tagline, pp.bio, pp.city,
               (SELECT AVG(rating) FROM professional_reviews WHERE professional_id = u.id) as average_rating
        FROM users u
        LEFT JOIN professional_profiles pp ON u.id = pp.user_id
        WHERE u.id = ?
    `;
        const [users] = await pool.query(query, [id]);

        if (users.length === 0) return null;

        const user = users[0];

        // If he is professional, completing the missing part
        if (user.role === 'professional' || user.role === 'admin') {
            const [profiles] = await pool.query('SELECT tagline, bio, city FROM professional_profiles WHERE user_id = ?', [id]);
            const [categories] = await pool.query('SELECT category_id FROM professional_categories WHERE user_id = ?', [id]);

            return {
                ...user,
                ...(profiles[0] || {}),
                category_ids: categories.map(c => c.category_id)
            };
        }

        // If it's not professional
        return user;
    }

    static async updateProfile(id, payload) {
        // Retrieving the current state from the DB to know what the current Role is
        const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
        if (users.length === 0) throw new Error("User not found");

        const currentRole = users[0].role;
        const newRole = payload.role || currentRole;

        // Update user table
        await pool.query(
            `UPDATE users SET name = ?, phone = ?, profile_image_url = ?, role = ? WHERE id = ?`,
            [payload.name, payload.phone, payload.profile_image_url, newRole, id]
        );

        // Logic for professionals
        if (newRole === 'professional' || newRole === 'admin') {

            // Update/add to the professional profile table
            await pool.query(
                `INSERT INTO professional_profiles (user_id, tagline, bio, city) 
                VALUES (?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE tagline = VALUES(tagline), bio = VALUES(bio), city = VALUES(city)`,
                [id, payload.tagline, payload.bio, payload.city]
            );

            // Updating categories
            await pool.query('DELETE FROM professional_categories WHERE user_id = ?', [id]);

            if (payload.category_ids && Array.isArray(payload.category_ids)) {
                for (const catId of payload.category_ids) {
                    await pool.query(
                        'INSERT INTO professional_categories (user_id, category_id) VALUES (?, ?)',
                        [id, catId]
                    );
                }
            }
        }

        return await this.getProfileById(id);
    }

}

export default ProfileModel;