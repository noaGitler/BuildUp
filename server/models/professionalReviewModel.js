import db from '../config/db.js';

class ProfessionalReviewModel {

    static async getReviewsByProfessional(professionalId) {
        const query = `
            SELECT r.*, u.name as reviewer_name, u.role as reviewer_role 
            FROM professional_reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.professional_id = ?
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.query(query, [professionalId]);
        return rows;
    }

    // Insert a new professional review
    static async createReview(reviewData) {
        const { user_id, professional_id, rating, review_text } = reviewData;
        const query = `
            INSERT INTO professional_reviews (user_id, professional_id, rating, review_text, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [user_id, professional_id, rating, review_text]);
        return result.insertId;
    }

    // Update an existing professional review
    static async updateReview(reviewId, rating, reviewText) {
        const query = `UPDATE professional_reviews SET rating = ?, review_text = ? WHERE id = ?`;
        const [result] = await db.query(query, [rating, reviewText, reviewId]);
        return result.affectedRows > 0;
    }
    
    // Delete a specific professional review
    static async deleteReview(reviewId) {
        const query = `DELETE FROM professional_reviews WHERE id = ?`;
        const [result] = await db.query(query, [reviewId]);
        return result.affectedRows > 0;
    }
}

export default ProfessionalReviewModel;