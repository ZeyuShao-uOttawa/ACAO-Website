const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.AWS_S3_BUCKET;
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function generateUploadURL(fileName, contentType) {
    const params = {
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
    };
  
    const command = new PutObjectCommand(params);

    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

async function generateAlbumUploadURL(albumId ,fileName, contentType) {
    const albumFileName = `photo-gallery/${albumId}/${fileName}`;

    const params = {
        Bucket: bucketName,
        Key: albumFileName,
        ContentType: contentType,
    };
  
    const command = new PutObjectCommand(params);

    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

async function listS3Images() {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Delimiter: '/',
    });

    const response = await s3Client.send(command);

    return response.Contents?.map((file) => ({
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
        name: file.Key,
    })) || [];
}

async function listS3AlbumImages(albumId) {
    const prefix = `photo-gallery/${albumId}/`;

    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
    });

    const response = await s3Client.send(command);

    return response.Contents?.map((file) => ({
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
        name: file.Key,
    })) || [];
}

module.exports = { generateUploadURL, generateAlbumUploadURL, listS3Images, listS3AlbumImages, s3Client };