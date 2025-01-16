<script setup lang="ts">
import { reactive } from 'vue'
import TeamService, { ExecDetails } from '../../services/teamService';

interface AddExecModalProps {
    showUpdateExecModal: boolean;
    execDetails: ExecDetails;
}
const props = defineProps<AddExecModalProps>();

const emit = defineEmits<{
    (event: 'update:showUpdateExecModal', value: boolean): void,
    (event: 'update:reload', value: boolean): void
}>();

const closeAddExecModal = () => {
  emit('update:showUpdateExecModal', false);
};

let execForm = reactive<ExecDetails>(props.execDetails);

const teamService = new TeamService();

const updateExecDetails = async() => {
    try {
        await teamService.updateExecDetails(execForm);
        closeAddExecModal();
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
            :class="{'show': props.showUpdateExecModal}" 
            style="display: block;"
            :aria-hidden="!props.showUpdateExecModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Event Details</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeAddExecModal"></button>
                    </div>
                    <div class="modal-body">
                        <BForm>
                            <BFormGroup
                              id="name-label"
                              class="mb-2"
                              label="Exec Name:"
                              label-for="name"
                            >
                                <BFormInput
                                    id="name"
                                    v-model="execForm.name"
                                    type="name"
                                    placeholder="Enter Exec Name"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="position-label" 
                                class="mb-2" 
                                label="Exec Position:" 
                                label-for="position"
                            >
                                <BFormInput
                                    id="position"
                                    v-model="execForm.position"
                                    type="position"
                                    placeholder="Enter Exec Position"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="description-label" 
                                class="mb-2" 
                                label="Exec Description:" 
                                label-for="description"
                            >
                                <BFormInput
                                    id="description"
                                    v-model="execForm.description"
                                    type="description"
                                    placeholder="Enter Exec Description"
                                ></BFormInput>
                            </BFormGroup>
                            <BFormGroup 
                                id="image-label" 
                                class="mb-2" 
                                label="Exec Image URL: (Google Drive Share Image Link)" 
                                label-for="exec-image"
                            >
                                <BFormInput
                                    id="exec-image"
                                    v-model="execForm.image"
                                    type="exec-image"
                                    placeholder="Enter Exec Image URL"
                                ></BFormInput>
                            </BFormGroup>
                          </BForm>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeAddExecModal">Cancel</button>
                        <button id="signInButton" type="button" class="btn btn-primary" @click="updateExecDetails">Add/Update Exec</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>