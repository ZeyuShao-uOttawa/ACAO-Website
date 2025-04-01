<script setup lang="ts">
import GalleryService from '../../services/galleryService';

interface DeleteAlbumModalProps {
    albumId: string;
    showDeleteAlbumModal: boolean;
}
const props = defineProps<DeleteAlbumModalProps>();

const emit = defineEmits<{
    (event: 'update:showDeleteAlbumModal', value: boolean): void,
    (event: 'update:reload', value: boolean): void
}>();

const closeDeleteAlbumModal = () => {
  emit('update:showDeleteAlbumModal', false);
};

const galleryService = new GalleryService();

const deleteAlbumDetails = async() => {
    try {
        await galleryService.deleteAlbum(props.albumId);
        closeDeleteAlbumModal();
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
            :class="{'show': props.showDeleteAlbumModal}" 
            style="display: block;"
            :aria-hidden="!props.showDeleteAlbumModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Are You Sure You Want To Delete This Album?</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeDeleteAlbumModal"></button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeDeleteAlbumModal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteAlbumDetails">Delete Album</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
</style>