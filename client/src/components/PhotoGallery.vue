<script setup lang="ts">
import { ref, onMounted } from 'vue';

import AuthService from '../services/authService';
import GalleryService, { Album } from '../services/galleryService';

const authService = new AuthService();
const galleryService = new GalleryService();

const showUpdateAlbumModal = ref<boolean>(false);
const showDeleteAlbumModal = ref<boolean>(false);
const albumCards = ref<Album[]>([]);
const currentAlbum = ref<Album>();
const currentAlbumId = ref<string>();
const albumToOpen = ref<Album|null>(null);

const defaultAlbum: Album = {
    _id: '',
    title: '',
    description: '',
    coverImageUrl: '',
}

const checkUserRoleIsAdmin = (): boolean => {
    const userRole = authService.getUserRole();

    if (userRole && userRole === "admin") {
        return true;
    }
    return false;
}

const addAlbum = () => {
    currentAlbum.value = JSON.parse(JSON.stringify(defaultAlbum)); // Deep copying detault album values
    showUpdateAlbumModal.value = true;
}

const editAlbumDetails = (index: number) => {
    currentAlbum.value = albumCards.value[index];
    showUpdateAlbumModal.value = true;
}

const deleteAlbumDetails = (index: number) => {
    currentAlbumId.value = albumCards.value[index]._id;
    showDeleteAlbumModal.value = true;
}

const openAlbum = (album: Album) => {
    albumToOpen.value = album;
}

const loadAlbumCards = async () => {
    try {
        albumCards.value = await galleryService.getAllAlbums();
    } catch (err) {
        console.log(err);
    }
}

onMounted(async () => {
    loadAlbumCards();
})
</script>

<template>
    <div id="gallery" class="font-lexand">
        <BContainer>
            <h1 class="pt-5 d-flex justify-content-center align-items-center">Event Photo Gallery</h1>
            <BButton v-if="checkUserRoleIsAdmin()" class="pink-button" @click="addAlbum">Add Album</BButton>
            <BRow class="d-flex justify-content-center pt-5 pb-5">
                <BCol v-for="(album, index) in albumCards" :key="index" cols="12" md="6" class="d-flex mb-4">
                    <BCard :title="album.title" class="text-center">
                        <BCardImg
                            :src="album.coverImageUrl"
                            alt="Album Cover Image"
                            class="album-img mx-auto d-block mt-3 mb-3"
                            @click="openAlbum(album)"
                        />
                        <BCardText>{{ album.description }}</BCardText>
                        <BCardFooter v-if="checkUserRoleIsAdmin()">
                            <BButton class="pink-button me-3" @click="editAlbumDetails(index)">Edit</BButton>
                            <BButton class="pink-button" @click="deleteAlbumDetails(index)">Delete</BButton>
                        </BCardFooter>
                    </BCard>
                </BCol>
            </BRow>
        </BContainer>
    </div>
    <AlbumModal
        v-if="albumToOpen"
        :album="albumToOpen"
        @close="albumToOpen = null"
    />
    <DeleteAlbumModal
        v-if="showDeleteAlbumModal && checkUserRoleIsAdmin()"
        :albumId="currentAlbumId!"
        :showDeleteAlbumModal="showDeleteAlbumModal" 
        @update:showDeleteAlbumModal="showDeleteAlbumModal = $event"
        @update:reload="loadAlbumCards()"
    />
    <UpdateAlbumModal
        v-if="showUpdateAlbumModal && checkUserRoleIsAdmin()"
        :album="currentAlbum!"
        :showUpdateAlbumModal="showUpdateAlbumModal" 
        @update:showUpdateAlbumModal="showUpdateAlbumModal = $event"
        @update:reload="loadAlbumCards()"
    />
</template>

<style scoped>
#gallery {
    background-color: #FFF4E9;
    min-height: calc(100vh - 76px);
}

.album-img {
    cursor: pointer;
}
</style>