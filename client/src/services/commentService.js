import api from './api';

class commentService {

    static async getCommentsByProject(projectId, page = 1, limit = 5) {
        const response = await api.get(`/comments/${projectId}`, { params: { page, limit } });
        return response.data;
    }

    static async addComment(projectId, userId, commentText) {
        const response = await api.post('/comments/add', { projectId, userId, commentText });
        return response.data;
    }

    static async updateComment(commentId, commentText) {
        const response = await api.put(`/comments/${commentId}`, { commentText });
        return response.data;
    }

    static async deleteComment(commentId) {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    }
}

export default commentService;