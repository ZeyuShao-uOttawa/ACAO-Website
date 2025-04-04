<script setup lang="ts">
import ImageService from '../../services/imageService';

interface DeleteAlbumModalProps {
    imageKey: string;
    imageUrl: string;
    showDeleteImageModal: boolean;
}
const props = defineProps<DeleteAlbumModalProps>();

const emit = defineEmits<{
    (event: 'update:showDeleteImageModal', value: boolean): void,
    (event: 'update:reload', value: boolean): void
}>();

// Close Modal
const closeDeleteAlbumModal = () => {
  emit('update:showDeleteImageModal', false);
};

const imageService = new ImageService();

// Delete image and close modal and reload
const deleteImage = async() => {
    try {
        await imageService.deleteImage(props.imageKey);
        closeDeleteAlbumModal();
        emit('update:reload', true);
    } catch (err) {
        alert("Error while deleting image, please try again later");
    }
}
</script>

<template>
    <div class="modal-backdrop font-lexand delete-image-modal">
        <div
            class="modal fade"
            tabindex="-1"
            :class="{'show': props.showDeleteImageModal}" 
            style="display: block;"
            :aria-hidden="!props.showDeleteImageModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Are You Sure You Want To Delete This Image?</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeDeleteAlbumModal"></button>
                    </div>
                    <div class="modal-body">
                        <img class="img-preview" :key="imageKey" :src="imageUrl" alt="Image to delete"/>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeDeleteAlbumModal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteImage">Delete Image</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
.img-preview {
    max-width: 100%;
}

.delete-image-modal {
    z-index: 20001;
}
</style>