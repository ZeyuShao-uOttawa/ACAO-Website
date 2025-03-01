const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Exec = require('../../models/Exec');
const teamRouter = require('../../routes/team');

const app = express();
app.use(express.json());
app.use('/api/team', teamRouter);

const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Team API Routes', () => {
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

    afterEach(async () => {
        await Exec.deleteMany({});
        jest.restoreAllMocks();
    });

    test('GET /api/team/details should return all the exec details', async () => {
        await Exec.create({
            name: 'Zeyu Shao',
            position: 'Photographer',
            description: 'Takes pictures',
            image: 'https://test.com/zeyu.jpg',
        });

        const response = await request(app).get('/api/team/details');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            __v: expect.any(Number),
            _id: expect.any(String),
            name: 'Zeyu Shao',
            position: 'Photographer',
            description: 'Takes pictures',
            image: 'https://test.com/zeyu.jpg',
        }]);
    });

    test('GET /api/team/details should return empty array if there are no execs', async () => {
        const response = await request(app).get('/api/team/details');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('GET /api/team/details should return 500 if `Exec.findOne()` throws an error', async () => {
        jest.spyOn(Exec, 'find').mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/team/details');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while fetching the exec details');
    });

    test('Post /api/team/update should create a new exec', async () => {
        const token = generateToken('admin');
        const newExecData = {
            _id: '',
            name: 'Justin Wong',
            position: 'President',
            description: 'Leader of the club',
            image: 'https://test.com/justin.jpg',
        };

        const response = await request(app)
            .post('/api/team/update')
            .set('x-auth-token', token)
            .send(newExecData);
        const execs = await Exec.find();

        expect(response.status).toBe(200);
        expect(execs.length).toBe(1);
        expect(execs[0].name).toBe('Justin Wong');
    });

    test('Post /api/team/update should update a existing exec with a id', async () => {
        const token = generateToken('admin');
        const exec = await Exec.create({
            name: 'Zeyu Shao',
            position: 'Photographer',
            description: 'Takes pictures',
            image: 'https://test.com/zeyu.jpg',
        });
        const newExecData = {
            _id: exec._id,
            name: 'Zeyu Shao',
            position: 'External',
            description: 'Does external stuff',
            image: 'https://test.com/zeyu.jpg',
        };

        const response = await request(app)
            .post('/api/team/update')
            .set('x-auth-token', token)
            .send(newExecData);
        const execs = await Exec.find();

        expect(response.status).toBe(200);
        expect(execs[0].name).toBe('Zeyu Shao');
        expect(execs[0].position).toBe('External');
        expect(execs[0].description).toBe('Does external stuff');
    });

    test('Post /api/team/update should return 500 if `Exec.findByIdAndUpdate()` throws an error', async () => {
        const token = generateToken('admin');
        const exec = await Exec.create({
            name: 'Zeyu Shao',
            position: 'Photographer',
            description: 'Takes pictures',
            image: 'https://test.com/zeyu.jpg',
        });
        const newExecData = {
            _id: exec._id,
            name: 'Zeyu Shao',
            position: 'External',
            description: 'Does external stuff',
            image: 'https://test.com/zeyu.jpg',
        };
        jest.spyOn(Exec, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/team/update')
            .set('x-auth-token', token)
            .send(newExecData);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while updating the exec details');
    });

    test('Delete /api/team/:id should delete the exec with the given id', async () => {
        const token = generateToken('admin');
        const exec = await Exec.create({
            name: 'Zeyu Shao',
            position: 'Photographer',
            description: 'Takes pictures',
            image: 'https://test.com/zeyu.jpg',
        });

        const response = await request(app)
            .delete(`/api/team/${exec._id}`)
            .set('x-auth-token', token);
        const execs = await Exec.find();

        expect(response.status).toBe(200);
        expect(execs.length).toBe(0);
    });

    test('Delete /api/team/:id should return 500 if an none existant exec id is passed', async () => {
        const token = generateToken('admin');
        execId = "67c251efb3353b042411c71e";

        const response = await request(app)
            .delete(`/api/team/${execId}`)
            .set('x-auth-token', token);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Exec details not found');
    });

    test('Delete /api/team/:id should return 500 if an invalid exec id is passed', async () => {
        const token = generateToken('admin');
        execId = "abc";

        const response = await request(app)
            .delete(`/api/team/${execId}`)
            .set('x-auth-token', token);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while deleting the exec details');
    });
});
