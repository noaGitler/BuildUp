// check if a basic text field is valid (not empty or whitespace only)
const isTextValid = (text) => {
    return text && typeof text === 'string' && text.trim().length > 0;
};

// check if an ID is valid (a positive number)
const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

// check if rating is valid (a number between 1 and 5)
const isRatingValid = (rating) => {
    const num = Number(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
};

class ProfessionalReviewValidation {

    // Validation middleware for creating a new review (POST)
    static create(req, res, next) {
        const { rating, review_text } = req.body;

        if (!isRatingValid(rating) || !isTextValid(review_text)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: A valid user_id, a rating (1-5), and non-empty review_text are required."
            });
        }

        next();
    }

    // Validation middleware for modifying an existing review (PUT/PATCH)
    static update(req, res, next) {
        const { rating, review_text } = req.body;

        if (!isRatingValid(rating) || !isTextValid(review_text)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: A valid rating (1-5) and non-empty review_text are required for update."
            });
        }

        next();
    }
}

export default ProfessionalReviewValidation;