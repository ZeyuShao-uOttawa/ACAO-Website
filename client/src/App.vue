<script setup lang="ts">
import { onMounted } from 'vue'
import AuthService from './services/authService';

const authService = new AuthService();

onMounted(() => {
    setTimeout(() => {
        console.log("mounted")
        authService.verifyToken();
    }, 1000);
})
</script>

<template>
    <RouterView />
</template>

<style scoped>
html {
    scroll-behavior: smooth;
}
</style>
