<script setup lang="ts">
import { reactive } from 'vue'
import GalleryService, { Album } from '../../services/galleryService';

interface UpdateAlbumModalProps {
    showUpdateAlbumModal: boolean;
    album: Album;
}
const props = defineProps<UpdateAlbumModalProps>();

const emit = defineEmits<{
    (event: 'update:showUpdateAlbumModal', value: boolean): void,
    (event: 'update:reload', value: boolean): void
}>();

// Close Modal
const closeUpdateAlbumModal = () => {
    emit('update:showUpdateAlbumModal', false);
};

let albumForm = reactive<Album>(props.album);

const galleryService = new GalleryService();

// Update/Add Album information and close modal and reload the page
const updateAlbumInformation = async() => {
    try {
        await galleryService.updateAlbumDetails(albumForm);
        closeUpdateAlbumModal();
        emit('update:reload', true);
    } catch (err) {
        alert("Invalid inputs");
    }
}
</script>

<template>
    <div class="modal-backdrop font-lexand">
        <div
            class="modal fade"
            tabindex="-1"
            :class="{'show': props.showUpdateAlbumModal}" 
            style="display: block;"
            :aria-hidden="!props.showUpdateAlbumModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add/Update Album</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeUpdateAlbumModal"></button>
                    </div>
                    <div class="modal-body">
                        <BForm>
                            <BFormGroup
                              id="title-label"
                              class="mb-2"
                              label="Album Title:"
                              label-for="title"
                            >
                                <BFormInput
                                    id="title"
                                    v-model="albumForm.title"
                                    type="title"
                                    placeholder="Enter Album Title"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="description-label" 
                                class="mb-2" 
                                label="Album Description:" 
                                label-for="description"
                            >
                                <BFormInput
                                    id="description"
                                    v-model="albumForm.description"
                                    type="description"
                                    placeholder="Enter Album Description"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="image-label" 
                                class="mb-2" 
                                label="Album Cover Image:" 
                                label-for="exec-image"
                            >
                                <ImageSelector @update:selectedImageURL="albumForm.coverImageUrl = $event"/>
                                <div v-if="albumForm.coverImageUrl" class="preview mt-2">
                                    <h5>Selected Image:</h5>
                                    <img :src="albumForm.coverImageUrl" alt="Selected Image" />
                                </div>
                            </BFormGroup>
                          </BForm>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeUpdateAlbumModal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="updateAlbumInformation">Add/Update Album</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-top: 10px;
    border-radius: 8px;
}
</style>