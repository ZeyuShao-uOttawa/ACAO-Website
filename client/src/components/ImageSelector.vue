<script setup lang="ts">
import { ref } from "vue";
import ImageService, { Image } from "../services/imageService";
import { BButton } from "bootstrap-vue-next";

const imageService = new ImageService();

const emit = defineEmits<{
    (event: 'update:selectedImageURL', value: string): void
}>();

const showImageSelector = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const isUploading = ref<boolean>(false);
const images = ref<Image[]>([]);
const selectedImage = ref<string | null>(null);
const upload = ref<boolean>(false);
const select = ref<boolean>(false);

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    }
};

const fetchImages = async () => {
    try {
        images.value = await imageService.getAllImages();
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
        selectedImage.value = await imageService.uploadImage(selectedFile.value);
        confirmImageSelect();
    } catch (error) {
        console.error("Upload failed");
    } finally {
        isUploading.value = false;
    }
};

const selectImage = (imageUrl: string) => {
    selectedImage.value = imageUrl;
};

const confirmImageSelect = () => {
    if (selectedImage.value) {
        emit('update:selectedImageURL', selectedImage.value);
        showImageSelector.value = false;
    } else {
        alert("No image selected!");
    }
}
</script>

<template>
    <BButton @click="showImageSelector = true; fetchImages()">Choose Image</BButton>
    <div v-if="showImageSelector" class="modal-backdrop font-lexand">
        <div
            class="modal fade"
            tabindex="-1"
            :class="{'show': showImageSelector}" 
            style="display: block;"
            :aria-hidden="!showImageSelector"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Image Selector</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="showImageSelector = false"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="!upload && !select">
                            <BButton 
                                variant="primary"
                                class="btn mt-2 mb-2"    
                                @click="upload = true"
                            >
                                Upload Image
                            </BButton>
                            <BButton 
                                variant="primary"
                                class="btn mt-2 mb-2"    
                                @click="select = true"
                            >
                                Select from Gallery
                            </BButton>
                        </div>
                        <div v-if="upload" class="upload-container">
                            <div>
                                <BButton @click="upload = false">Back</BButton>
                            </div>
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
                        </div>
                        <div v-if="select" class="image-grid">
                            <div>
                                <BButton @click="select = false; selectedImage = null">Back</BButton>
                            </div>
                            <div
                                v-for="image in images"
                                :key="image.name"
                                class="image-item"
                                :class="{ 'selected': selectedImage === image.url }"
                                @click="selectImage(image.url)"
                            >
                                <img :src="image.url" :alt="image.name" />
                            </div>
                            <div>
                                <BButton variant="primary" @click="confirmImageSelect">Select Image</BButton>
                            </div>
                        </div>
                    </div>
                </div>
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

.image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-item {
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    border: 2px solid transparent;
    border-radius: 8px;
}

.image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-item.selected {
    border: 3px solid #007bff;
    box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.5);
}
</style>