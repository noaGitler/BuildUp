// Helper function to check if an ID is valid (a positive number)
const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

class FavoriteValidation {

    // Validates that both userId and projectId are passed within the HTTP request body.
    static validateActionBody(req, res, next) {
        const { projectId } = req.body;

        if (!isIdValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Both 'userId' and 'projectId' are mandatory fields and must be positive integers."
            });
        }

        next();
    }
}

export default FavoriteValidation;