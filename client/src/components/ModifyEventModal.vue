<script setup lang="ts">
import { computed } from 'vue'
import EventService, { Event } from '../services/eventService';

interface SignInModalProps {
    showModifyEventModal: boolean;
    currentEventDetails: Event;
}

const props = defineProps<SignInModalProps>();

const emit = defineEmits<{
    (event: 'update:showModifyEventModal', value: boolean): void
}>();

const eventService = new EventService();

let eventForm: Event = props.currentEventDetails;

const closeModifyEventModal = () => {
  emit('update:showModifyEventModal', false);
};

const isUpdateEventButtonDisabled = computed(() => {
    return false;
})

const updateEvent = async() => {
    try {
        await eventService.updateEvent(eventForm);
        closeModifyEventModal();
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
            :class="{'show': props.showModifyEventModal}" 
            style="display: block;"
            :aria-hidden="!props.showModifyEventModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Event Details</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeModifyEventModal"></button>
                    </div>
                    <div class="modal-body">
                        <BForm>
                            <BFormGroup
                              id="title-label"
                              class="mb-2"
                              label="Event Title:"
                              label-for="title"
                            >
                                <BFormInput
                                    id="title"
                                    v-model="eventForm.eventTitle"
                                    type="title"
                                    placeholder="Enter Event Title"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="detail-label" 
                                class="mb-2" 
                                label="Event Details:" 
                                label-for="detail"
                            >
                                <BFormInput
                                    id="detail"
                                    v-model="eventForm.eventDetails"
                                    type="detail"
                                    placeholder="Enter Event Details"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="location-label" 
                                class="mb-2" 
                                label="Event Location:" 
                                label-for="location"
                            >
                                <BFormInput
                                    id="location"
                                    v-model="eventForm.eventLocation"
                                    type="location"
                                    placeholder="Enter Event Location"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="price-label" 
                                class="mb-2" 
                                label="Event Price:" 
                                label-for="price"
                            >
                                <BFormInput
                                    id="price"
                                    v-model="eventForm.eventPrice"
                                    type="price"
                                    placeholder="Enter Event Price"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="image-label" 
                                class="mb-2" 
                                label="Event Image URL: (Google Drive Share Image Link)" 
                                label-for="event-image"
                            >
                                <BFormInput
                                    id="event-image"
                                    v-model="eventForm.eventImageUrl"
                                    type="event-image"
                                    placeholder="Enter Event Image URL"
                                ></BFormInput>
                            </BFormGroup>
                          </BForm>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModifyEventModal">Cancel</button>
                        <button id="signInButton" type="button" class="btn btn-primary" @click="updateEvent" :disabled="isUpdateEventButtonDisabled">Update Event</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px); 
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1200;
}
</style>