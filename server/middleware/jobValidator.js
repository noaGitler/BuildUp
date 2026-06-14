<<<<<<< HEAD

/**
 * Middleware validator to ensure payload parameters match structural schema criteria
 * prior to executing data registry operations.
 */
export const validateJobCreation = (req, res, next) => {
    const { title, description, budget, category_id, client_id } = req.body;

    // Check for strict enforcement of required configuration properties
    if (!title || !description || !category_id || !client_id) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: title, description, category_id, and client_id are required fields."
        });
    }

    // Verify numerical format parameters if an optional budget configuration is provided
    if (budget && (isNaN(budget) || Number(budget) < 0)) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: budget must be a positive numerical value."
        });
    }

    // All structural constraints resolved successfully, proceeding to controller pipeline execution
    next();
};
=======
// check if a basic text field is valid
const isTextValid = (text) => {
    return text && typeof text === 'string' && text.trim().length > 0;
};

// check if an ID is valid
const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

// check if budget is valid
const isBudgetValid = (budget) => {
    const num = Number(budget);
    return !isNaN(num) && num >= 0;
};

class JobValidation {

    // Validation middleware for creating a new job request
    static create(req, res, next) {
        const { title, description, budget, category_id, client_id } = req.body;

        // Check for strict enforcement of required configuration properties
        if (!isTextValid(title) || !isTextValid(description) || !isIdValid(category_id) || !isIdValid(client_id)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: title, description, category_id, and client_id are required fields."
            });
        }

        // Verify numerical format parameters if an optional budget configuration is provided
        if (budget !== undefined && budget !== null && budget !== '') {
            if (!isBudgetValid(budget)) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed: budget must be a positive numerical value."
                });
            }
        }

        next();
    }
}

export default JobValidation;
>>>>>>> upstream/main
