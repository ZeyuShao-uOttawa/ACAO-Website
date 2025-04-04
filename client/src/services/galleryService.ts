import api from './api';
import AuthService from './authService';
import { Image } from './imageService';
import axios from 'axios'; 

export interface Album {
    _id: string;
    title: string;
    description: string;
    coverImageUrl: string,
}

const authService = new AuthService();

// Service for the PhotoGallery
export default class GalleryService {
    async getAllAlbums(): Promise<Album[]> {
        const res = await api.get('/gallery/albums');

        return res.data;
    }

    async updateAlbumDetails(album: Album) {
        await api.post('/gallery/update', album, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }

    async uploadImageToAlbum(albumId: string, selectedFile: File): Promise<string> {
        const res = await api.get('/gallery/s3AlbumUrl', {
            headers: { 'x-auth-token': authService.getToken() },
            params: {
                albumId: albumId,
                fileName: selectedFile.name,
                fileType: selectedFile.type,
            },
        });

        const url = res.data.url;

        if (!url) {
            throw new Error('Failed to obtain presigned URL.');
        }

        // Uploading file to AWS S3
        await axios.put(url, selectedFile, {
            headers: {
              'Content-Type': selectedFile.type,
            },
        });

        // Removing the presigned part of the URL to return
        const s3ImageUrl = url.split('?')[0];

        return s3ImageUrl;
    }

    async getAllAlbumImages(albumId: string): Promise<Image[]> {
        const res = await api.get(`/gallery/${albumId}/images`);

        return res.data;
    }

    async deleteAlbum(albumId: string) {
        await api.delete(`/gallery/${albumId}`, {
            headers: { 'x-auth-token': authService.getToken() },
        });
    }
}