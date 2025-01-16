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

export default class TeamService {
    async getAllExecDetails(): Promise<ExecDetails[]> {
        const res = await api.get('/exec/details');

        return res.data;
    }

    async updateExecDetails(execDetails: ExecDetails) {
        await api.post('/exec/update', execDetails, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }

    async deleteExecDetails(execId: string) {
        await api.delete(`/exec/${execId}/delete`, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }
}


