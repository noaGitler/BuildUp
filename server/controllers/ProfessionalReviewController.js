import professionalReviewModel from '../models/professionalReviewModel.js';

class ProfessionalReviewController {

    // Get all reviews for a professional profile
    static async getProfessionalReviews(req, res) {
        try {
            const { professionalId } = req.params;
            const reviews = await professionalReviewModel.getReviewsByProfessional(professionalId);

            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } catch (error) {
            console.error("Error inside getProfessionalReviews:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    // Post a new review for a professional profile
    static async addReview(req, res) {
        try {
            const { professionalId } = req.params;
            const { user_id, rating, review_text } = req.body;

            await professionalReviewModel.createReview({
                user_id,
                professional_id: professionalId,
                rating,
                review_text
            });

            return res.status(201).json({
                success: true,
                message: "Review posted successfully."
            });
        } catch (error) {
            console.error("Error inside addReview:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    // Update a professional review
    static async editReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { rating, review_text } = req.body;

            const success = await professionalReviewModel.updateReview(reviewId, rating, review_text);

            if (!success) {
                return res.status(404).json({ success: false, message: "Review not found or no changes made." });
            }

            return res.status(200).json({ success: true, message: "Review updated successfully." });
        } catch (error) {
            console.error("Error inside editReview:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    // Delete a professional review
    static async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const success = await professionalReviewModel.deleteReview(reviewId);

            if (!success) {
                return res.status(404).json({ success: false, message: "Review not found" });
            }

            return res.status(200).json({ success: true, message: "Review deleted successfully" });
        } catch (error) {
            console.error("Error inside deleteReview:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default ProfessionalReviewController;