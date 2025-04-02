import api from './api';
import AuthService from './authService';
import axios from 'axios'; 

export interface Image { 
    url: string; 
    name: string
}

const authService = new AuthService();

export default class ImageService {
    async uploadImage(selectedFile: File): Promise<string> {
        const res = await api.get('/image/s3Url', {
            headers: { 'x-auth-token': authService.getToken() },
            params: {
                fileName: selectedFile.name,
                fileType: selectedFile.type,
            },
        });

        const url = res.data.url;

        if (!url) {
            throw new Error('Failed to obtain presigned URL.');
        }

        await axios.put(url, selectedFile, {
            headers: {
              'Content-Type': selectedFile.type,
            },
        });

        const s3ImageUrl = url.split('?')[0];

        return s3ImageUrl;
    }

    async getAllImages(token: string|null = null, limit: number = 20): Promise<{images: Image[], nextToken: string|null}> {
        const res = await api.get('/image/listImages',{
            params: {
                token: token,
                limit: limit,
            }
        });

        return res.data;
    }

    async deleteImage(key: string) {
        await api.delete(`/image/deleteImage`, {
            headers: { 'x-auth-token': authService.getToken() },
            data: { key },
        });
    }
}