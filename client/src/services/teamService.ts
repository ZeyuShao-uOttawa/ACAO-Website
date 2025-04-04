import api from './api';
import AuthService from './authService';

export interface ExecDetails {
    _id: string;
    image: string;
    name: string;
    position: string,
    description: string;
}

const authService = new AuthService();

// Service for the AboutPage
export default class TeamService {
    async getAllExecDetails(): Promise<ExecDetails[]> {
        const res = await api.get('/team/details');

        return res.data;
    }

    async updateExecDetails(execDetails: ExecDetails) {
        await api.post('/team/update', execDetails, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }

    async deleteExecDetails(execId: string) {
        await api.delete(`/team/${execId}`, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }
}


