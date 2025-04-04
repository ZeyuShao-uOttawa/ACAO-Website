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

// Close Modal
const closeAddExecModal = () => {
    emit('update:showUpdateExecModal', false);
};

let execForm = reactive<ExecDetails>(props.execDetails);

const teamService = new TeamService();

// Update/Add Exec information and close modal and reload the page
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
                                label="Exec Image:" 
                                label-for="exec-image"
                            >
                                <ImageSelector @update:selectedImageURL="execForm.image = $event"/>
                                <div v-if="execForm.image" class="preview mt-2">
                                    <h5>Selected Image:</h5>
                                    <img :src="execForm.image" alt="Selected Image" />
                                </div>
                            </BFormGroup>
                          </BForm>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeAddExecModal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="updateExecDetails">Add/Update Exec</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-top: 10px;
    border-radius: 8px;
}
</style>