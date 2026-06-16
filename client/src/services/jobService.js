import api from './api.js';

class jobService {

    static async getAllJobs(filters) {
        const response = await api.get('/jobs', { params: filters });
        return response.data;

    }

    static async getJobById(id) {
        const response = await api.get(`/jobs/${id}`);
        return response.data;

    }

    static async createJob(jobData) {
        const response = await api.post('/jobs', jobData);
        return response.data;
    }

    static async updateJob(id, updateData) {
        const response = await api.put(`/jobs/${id}`, updateData);
        return response.data;
    };

    static async deleteJob(id) {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;

    }

    static async getLatestJobs(limit = 4) {
        const response = await api.get(`/jobs/latest?limit=${limit}`, { params: { limit } });
        return response.data;
    }
}

export default jobService;