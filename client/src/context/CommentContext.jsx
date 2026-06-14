import React, { createContext, useState, useContext, useCallback } from 'react';
import commentService from '../services/commentService';

const CommentContext = createContext(null);

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCommentsData = useCallback(async (projectId, page = 1, limit = 5, isNewLoad = false) => {
        setLoading(true);
        try {
            const result = await commentService.getCommentsByProject(projectId, page, limit);
            if (result.success && result.data) {
                // שימוש ב-Functional Update:
                setComments(prev => isNewLoad ? result.data : [...prev, ...result.data]);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addComment = async (projectId, userId, commentText) => {
        try {
            const result = await commentService.addComment(projectId, userId, commentText);
            if (result.success) {
                // Refreshing the first page to see the new comment at the top
                await fetchCommentsData(projectId, 1, 5, true);
                return { success: true };
            }
            return { success: false, message: result.message };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const updateComment = async (commentId, commentText, projectId) => {
        try {
            const result = await commentService.updateComment(commentId, commentText);
            if (result.success) {
                await fetchCommentsData(projectId, 1, 5, true); // Refresh
                return { success: true };
            }
            return { success: false, message: result.message };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const deleteComment = async (commentId, projectId) => {
        try {
            const result = await commentService.deleteComment(commentId);
            if (result.success) {
                await fetchCommentsData(projectId, 1, 5, true); // Refresh
                return { success: true };
            }
            return { success: false, message: result.message };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    return (
        <CommentContext.Provider
            value={{
                comments,
                loading,
                error,
                fetchComments: fetchCommentsData,
                addComment,
                updateComment,
                deleteComment
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};

export const useComments = () => useContext(CommentContext);