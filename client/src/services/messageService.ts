import api from './api';

export default class MessageService {
    // Send message
    async sendMessage(email: string, message: string): Promise<any> {
        const res = await api.post('/message/send', {
            message: message,
            email: email
        });

        return res.status;
    }
}