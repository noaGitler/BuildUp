import pool from '../config/db.js';

class CommentModel {

    // Inserts a new comment row link inside the persistent project_comments table layout.
    static async create(projectId, userId, commentText) {
        const query = `
            INSERT INTO project_comments (project_id, user_id, comment_text)
            VALUES (?, ?, ?);
        `;
        const [result] = await pool.query(query, [projectId, userId, commentText]);
        return result;
    }

    // Retrieves a single compiled comment instance by its primary auto-increment key.
    static async getSingleCommentById(commentId) {
        const query = `
            SELECT 
                c.id, c.project_id, c.user_id, c.comment_text, c.created_at,
                u.name AS user_name, u.profile_image_url AS user_image
            FROM project_comments c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.id = ?;
        `;
        const [rows] = await pool.query(query, [commentId]);
        return rows;
    }

    // Receive all responses for a specific project
    static async getByProjectIdPaginated(projectId, limit, offset) {
        const query = `
            SELECT 
                c.id, c.project_id, c.user_id, c.comment_text, c.created_at,
                u.name AS user_name, u.profile_image_url AS user_image
            FROM project_comments c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.project_id = ?
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?;
        `;
        const [rows] = await pool.query(query, [projectId, Number(limit), Number(offset)]);
        return rows;
    }

    // Alters the structural text block content description property inside a persistent table row.
    static async update(commentId, commentText) {
        const query = `
            UPDATE project_comments 
            SET comment_text = ? 
            WHERE id = ?;
        `;
        const [result] = await pool.query(query, [commentText, commentId]);
        return result;
    }

    // Completely eliminates an exact unique comment index from persistent database storage sheets.
    static async delete(commentId) {
        const query = `
            DELETE FROM project_comments 
            WHERE id = ?;
        `;
        const [result] = await pool.query(query, [commentId]);
        return result;
    }
}

export default CommentModel;