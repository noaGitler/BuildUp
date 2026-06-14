
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