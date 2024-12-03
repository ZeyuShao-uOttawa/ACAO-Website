<script setup lang="ts">

</script>

<template>
    <div id="events">
        <BContainer class="pt-5">
            <BRow class="pb-5">
                <BCol md="8">
                    <h1>Our Upcoming Event</h1>
                </BCol>
                <BCol md="4"></BCol>
            </BRow>
            <BRow class="d-flex">
                <BCol md="8" class="d-flex justify-content-center align-items-center">
                    <BCard
                    id="event-image"
                    img-src=""
                    img-alt="Image"
                    img-top
                    tag="article"
                    />
                </BCol>
                <BCol md="4" class="d-flex flex-column justify-content-center align-items-center">
                    <BRow class="">
                        <h3>Event Title</h3>
                    </BRow>
                    <BRow class="">
                        <p>Event details</p>
                    </BRow>
                    <BRow class="">
                        <BButton>Register Now</BButton>
                    </BRow>
                </BCol>
            </BRow>
        </BContainer>
    </div>
</template>

<style scoped>
#events {
    background-color: #FFF4E9;
    height: 100vh;
}

#event-image {
    background-color: white;
    height: 50vh;
    width: 50vh;
}
</style>
