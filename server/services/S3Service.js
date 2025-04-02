const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.AWS_S3_BUCKET;
// Creating AWS S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Generating a presigned url to allow upload image to the S3 bucket
async function generateUploadURL(fileName, contentType) {

    // The parameters for the command
    const params = {
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
    };
    
    // Creating the command
    const command = new PutObjectCommand(params);

    // Generating the signed url which expires in 60 seconds
    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

// Generating a presigned url with a album prefix to allow upload image to the S3 bucket within a "folder"
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

// Listing all the images in the base S3 bucket
async function listS3Images(continuationToken = null, limit = 20) {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Delimiter: '/',
        MaxKeys: limit,
        ContinuationToken: continuationToken || undefined,
    });

    const response = await s3Client.send(command);

    // Mapping the image key to the full URL to allow for displaying image
    return {
        images: response.Contents?.map((file) => ({
            url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
            name: file.Key,
        })) || [],
        nextToken: response.IsTruncated ? response.NextContinuationToken : null,
    };
}

// Listing all the images within a specific folder in the S3 bucket
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

// Deleting a specific image from the S3 bucket
async function deleteImage(imageKey) {
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
    });

    const response = await s3Client.send(command);
    return response;
}

// Deleting a folder in the S3 bucket
async function deleteAlbum(albumId) {
    const prefix = `photo-gallery/${albumId}/`;

    // First retrieve all the images within the folder
    const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
    });

    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length == 0) {
        throw new Error('Album not found');
    }

    // Next delete all the images within the folder to remove the folder
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key }));

    const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
            Objects: objectsToDelete,
            Quiet: true,
        },
    });

    const deleteResponse = await s3Client.send(deleteCommand);
    return deleteResponse;
}

module.exports = { s3Client, generateUploadURL, generateAlbumUploadURL, listS3Images, listS3AlbumImages, deleteImage, deleteAlbum };