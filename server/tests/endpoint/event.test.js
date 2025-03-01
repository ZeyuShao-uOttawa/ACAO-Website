const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Event = require('../../models/Event');
const eventRouter = require('../../routes/event');

const app = express();
app.use(express.json());
app.use('/api/event', eventRouter);

const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Event API Routes', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Event.create({
            eventTitle: 'Test',
            eventDetails: 'Test Details',
            eventLocation: 'Test Location',
            eventPrice: 1,
            eventImageUrl: 'https://test.com/event.jpg',
        });
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    test('GET /api/event/details should return event details', async () => {
        const response = await request(app).get('/api/event/details');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            __v: expect.any(Number),
            _id: expect.any(String),
            eventTitle: 'Test',
            eventDetails: 'Test Details',
            eventLocation: 'Test Location',
            eventPrice: 1,
            eventImageUrl: 'https://test.com/event.jpg',
        });
    });

    test('GET /api/event/details should return 500 if `Event.findOne()` throws an error', async () => {
        jest.spyOn(Event, "findOne").mockRejectedValue(new Error("Database error"));

        const response = await request(app).get('/api/event/details');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while fetching the event');
    });

    test('Post /api/event/update should update event details given a valid input', async () => {
        const token = generateToken('admin');
        const newEventData = {
            eventTitle: 'Test Update',
            eventDetails: 'Test Update Details',
            eventLocation: 'Test Update Location',
            eventPrice: 5,
            eventImageUrl: 'https://test.com/eventUpdate.jpg',
        };

        const response = await request(app)
            .post('/api/event/update')
            .set('x-auth-token', token)
            .send(newEventData);
        const event = await Event.findOne();

        expect(response.status).toBe(200);
        expect(event.eventTitle).toBe('Test Update');
        expect(event.eventDetails).toBe('Test Update Details');
        expect(event.eventLocation).toBe('Test Update Location');
        expect(event.eventPrice).toBe(5);
        expect(event.eventImageUrl).toBe('https://test.com/eventUpdate.jpg');
    });

    test('Post /api/event/update should return 500 if `findOneAndUpdate` throws an error', async () => {
        jest.spyOn(Event, 'findOneAndUpdate').mockRejectedValue(new Error('Database error'));
        const token = generateToken('admin');
        const newEventData = {
            eventTitle: 'Test Update',
            eventDetails: 'Test Update Details',
            eventLocation: 'Test Update Location',
            eventPrice: 5,
            eventImageUrl: 'https://test.com/eventUpdate.jpg',
        };

        const response = await request(app)
            .post('/api/event/update')
            .set('x-auth-token', token)
            .send(newEventData);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while updating the event');
    });

});