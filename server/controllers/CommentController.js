import CommentModel from '../models/commentModel.js';

class CommentController {

    static async getCommentsByProject(req, res) {
        try {
            const { projectId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const offset = (page - 1) * limit;

            const comments = await CommentModel.getByProjectIdPaginated(
                parseInt(projectId),
                limit,
                offset
            );

            res.status(200).json({ success: true, data: comments });
        } catch (error) {
            console.error("Error in getCommentsByProject controller:", error);
            res.status(500).json({ success: false, message: "Internal server error." });
        }
    };

    // Appends a text entry reference linked to a unique user and target project index.
    static async addComment(req, res) {
        try {
            const { projectId, commentText } = req.body;
            const userFromToken = req.user;

            const result = await CommentModel.create(
                Number(projectId),
                Number(userFromToken.id),
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

    // Modifies the text content string property of an already verified persistent comment entry.
    static async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const { commentText } = req.body;
            const userFromToken = req.user;

            const ownerId = await CommentModel.getCommentOwnerId(Number(commentId));

            if (!ownerId) { 
                return res.status(404).json({
                    success: false, 
                    message: "Comment not found" 
                }); 
            }

            const isOwner = Number(ownerId) === Number(userFromToken.id);
            const isAdmin = userFromToken.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized: You can only edit your own comments."
                });
            }

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

    // Completely removes a structural comment node reference path from system table data rows.
    static async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            const userFromToken = req.user;

            const ownerId = await CommentModel.getCommentOwnerId(Number(commentId));

            if (!ownerId) {
                return res.status(404).json({ success: false,
                    message: "Comment not found"
                });
            }

            const isOwner = Number(ownerId) === Number(userFromToken.id);
            const isAdmin = userFromToken.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized: You can only delete your own comments."
                });
            }

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