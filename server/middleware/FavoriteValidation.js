// Helper function to check if an ID is valid (a positive number)
const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

class FavoriteValidation {

    // Validates that both userId and projectId are passed within the HTTP request body.
    static validateActionBody(req, res, next) {
        const { userId, projectId } = req.body;

        if (!isIdValid(userId) || !isIdValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Both 'userId' and 'projectId' are mandatory fields and must be positive integers."
            });
        }

        next();
    }

    // Validates that the mandatory userId filter param is present inside the request query parameters.
    static validateFetchQuery(req, res, next) {
        const { userId } = req.query;

        if (!isIdValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Query parameter 'userId' is mandatory and must be a positive integer."
            });
        }

        next();
    }
}

export default FavoriteValidation;