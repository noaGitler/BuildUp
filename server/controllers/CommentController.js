import CommentModel from '../models/commentModel.js';

class CommentController {
    /**
     * Compiles a specific slice of project comments based on client-driven pagination.
     * Expects query string parameters: GET /api/comments/:projectId?page=1&limit=5
     */
    static async getCommentsByProject(req, res) {
        try {
            const { projectId } = req.params;
            
            // Extract pagination controls defined dynamically by the React frontend framework
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;

            // Compute the SQL query row starting placement index offset boundary using standard formula
            const offset = (page - 1) * limit;

            // Gather the target data slice from the database model abstraction layers
            const comments = await CommentModel.getByProjectIdPaginated(
                Number(projectId), 
                limit, 
                offset
            );

            return res.status(200).json({
                success: true,
                message: "Project comments chunk synchronized successfully matching client layout requirements.",
                data: comments
            });
        } catch (err) {
            console.error("Runtime exception inside paginated getCommentsByProject segment:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error compiled during sequential catalog lookup operations."
            });
        }
    }

    /**
     * Appends a text entry reference linked to a unique user and target project index.
     * Expects parameters within body payload: { projectId, userId, commentText }
     */
    static async addComment(req, res) {
        try {
            const { projectId, userId, commentText } = req.body;

            const result = await CommentModel.create(
                Number(projectId), 
                Number(userId), 
                commentText.trim()
            );

            // Retrieve the single fresh entry to pass back onto React context state for optimistic UI updates
            const [newComment] = await CommentModel.getSingleCommentById(result.insertId);

            return res.status(201).json({
                success: true,
                message: "New comment record successfully committed inside system database rows.",
                data: newComment
            });
        } catch (err) {
            console.error("Runtime exception inside addComment payload processor:", err);
            return res.status(500).json({
                success: false,
                message: "Internal configuration error matching remote persistence instance parameters."
            });
        }
    }

    /**
     * Modifies the text content string property of an already verified persistent comment entry.
     * PUT /api/comments/:commentId -> Body data: { commentText }
     */
    static async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const { commentText } = req.body;

            const result = await CommentModel.update(Number(commentId), commentText.trim());

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Targeted comment instance not located within persistent tables context."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Comment specifications modifications successfully compiled and finalized."
            });
        } catch (err) {
            console.error("Runtime exception inside updateComment modification node:", err);
            return res.status(500).json({
                success: false,
                message: "Internal framework exception caught updating structural table fields."
            });
        }
    }

    /**
     * Completely removes a structural comment node reference path from system table data rows.
     * DELETE /api/comments/:commentId
     */
    static async deleteComment(req, res) {
        try {
            const { commentId } = req.params;

            const result = await CommentModel.delete(Number(commentId));

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Targeted comment index mapping mismatch. Record execution context missing."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Comment instance permanently wiped from the persistent database catalogs layout."
            });
        } catch (err) {
            console.error("Runtime exception caught inside deleteComment structural clear sequence:", err);
            return res.status(500).json({
                success: false,
                message: "Database tracking error reported during permanent entity wipe routine loops."
            });
        }
    }
}

export default CommentController;