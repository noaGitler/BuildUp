// import api from './api.js';

// const profilesService = {
//     getAllProfessionals: async (filters = {}) => {
//         const queryParams = new URLSearchParams();
//         if (filters.category_id) queryParams.append('category_id', filters.category_id);
//         if (filters.search) queryParams.append('search', filters.search);
//         if (filters.city) queryParams.append('city', filters.city);
//         if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

//         const response = await api.get(`/professionals?${queryParams.toString()}`);
//         return response.data;
//     },

//     getProfessionalProfile: async (id) => {
//         const response = await api.get(`/professionals/${id}`);
//         return response.data;
//     },

//     getProfessionalReviews: async (id) => {
//         const response = await api.get(`/reviews/professional/${id}`);
//         return response.data;
//     },

//     addReview: async (id, reviewData) => {
//         const response = await api.post(`/reviews/professional/${id}`, reviewData);
//         return response.data;
//     },

//     deleteReview: async (reviewId) => {
//         const response = await api.delete(`/reviews/${reviewId}`);
//         return response.data;
//     },

//     updateProfile: async (id, payload) => {
//         const response = await api.patch(`/professionals/profile/${id}`, payload);
//         return response.data;
//     },

//     // ADDED: Fetch basic user profile data for regular clients
//     getClientProfile: async (id) => {
//         const response = await api.get(`/professionals/client/${id}`);
//         return response.data;
//     },

//     updateClientProfile: async (id, payload) => {
//         const response = await api.patch(`/professionals/client/${id}`, payload);
//         return response.data;
//     }
// };

// export default profilesService;




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