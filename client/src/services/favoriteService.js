import api from './api';

class favoriteService {

    static async getFavoriteProjects(params = {}) {
        const response = await api.get('/favorites', {
            params: { ...params }
        });
        return response.data;
    };

    static async addFavorite(projectId) {
        const response = await api.post('/favorites/add', { projectId });
        return response.data;
    };

    static async removeFavorite(projectId) {
        const response = await api.delete('/favorites/remove', { data: { projectId } });
        return response.data;
    };
}

export default favoriteService