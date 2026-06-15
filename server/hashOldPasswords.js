import pool from './config/db.js';
import bcrypt from 'bcrypt';

async function hashOldPasswords() {
    try {
        console.log("Starting password migration for specific users...");

        // רשימת מזהי המשתמשים (IDs) שביקשת להצפין
        const targetUserIds = [1, 2, 7 , 11];

        // 1. Get all passwords from the table
        const [rows] = await pool.query('SELECT user_id, password FROM password');

        for (let row of rows) {
            // 2. בודקים גם אם ה-ID נמצא ברשימה, וגם שהסיסמה עדיין לא מוצפנת
            if (targetUserIds.includes(row.user_id) && (!row.password.startsWith('$2') || row.password.length < 50)) {
                console.log(`Hashing password for user_id: ${row.user_id}`);
                
                // Hash the plaintext password
                const hashedPassword = await bcrypt.hash(row.password, 10);
                
                // 3. Update the database with the new hashed password
                await pool.query('UPDATE password SET password = ? WHERE user_id = ?', [hashedPassword, row.user_id]);
            } 
            else if (targetUserIds.includes(row.user_id)) {
                // רק כדי שתראי בקונסול אם אחד מהם כבר הוצפן קודם
                console.log(`User_id ${row.user_id} password is already hashed. Skipping.`);
            }
        }

        console.log("Password migration completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error during migration:", error);
        process.exit(1);
    }
}

hashOldPasswords();