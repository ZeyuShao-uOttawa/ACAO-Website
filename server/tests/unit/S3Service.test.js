const { generateUploadURL, generateAlbumUploadURL, listS3Images, listS3AlbumImages, deleteImage, deleteAlbum, s3Client } = require('../../services/S3Service');
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn().mockResolvedValue('https://s3.presigned-url'),
}));

describe('S3Service', () => {

    test('should generate a presigned URL', async () => {
        const url = await generateUploadURL('test-image.jpg', 'jpg');

        expect(url).toBe('https://s3.presigned-url');
    });

    test('should generate a presigned URL with the album prefix', async () => {
        const url = await generateAlbumUploadURL('testalbum', 'test-image.jpg', 'jpg');

        expect(url).toBe('https://s3.presigned-url');
    });
    
    test('should retrieve all images in aws', async () => {
        jest.spyOn(s3Client, 'send').mockResolvedValue({
            $metadata: { httpStatusCode: 200 },
            Contents: [
                { Key: 'image1.jpg' },
                { Key: 'image2.png' },
            ],
        });
        const expectedRes = {
            images: [
                {
                    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/image1.jpg`,
                    name: 'image1.jpg',
                },
                {
                    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/image2.png`,
                    name: 'image2.png',
                },
            ],
            nextToken: null,
        }

        const images = await listS3Images();

        expect(images).toEqual(expectedRes);
        expect(s3Client.send).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    });

    test('should return an empty array if no images exist', async () => {
        jest.spyOn(s3Client, 'send').mockResolvedValue({
            $metadata: { httpStatusCode: 200 },
            Contents: null,
        });
        const expectedRes = {
            images: [],
            nextToken: null,
        }

        const images = await listS3Images();

        expect(images).toEqual(expectedRes);
        expect(s3Client.send).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    });

    test('should retrieve all images in a specific album in aws', async () => {
        jest.spyOn(s3Client, 'send').mockResolvedValue({
            $metadata: { httpStatusCode: 200 },
            Contents: [
                { Key: 'image1.jpg' },
                { Key: 'image2.png' },
            ],
        });
        const expectedRes = [
                {
                    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/image1.jpg`,
                    name: 'image1.jpg',
                },
                {
                    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/image2.png`,
                    name: 'image2.png',
                },
        ];

        const images = await listS3AlbumImages('testalbum');

        expect(images).toEqual(expectedRes);
        expect(s3Client.send).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
    });

    test('should return successful if image is deleted', async () => {
        jest.spyOn(s3Client, 'send').mockResolvedValue({
            $metadata: { httpStatusCode: 200 },
        });
        const key = 'test_key';

        const res = await deleteImage(key);

        expect(res.$metadata.httpStatusCode).toEqual(200);
    });

    test('should return successful if album is deleted', async () => {
        jest.spyOn(s3Client, 'send').mockResolvedValue({
            $metadata: { httpStatusCode: 200 },
            Contents: [
                { Key: 'image1.jpg' },
                { Key: 'image2.png' },
            ],
        });
        const albumId = 'test_album';

        const res = await deleteAlbum(albumId);

        expect(res.$metadata.httpStatusCode).toEqual(200);
    });

    test('should throw a error if album is not found', async () => {
        jest.spyOn(s3Client, 'send').mockResolvedValue({
            $metadata: { httpStatusCode: 200 },
        });
        const albumId = 'test_album';

        await expect(deleteAlbum(albumId)).rejects.toThrow('Album not found');
    });
});
