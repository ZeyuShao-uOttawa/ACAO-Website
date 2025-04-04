const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { generateUploadURL, listS3Images, deleteImage } = require('../../services/S3Service');
const imageRouter = require('../../routes/image');

const app = express();
app.use(express.json());
app.use('/api/image', imageRouter);

const generateToken = (role) => {
    return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

jest.mock('../../services/S3Service', () => ({
    generateUploadURL: jest.fn().mockResolvedValue('https://s3.presigned-url'),
    listS3Images: jest.fn().mockResolvedValue([
        {
            url: 'https://tests3.amazonaws.com/image1.jpg',
            name: 'image1.jpg',
        },
        {
            url: 'https://tests3.amazonaws.com/image2.png',
            name: 'image2.png',
        }
    ]),
    deleteImage: jest.fn().mockResolvedValue('Success'),
}));

describe('Image API Routes', () => {
    test('GET /api/image/s3Url should return a presigned URL given the correct inputs in admin role', async () => {
        const token = generateToken('admin');

        const response = await request(app)
            .get('/api/image/s3Url?fileName=test.jpg&fileType=image/jpeg')
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body.url).toBe('https://s3.presigned-url');
        expect(generateUploadURL).toHaveBeenCalledWith('test.jpg', 'image/jpeg');
    });

    test('GET /api/image/s3Url should return 400 if fileName is missing', async () => {
        const token = generateToken('admin');

        const response1 = await request(app)
            .get('/api/image/s3Url?fileType=image/jpeg')
            .set('x-auth-token', token);
        const response2 = await request(app)
            .get('/api/image/s3Url?fileName=test.jpg')
            .set('x-auth-token', token);

        expect(response1.status).toBe(400);
        expect(response2.status).toBe(400);
        expect(response1.body.error).toBe('Missing fileName or fileType');
        expect(response2.body.error).toBe('Missing fileName or fileType');
    });

    test('GET /api/image/s3Url should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get('/api/image/s3Url?fileName=test.jpg&fileType=image/jpeg');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
    });

    test('GET /api/image/s3Url should return 500 if `generateUploadURL` throws an error', async () => {
        generateUploadURL.mockRejectedValue(new Error('AWS S3 Error'));
        const token = generateToken('admin');

        const response = await request(app)
            .get('/api/image/s3Url?fileName=test.jpg&fileType=image/jpeg')
            .set('x-auth-token', token);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Server error generating presigned URL');

        generateUploadURL.mockReset();
    });

    test('GET /api/image/s3Url should return 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/image/s3Url?fileName=test.jpg&fileType=image/jpeg')
            .set('x-auth-token', 'invalid-token');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
    });

    test('GET /api/image/s3Url should return 403 if user is not an admin', async () => {
        const token = generateToken('user');

        const response = await request(app)
            .get('/api/image/s3Url?fileName=test.jpg&fileType=image/jpeg')
            .set('x-auth-token', token);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Forbidden');
    });

    test('GET /api/image/listImages should return a list of all image objects in the S3 bucket', async () => {
        const response = await request(app)
            .get('/api/image/listImages');

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
    });

    test('GET /api/image/listImages should return 500 if `listS3Images` throws an error', async () => {
        listS3Images.mockRejectedValue(new Error('AWS S3 Error'));

        const response = await request(app)
            .get('/api/image/listImages');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to load images');

        listS3Images.mockReset();
    });

    test('DELETE /api/image/deleteImage should return 200 if image is deleted properly', async () => {
        const token = generateToken('admin');
        const imageKey = { key: 'test_key' };

        const response = await request(app)
            .delete('/api/image/deleteImage')
            .set('x-auth-token', token)
            .send(imageKey);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successfully deleted image');
    });

    test('DELETE /api/image/deleteImage should return 500 if no key is passed', async () => {
        const token = generateToken('admin');

        const response = await request(app)
            .delete('/api/image/deleteImage')
            .set('x-auth-token', token);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing image key');
    });

    test('DELETE /api/image/deleteImage should return 500 it fails to delete', async () => {
        deleteImage.mockRejectedValue(new Error('AWS S3 Error'));
        const token = generateToken('admin');
        const imageKey = { key: 'test_key' };

        const response = await request(app)
            .delete('/api/image/deleteImage')
            .set('x-auth-token', token)
            .send(imageKey);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to delete image');

        listS3Images.mockReset();
    });
});
