<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventService, { Event } from '../services/eventService';
import AuthService from '../services/authService';

const eventService = new EventService();
const authService = new AuthService();

const eventDetails = ref<Event>({
    eventTitle: '',
    eventDetails: '',
    eventPrice: 0,
    eventImageUrl: '',
});

const showModifyEventModal = ref<boolean>(false);

onMounted(async () => {
    try {
        const event = await eventService.getEventDetails();

        eventDetails.value = {
            eventTitle: event.eventTitle,
            eventDetails: event.eventDetails,
            eventPrice: event.eventPrice,
            eventImageUrl: event.eventImageUrl
        };
    } catch (err) {

    }
})

const checkUserRoleIsAdmin = (): boolean => {
    const userRole = authService.getUserRole();

    if (userRole && userRole === "admin") {
        return true;
    }
    return false;
}

const registerForEvent = () => {
    console.log();
}
</script>

<template>
    <div id="events" class="font-lexand">
        <BContainer class="pt-5">
            <BRow class="pb-5">
                <BCol md="6">
                    <h1>Our Upcoming Event</h1>
                </BCol>
                <BCol md="6" class="d-flex align-items-center">
                    <BButton v-if="checkUserRoleIsAdmin()" class="pink-button " @click="showModifyEventModal = true">Edit Event Details</BButton>
                </BCol>
            </BRow>
            <BRow class="d-flex">
                <BCol md="7" class="d-flex justify-content-center align-items-center">
                    <BImg
                    id="event-image" 
                    :src="eventDetails.eventImageUrl"
                    img-alt="Event Image"
                    />
                </BCol>
                <BCol md="5" class="mt-5 d-flex flex-column justify-content-center align-items-center">
                    <BRow class="">
                        <h3>{{ eventDetails.eventTitle }}</h3>
                    </BRow>
                    <BRow class="">
                        <p>{{ eventDetails.eventDetails }}</p>
                    </BRow>
                    <BRow class="">
                        <BButton class="pink-button" @click="registerForEvent()">Register Now</BButton>
                    </BRow>
                </BCol>
            </BRow>
        </BContainer>
    </div>

    <ModifyEventModal 
        v-if="showModifyEventModal && checkUserRoleIsAdmin()"
        :currentEventDetails="eventDetails"
        v-bind:showModifyEventModal="showModifyEventModal" 
        @update:showModifyEventModal="showModifyEventModal = $event"
    />
</template>

<style scoped>
#events {
    background-color: #FFF4E9;
    height: calc(100vh - 76px);
}

#event-image {
    background-color: white;
    max-height: 60vh;
    max-width: 80vw;
}
</style>
