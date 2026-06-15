import pool from '../config/db.js';

class FavoriteModel {

    // Checks if a project is already in the user's favorites table.
    // static async checkExists(userId, projectId) {
    //     const connection = await pool.getConnection();
    //     try {
    //         const query = `
    //             SELECT id 
    //             FROM favorite_projects 
    //             WHERE user_id = ? AND project_id = ?
    //         `;
    //         const [rows] = await connection.query(query, [userId, projectId]);
    //         return rows.length > 0;
    //     } catch (error) {
    //         throw error;
    //     } finally {
    //         connection.release();
    //     }
    // }

    // Inserts a record linking a user and a project into the favorites database.
    static async addFavorite(userId, projectId) {
        const connection = await pool.getConnection();
        try {
            const query = `
                INSERT INTO favorite_projects (user_id, project_id) 
                VALUES (?, ?)
            `;
            const [result] = await connection.query(query, [userId, projectId]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // Deletes the exact link connecting a user and a specific project row.
    static async removeFavorite(userId, projectId) {
        const connection = await pool.getConnection();
        try {
            const query = `
                DELETE FROM favorite_projects 
                WHERE user_id = ? AND project_id = ?
            `;
            const [result] = await connection.query(query, [userId, projectId]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default FavoriteModel;