import api from './api';

class projectService {

    static async getProjectsFiles(filters = {}) {
        const response = await api.get('/projects', { params: filters });
        return response.data;
    };

    static async getProjectById(id) {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    };

    static async createProject(projectData) {
        const response = await api.post('/projects/create', projectData);
        return response.data;
    };

    static async updateProject(id, updateData) {
        const response = await api.patch(`/projects/${id}`, updateData);
        return response.data;
    };

    static async deleteProject(id) {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    };
};

export default projectService;