const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function generateUploadURL(fileName, contentType) {
    const bucketName = process.env.AWS_S3_BUCKET;
  
    const params = {
        Bucket: bucketName,
        Key: fileName,
        ContentType: contentType,
    };
  
    const command = new PutObjectCommand(params);

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

async function listS3Images() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_S3_BUCKET
    });

    const response = await s3Client.send(command);

    return response.Contents?.map((file) => ({
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
        name: file.Key,
    })) || [];
}

module.exports = { generateUploadURL, listS3Images };