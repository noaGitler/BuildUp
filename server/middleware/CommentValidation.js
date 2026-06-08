// class CommentValidation {
//     /**
//      * Validates incoming payload parameters before allowing a comment insertion routine.
//      */
//     static validateCreateBody(req, res, next) {
//         const { projectId, userId, commentText } = req.body;

//         if (!projectId || !Number.isInteger(Number(projectId)) || Number(projectId) <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed: 'projectId' is mandatory and must be a positive integer."
//             });
//         }

//         if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed: 'userId' is mandatory and must be a positive integer."
//             });
//         }

//         if (!commentText || typeof commentText !== 'string' || commentText.trim() === '') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed: 'commentText' cannot be empty and must contain valid characters."
//             });
//         }

//         next();
//     }

//     /**
//      * Verifies the path constraint specifications mapping the active target project instance.
//      */
//     static validateProjectParams(req, res, next) {
//         const { projectId } = req.params;

//         if (!projectId || !Number.isInteger(Number(projectId)) || Number(projectId) <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed: Path parameter 'projectId' is mandatory and must be a positive integer."
//             });
//         }

//         next();
//     }

//     /**
//      * Verifies individual identifier fields when processing edit or deletion nodes.
//      */
//     static validateCommentParams(req, res, next) {
//         const { commentId } = req.params;

//         if (!commentId || !Number.isInteger(Number(commentId)) || Number(commentId) <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed: Path parameter 'commentId' is mandatory and must be a positive integer."
//             });
//         }

//         next();
//     }
// }

// export default CommentValidation;







// Helper: check if a basic text field is valid (not empty or whitespace only)
export const isTextValid = (text) => {
    return text && text.trim().length > 0;
};

// Helper: check if an ID is valid (a positive number)
export const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

class CommentValidation {

    // Validation for adding a new comment (POST)
    static create(req, res, next) {
        const { projectId, userId, commentText } = req.body;

        if (!isIdValid(projectId) || !isIdValid(userId) || !isTextValid(commentText)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: projectId, userId, and commentText are mandatory fields."
            });
        }
        next();
    }

    // Validation for updating a comment (PUT)
    static update(req, res, next) {
        const { commentId } = req.params;
        const { commentText } = req.body;

        if (!isIdValid(commentId) || !isTextValid(commentText)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: commentId must be valid and commentText cannot be empty."
            });
        }
        next();
    }

    // Validation for deleting a comment (DELETE)
    static delete(req, res, next) {
        const { commentId } = req.params;

        if (!isIdValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: commentId must be a valid positive integer."
            });
        }
        next();
    }

    // Validation for fetching comments (GET)
    static fetch(req, res, next) {
        const { projectId } = req.params;

        if (!isIdValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: projectId must be a valid positive integer."
            });
        }
        next();
    }
}

export default CommentValidation;