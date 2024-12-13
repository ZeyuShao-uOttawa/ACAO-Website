import api from './api';
import AuthService from './authService';

export interface Event {
    eventTitle: string;
    eventDetails: string;
    eventLocation: string;
    eventPrice: number;
    eventImageUrl: string;
}

const authService = new AuthService();

export default class EventService {
    async getEventDetails(): Promise<Event> {
        const res = await api.get('/event/details');

        return res.data;
    }

    async updateEvent(event: Event) {
        await api.post('/event/update', event, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }
}