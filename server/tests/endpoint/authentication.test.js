const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');
const authRouter = require('../../routes/authentication');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Team API Routes', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);

        await User.create({
            email: 'test@test.com',
            password: 'test',
            firstName: 'Tester',
            lastName: 'Test',
            studentNum: 111111111,
            role: 'admin',
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    test('POST /api/auth/login should return a user token and user info if login credentials are valid', async () => {
        const loginCreds = {
            email: 'test@test.com',
            password: 'test',
        }

        const response = await request(app)
            .post('/api/auth/login')
            .send(loginCreds);
        const verified = jwt.verify(response.body.token, process.env.JWT_SECRET);

        expect(response.status).toBe(200);
        expect(verified).toBeDefined();
        expect(response.body.user).toEqual({
            id: expect.any(String),
            email: 'test@test.com',
            role: 'admin',
        });
    });

    test('POST /api/auth/login should return 404 if the given email is invalid', async () => {
        const loginCreds = {
            email: 'wrong@test.com',
            password: 'test',
        }

        const response = await request(app)
            .post('/api/auth/login')
            .send(loginCreds);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    test('POST /api/auth/login should return 401 if the given password is invalid', async () => {
        const loginCreds = {
            email: 'test@test.com',
            password: 'wrong',
        }

        const response = await request(app)
            .post('/api/auth/login')
            .send(loginCreds);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    test('POST /api/auth/login should return 500 if a database error occurs', async () => {
        jest.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));
        const loginCreds = {
            email: 'test@test.com',
            password: 'wrong',
        }

        const response = await request(app)
            .post('/api/auth/login')
            .send(loginCreds);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while authenticating user');
    });

    test('GET /api/auth/verify should return 200 if a valid token is given in the header', async () => {
        const token = generateToken('admin');

        const response = await request(app)
            .get('/api/auth/verify')
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successfully validated token');
    });

    test('GET /api/auth/verify should return 401 if no token is passed in header', async () => {
        const response = await request(app)
            .get('/api/auth/verify');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('No token provided');
    });

    test('GET /api/auth/verify should return 401 if a invalid token is passed', async () => {
        const token = 'invalid';

        const response = await request(app)
            .get('/api/auth/verify')
            .set('x-auth-token', token);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid token');
    });
});