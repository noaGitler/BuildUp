
import api from './api.js';

const jobService = {
    /**
     * Fetch all job posts from the backend with dynamic filtration
     */
    getAllJobs: async (filters) => {
        try {
            const response = await api.get('/jobs', { params: filters });
            return response.data;
        } catch (error) {
            console.warn('Network notice in jobService.getAllJobs:', error.message);
            throw error;
        }
    },

    /**
     * Fetch a single job post by its unique ID
     */
    getJobById: async (id) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            console.warn(`Network notice in jobService.getJobById for ID ${id}:`, error.message);
            throw error;
        }
    },

    /**
     * Create and publish a brand new job opportunity
     */
    createJob: async (jobData) => {
        try {
            const response = await api.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            console.error('Error in jobService.createJob:', error);
            throw error;
        }
    },

    /**
     * Update an existing job vacancy with security validation context
     * 🌟 Improved: Transmitting both userId and role for backend authorization checks
     */
    updateJob: async (id, userId, updatedData) => {
        try {
            // Merging validation context variables seamlessly into the request body payload
            const payload = { userId,  ...updatedData };
            
            const response = await api.put(`/jobs/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error in jobService.updateJob for ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Permanently remove a job vacancy from the database registry
     * 🌟 Improved: Transmitting both userId and role inside the URL query context
     */
    deleteJob: async (id, userId) => {
        try {
            // Axios translates the params property directly into a strict URL Query String
            const response = await api.delete(`/jobs/${id}`, { params: { userId  } });
            return response.data;
        } catch (error) {
            console.error(`Error in jobService.deleteJob for ID ${id}:`, error);
            throw error;
        }
    },

    //  הפונקציה החדשה ל4 המעודכנים
    getLatestJobs: async (limit = 4) => {
        try {
            const response = await api.get(`/jobs/latest?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error in jobService.getLatestJobs:', error);
            throw error;
        }
    }
};

export default jobService;