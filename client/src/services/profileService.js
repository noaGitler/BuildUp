import api from './api.js';

class profilesService {
    static async getAllProfessionals (filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.category_id) queryParams.append('category_id', filters.category_id);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

        const response = await api.get(`/profiles?${queryParams.toString()}`);
        return response.data;
    };

    static async getProfile (id) {
        const response = await api.get(`/profiles/${id}`);
        return response.data;
    };

    static async updateProfile (id, payload) {
        const response = await api.patch(`/profiles/${id}`, payload);
        return response.data;
    };

    static async getProfessionalReviews (id) {
        const response = await api.get(`/reviews/professional/${id}`);
        return response.data;
    };

    static async addReview (id, reviewData) {
        const response = await api.post(`/reviews/professional/${id}`, reviewData);
        return response.data;
    }

    static async editReview (reviewId, payload) {
        const response = await api.put(`/reviews/${reviewId}`, payload);
        return response.data;
    }

    static async deleteReview (reviewId) {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    }
};

export default profilesService;