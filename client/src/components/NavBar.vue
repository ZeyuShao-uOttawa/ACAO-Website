<script setup lang="ts">
import { ref } from 'vue'
import AuthService from '../services/authService';

const authService = new AuthService();
const showSignInModal = ref<boolean>(false);
</script>

<template>
    <BNavbar class="font-lexand sticky-top" v-b-color-mode="'light'" toggleable="lg" variant="white">
        <BNavbarBrand class="margin-left hover-text-pink">
            <div class="d-flex align-items-center">
                <img class="logo" src="../assets/logo.png" alt="ACAO Logo">
                <BNavItem class="d-flex fs-6" :to="{ path: '/' }">Asian Canadians<br>Association uOttawa</BNavItem>
            </div>
        </BNavbarBrand>

        <BNavbarToggle target="navbar-toggle-collapse"></BNavbarToggle>

        <BCollapse id="navbar-toggle-collapse" is-nav>
            <BNavbarNav class="ms-auto mb-2 mb-lg-0 margin-right">
                <BNavItem class="d-flex align-items-center justify-content-center fs-5 margin-left" :to="{ path: '/', hash: '#events' }">Our Events</BNavItem>
                <BNavItem class="d-flex align-items-center justify-content-center fs-5 margin-left" :to="{ path: '/', hash: '#about' }">Meet the Team</BNavItem>
                <BNavItem class="d-flex align-items-center justify-content-center fs-5 margin-left" :to="{ path: '/gallery' }">Photo Gallery</BNavItem>
                <BButton id="signIn"  v-if="!authService.isAuthenticated()" class="margin-left pink-button" @click="showSignInModal = true">Sign In</BButton>
                <BButton id="signOut" v-else class="margin-left pink-button" @click="authService.logout()">Sign Out</BButton>
            </BNavbarNav>
        </BCollapse>
    </BNavbar>

    <SignInModal v-if="showSignInModal" v-bind:showSignInModal="showSignInModal" @update:showSignInModal="showSignInModal = $event"/>
</template>

<style scoped>
.margin-left {
    margin-left: 2vw;
}

.margin-left {
    margin-right: 2vw;
}

.logo {
    width: 50px;
    height: auto;
    margin-right: 1em;
}

.hover-text-pink:hover {
    color: #ff8ba0 !important; 
}

.navbar-nav {
    --bs-nav-link-hover-color: #ff8ba0 !important;
}

.navbar-nav {
    --bs-nav-link-color: black !important;
}

.pink-button {
  background-color: #ffa8b5;
  border-color: #ffa8b5;
  color: white;
}

.pink-button:hover {
  background-color: #ff8ba0;
  border-color: #ff8ba0;
}
</style>
