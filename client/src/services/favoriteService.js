import api from './api';

class favoriteService {

    static async addProjectToFavorites(userId, projectId) {
        const response = await api.post('/favorites/add', { userId, projectId });
        return response.data;
    };

    static async removeProjectFromFavorites(userId, projectId) {
        const response = await api.delete('/favorites/remove', { data: { userId, projectId } });
        return response.data;
    };

    static async getFavoriteProjectsList(userId, params = {}) {
        const response = await api.get('/favorites', {
            params: { ...params, userId }
        });
        return response.data;
    };
}

export default favoriteService