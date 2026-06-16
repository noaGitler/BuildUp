import api from './api';

// Authentication service to centralize all API calls.
class authService {

    static async registerStep1(email, password) {
        const response = await api.post('/auth/register-step1', { email, password });
        return response.data;
    };

    static async registerStep2(userData) {
        const response = await api.put('/auth/register-step2', userData);
        return response.data;
    };

    static async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    };

    static async checkAuthStatus() {
        const response = await api.get('/auth/check-auth');
        return response.data;
    };
};

export default authService;