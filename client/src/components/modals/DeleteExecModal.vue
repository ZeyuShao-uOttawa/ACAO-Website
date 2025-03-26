<script setup lang="ts">
import TeamService from '../../services/teamService';

interface AddExecModalProps {
    execId: string;
    showDeleteExecModal: boolean;
}
const props = defineProps<AddExecModalProps>();

const emit = defineEmits<{
    (event: 'update:showDeleteExecModal', value: boolean): void,
    (event: 'update:reload', value: boolean): void
}>();

const closeDeleteExecModal = () => {
  emit('update:showDeleteExecModal', false);
};

const teamService = new TeamService();

const deleteExecDetails = async() => {
    try {
        await teamService.deleteExecDetails(props.execId);
        closeDeleteExecModal();
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
            :class="{'show': props.showDeleteExecModal}" 
            style="display: block;"
            :aria-hidden="!props.showDeleteExecModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Are You Sure You Want To Delete This Exec?</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeDeleteExecModal"></button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeDeleteExecModal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="deleteExecDetails">Delete Exec</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
</style>