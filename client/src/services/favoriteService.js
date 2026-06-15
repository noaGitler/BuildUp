import api from './api';

class favoriteService {

    static async addFavorite(userId, projectId) {
        const response = await api.post('/favorites/add', { userId, projectId });
        return response.data;
    };

    static async removeFavorite(userId, projectId) {
        const response = await api.delete('/favorites/remove', { data: { userId, projectId } });
        return response.data;
    };

    static async getFavoriteProjects(userId, params = {}) {
        const response = await api.get('/favorites', {
            params: { ...params, userId }
        });
        return response.data;
    };
}

export default favoriteService