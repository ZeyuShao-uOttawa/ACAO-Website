import api from './api';

interface User {
    email: string;
    password: string;
}

// Service for login and user authentication
export default class AuthService {
    // Authenticating user
    async login(user: User) {
        const response = await api.post('/auth/login', user);
        const { token } = response.data;

        // Save the data in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', response.data.user.role);
        window.location.reload();
    }

    // Clearing local storage of authentication
    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');

        window.location.reload();
    }

    // Check if a user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    // Get user token
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Check if a user token is valid
    async verifyToken() {
        try {
            if (this.isAuthenticated()) {
                await api.get('/auth/verify', {
                    headers: { 'x-auth-token': this.getToken() },
                });
            }
        } catch (err) {
            this.logout();
        }
    }

    // Return what role the current authenticated user has
    getUserRole() {
        return localStorage.getItem('userRole');
    }
}