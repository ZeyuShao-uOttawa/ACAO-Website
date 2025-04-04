const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Album = require('../../models/Album');
const galleryRouter = require('../../routes/gallery');
const { generateAlbumUploadURL, listS3AlbumImages, deleteAlbum } = require('../../services/S3Service');

const app = express();
app.use(express.json());
app.use('/api/gallery', galleryRouter);

jest.mock('../../services/S3Service', () => ({
    generateAlbumUploadURL: jest.fn().mockResolvedValue('https://s3.presigned-url'),
    listS3AlbumImages: jest.fn().mockResolvedValue([
        {
            url: 'https://tests3.amazonaws.com/image1.jpg',
            name: 'image1.jpg',
        },
        {
            url: 'https://tests3.amazonaws.com/image2.png',
            name: 'image2.png',
        }
    ]),
    deleteAlbum: jest.fn().mockResolvedValue('Success'),
}));

const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const createAlbum = async () => {
    await Album.create({
        title: 'Test',
        description: 'Test Description',
        coverImageUrl: 'Test URL',
    });
}

describe('Gallery API Routes', () => {
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
        await Album.deleteMany({});
        jest.restoreAllMocks();
    });

    test('GET /api/gallery/albums should return all existing albums', async () => {
        await createAlbum();
        const response = await request(app).get('/api/gallery/albums');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            __v: expect.any(Number),
            _id: expect.any(String),
            title: 'Test',
            description: 'Test Description',
            coverImageUrl: 'Test URL',
        }]);
    });

    test('GET /api/gallery/albums should return 500 if an error is thrown', async () => {
        jest.spyOn(Album, 'find').mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/gallery/albums');

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual('Failed to load images');
    });

    test('GET /api/gallery/s3AlbumUrl should return a presigned URL given the correct inputs in admin role', async () => {
        const token = generateToken('admin');

        const response = await request(app)
            .get('/api/gallery/s3AlbumUrl?albumId=testId&fileName=test.jpg&fileType=image/jpeg')
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body.url).toBe('https://s3.presigned-url');
        expect(generateAlbumUploadURL).toHaveBeenCalledWith('testId', 'test.jpg', 'image/jpeg');
    });

    test('GET /api/gallery/s3AlbumUrl should return 400 if no params are passed', async () => {
        const token = generateToken('admin');

        const response = await request(app)
            .get('/api/gallery/s3AlbumUrl')
            .set('x-auth-token', token);

        expect(response.status).toBe(400);
        expect(response.body.error).toEqual('Missing albumId, fileName or fileType');
    });

    test('GET /api/gallery/s3AlbumUrl should return 500 if a error is thrown', async () => {
        generateAlbumUploadURL.mockRejectedValue(new Error('AWS S3 Error'));
        const token = generateToken('admin');

        const response = await request(app)
            .get('/api/gallery/s3AlbumUrl?albumId=testId&fileName=test.jpg&fileType=image/jpeg')
            .set('x-auth-token', token);

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual('Server error generating presigned URL');
    });

    test('GET /api/gallery/:albumId/images should return a list of all image objects in the S3 bucket', async () => {
        const response = await request(app).get('/api/gallery/testId/images');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                url: 'https://tests3.amazonaws.com/image1.jpg',
                name: 'image1.jpg',
            },
            {
                url: 'https://tests3.amazonaws.com/image2.png',
                name: 'image2.png',
            }
        ]);
        expect(listS3AlbumImages).toHaveBeenCalledWith('testId');
    });

    test('GET /api/gallery/s3AlbumUrl should return 500 if a error is thrown', async () => {
        listS3AlbumImages.mockRejectedValue(new Error('AWS S3 Error'));

        const response = await request(app).get('/api/gallery/testId/images');

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual('Failed to load images');
    });

    test('Post /api/gallery/update should create a new album', async () => {
        const token = generateToken('admin');
        const newAlbumData = {
            _id: '',
            title: 'Test',
            description: 'Test Description',
            coverImageUrl: 'Test URL',
        };

        const response = await request(app)
            .post('/api/gallery/update')
            .set('x-auth-token', token)
            .send(newAlbumData);
        const albums = await Album.find();

        expect(response.status).toBe(200);
        expect(albums.length).toBe(1);
        expect(albums[0].title).toBe('Test');
    });

    test('Post /api/gallery/update should update a existing album with a id', async () => {
        const token = generateToken('admin');
        const album = await Album.create({
            title: 'Test',
            description: 'Test Description',
            coverImageUrl: 'Test URL',
        });
        const newAlbumData = {
            _id: album._id,
            title: 'Test Update',
            description: 'Test Description Update',
            coverImageUrl: 'Test URL Update',
        };

        const response = await request(app)
            .post('/api/gallery/update')
            .set('x-auth-token', token)
            .send(newAlbumData);
        const albums = await Album.find();

        expect(response.status).toBe(200);
        expect(albums[0].title).toBe('Test Update');
        expect(albums[0].description).toBe('Test Description Update');
        expect(albums[0].coverImageUrl).toBe('Test URL Update');
    });

    test('Post /api/gallery/update should return 500 if the album id is invalid', async () => {
        const token = generateToken('admin');
        const newAlbumData = {
            _id: 'testId',
            title: 'Test Update',
            description: 'Test Description Update',
            coverImageUrl: 'Test URL Update',
        };

        const response = await request(app)
            .post('/api/gallery/update')
            .set('x-auth-token', token)
            .send(newAlbumData);

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual('An error occurred while creating/updating a album');
    });

    test('Delete /api/gallery/:id should delete the album with the given id', async () => {
        const token = generateToken('admin');
        const album = await Album.create({
            title: 'Test',
            description: 'Test Description',
            coverImageUrl: 'Test URL',
        });

        const response = await request(app)
            .delete(`/api/gallery/${album._id}`)
            .set('x-auth-token', token);
        const albums = await Album.find();

        expect(response.status).toBe(200);
        expect(albums.length).toBe(0);
        console.log(deleteAlbum.mock.calls);
        expect(deleteAlbum).toHaveBeenCalledWith(album._id.toString());
    });

    test('Delete /api/gallery/:id should return 500 if an none existant album id is passed', async () => {
        const token = generateToken('admin');
        albumId = "67c251efb3353b042411c71e";

        const response = await request(app)
            .delete(`/api/gallery/${albumId}`)
            .set('x-auth-token', token);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Album not found');
    });

    test('Delete /api/gallery/:id should return 500 if an invalid album id is passed', async () => {
        const token = generateToken('admin');
        albumId = "abc";

        const response = await request(app)
            .delete(`/api/gallery/${albumId}`)
            .set('x-auth-token', token);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while deleting the album');
    });
});