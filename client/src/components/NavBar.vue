<script setup lang="ts">

</script>

<template>
    <b-navbar class="lexend sticky-top" toggleable="lg" type="dark" variant="white">
        <b-navbar-brand class="brand hover-text-pink" href="#">
            <div class="d-flex align-items-center">
                <img class="logo" src="../assets/logo.png" alt="ACAO Logo">
                <span class="fs-6">Asian Canadians<br>Association uOttawa</span>
            </div>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" class="nav-items-container" is-nav>
            <b-navbar-nav>
                <b-nav-item class="fs-5 brand" href="">Our Events</b-nav-item>
                <b-nav-item class="fs-5 brand" href="">Meet the Team</b-nav-item>
                <b-nav-item class="fs-5 brand" href="">Photo Gallery</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<style scoped>
.lexend {
    font-family: 'Lexend', sans-serif;
}

.brand {
    margin-left: 2vw;
}

.logo {
    width: 50px;
    height: auto;
    margin-right: 1em;
}

.nav-items-container {
    justify-content: flex-end;
    margin-right: 2vw;
}

.hover-text-pink:hover {
    color: pink !important; 
}

.navbar-nav {
    --bs-nav-link-hover-color: pink !important;
}

.navbar-nav {
    --bs-nav-link-color: black !important;
}
</style>
