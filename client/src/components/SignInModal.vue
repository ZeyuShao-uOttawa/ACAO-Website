<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface SignInModalProps {
    showSignInModal: boolean;
}

const props = defineProps<SignInModalProps>();

const emit = defineEmits<{
    (event: 'update:showSignInModal', value: boolean): void
}>();

const closeSignInModal = () => {
  emit('update:showSignInModal', false);
};
</script>

<template>
    <div
        class="modal fade"
        tabindex="-1"
        :class="{'show': props.showSignInModal}" 
        style="display: block;"
        :aria-hidden="!props.showSignInModal"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="btn-close" aria-label="Close" @click="closeSignInModal"></button>
                </div>
                <div class="modal-body">
                    <p>This is a simple modal in Vue 3 with Bootstrap!</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeSignInModal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>