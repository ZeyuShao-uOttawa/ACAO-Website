<script setup lang="ts">
import { onMounted, ref } from "vue";
import ImageService, { Image } from "../services/imageService";

const imageService = new ImageService();

// Reactive state variables
const selectedFile = ref<File | null>(null);
const uploadSuccess = ref<boolean | null>(null);
const isUploading = ref<boolean>(false);
const images = ref<Image[]>([]);
const selectedImage = ref<string | null>(null);

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
        uploadSuccess.value = null; // Reset upload status
    }
};

const fetchImages = async () => {
    try {
        images.value = await imageService.getAllImages();
        console.log(images);
    } catch (err) {
        console.error("Error loading images");
    }
}

const uploadFile = async () => {
    if (!selectedFile.value) {
        console.error("No file selected.");
        return;
    }

    isUploading.value = true;

    try {
        uploadSuccess.value = await imageService.uploadImage(selectedFile.value);

    } catch (error) {
        console.error("Upload failed:", error);
        uploadSuccess.value = false;
    } finally {
        isUploading.value = false;
    }
};

const selectImage = (imageUrl: string) => {
    selectedImage.value = imageUrl;
};

onMounted(async () => {
    fetchImages();
})
</script>

<template>
    <div>
        <div class="upload-container">
            <BFormGroup label="Choose an image to upload:" label-for="file-input">
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

            <p v-if="uploadSuccess === true" class="success-message">✅ Upload Successful!</p>
            <p v-if="uploadSuccess === false" class="error-message">❌ Upload Failed. Try Again.</p>
        </div>
        <div class="image-grid">
            <div
                v-for="image in images"
                :key="image.name"
                class="image-item"
                @click="selectImage(image.url)"
            >
                <img :src="image.url" :alt="image.name" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.upload-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
}

.success-message {
    color: green;
}

.error-message {
    color: red;
}
</style>