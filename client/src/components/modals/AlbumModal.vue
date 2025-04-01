<script setup lang="ts">
import { ref, watch } from 'vue';
import GalleryService, { Album } from '../../services/galleryService';
import { Image } from '../../services/imageService';
import AuthService from '../../services/authService';

const galleryService = new GalleryService();
const authService = new AuthService();

interface AlbumModalProps {
    album: Album;
}
const props = defineProps<AlbumModalProps>();

const images = ref<Image[]>([]);
const selectedFile = ref<File | null>(null);
const isUploading = ref<boolean>(false);
const selectedImage = ref<string | null>(null);
const showDeleteImageModal = ref<boolean>(false);
const imageKeyToDelete = ref<string>();
const imageUrlToDelete = ref<string>();

const checkUserRoleIsAdmin = (): boolean => {
    const userRole = authService.getUserRole();

    if (userRole && userRole === "admin") {
        return true;
    }
    return false;
}

const fetchImages = async (albumId: string) => {
    images.value = await galleryService.getAllAlbumImages(albumId);
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    }
};

const uploadFile = async () => {
    if (!selectedFile.value) {
        console.error("No file selected.");
        return;
    }

    isUploading.value = true;

    try {
        selectedImage.value = await galleryService.uploadImageToAlbum(props.album._id, selectedFile.value);
        fetchImages(props.album._id);
    } catch (error) {
        console.error("Upload failed");
    } finally {
        isUploading.value = false;
    }
};

const deleteImage = (key: string, url:string) => {
    imageKeyToDelete.value = key;
    imageUrlToDelete.value = url;
    showDeleteImageModal.value = true;
}

watch(
    () => props.album,
    (newVal) => {
        if (newVal) fetchImages(newVal._id);
    },
    { immediate: true }
)
</script>

<template>
    <div class="album-modal">
        <BContainer>
            <button class="close-btn" @click="$emit('close')">X</button>
            <h2 class="pt-5 d-flex justify-content-center align-items-center">{{ album.title }}</h2>
            <div v-if="checkUserRoleIsAdmin()">
                <BFormGroup label="Choose an image to upload to the album:" label-for="file-input">
                    <BFormFile
                        id="file-input"
                        v-model="selectedFile"
                        accept="image/*"
                        placeholder="Choose a file..."
                        browse-text="Select File"
                        @change="handleFileChange"
                    />
                </BFormGroup>
                <BButton
                    variant="primary"
                    class="mt-3"
                    :disabled="!selectedFile || isUploading"
                    @click="uploadFile"
                >
                    {{ isUploading ? "Uploading..." : "Upload" }}
                </BButton>
            </div>
            <div class="image-grid">
                <div v-for="image in images">
                    <img
                    :key="image.name"
                    :src="image.url"
                    alt="Album Image"
                />
                <BButton v-if="checkUserRoleIsAdmin()" class="pink-button" @click="deleteImage(image.name, image.url)">Delete Image</BButton>
                </div>
            </div>
        </BContainer>
    </div>
    <DeleteImageModal
        v-if="showDeleteImageModal"
        :imageKey="imageKeyToDelete"
        :imageUrl="imageUrlToDelete"
        :showDeleteImageModal="showDeleteImageModal"
        @update:showDeleteImageModal="showDeleteImageModal = $event"
        @update:reload="fetchImages(album._id)"
    />
</template>

<style scoped>
.album-modal {
    position: fixed;
    inset: 0;
    background: #000000ee;
    color: white;
    z-index: 20000;
    padding: 2rem;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 2rem;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 15px;
    margin-top: 2rem;
}

.image-grid img {
    width: 100%;
    border-radius: 8px;
}
</style>