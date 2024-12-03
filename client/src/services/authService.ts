import api from './api';

// Define the user type for TypeScript
interface User {
    email: string;
    password: string;
}

export default class AuthService {
    async login(user: User) {
        const response = await api.post('/auth/login', user);
        const { token } = response.data;

        // Save the token (localStorage as an example)
        localStorage.setItem('authToken', token);
        window.location.reload();
    }

    logout(): void {
        localStorage.removeItem('authToken');
        window.location.reload();
    }

    // Check if a user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    // Check if a user token is valid
    async verifyToken() {
        try {
            if (this.isAuthenticated()) {
                await api.get('/auth/verify', {
                    headers: { 'x-auth-token': localStorage.getItem('authToken') },
                });
            }
        } catch (err) {
            this.logout();
        }
    }
}