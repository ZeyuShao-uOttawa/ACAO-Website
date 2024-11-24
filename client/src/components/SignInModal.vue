<script setup lang="ts">
interface SignInModalProps {
    showSignInModal: boolean;
}

const props = defineProps<SignInModalProps>();

const emit = defineEmits<{
    (event: 'update:showSignInModal', value: boolean): void
}>();

let signInForm: { email: string; password: string } = {
  email: "",
  password: "",
};

const closeSignInModal = () => {
  emit('update:showSignInModal', false);
};

const onSubmit = () => {
    alert(JSON.stringify(signInForm))
}
</script>

<template>
    <div class="modal-backdrop">
        <div
            class="modal fade"
            tabindex="-1"
            :class="{'show': props.showSignInModal}" 
            style="display: block;"
            :aria-hidden="!props.showSignInModal"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sign In</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeSignInModal"></button>
                    </div>
                    <div class="modal-body">
                        <b-form @submit="onSubmit">
                            <b-form-group
                              id="email-label"
                              label="Email address:"
                              label-for="email"
                              description="We'll never share your email with anyone else."
                            >
                              <b-form-input
                                id="email"
                                v-model="signInForm.email"
                                type="email"
                                placeholder="Enter email"
                                required
                              ></b-form-input>
                            </b-form-group>
                      
                            <b-form-group id="password-label" label="Password:" label-for="password">
                              <b-form-input
                                id="password"
                                v-model="signInForm.password"
                                placeholder="Enter name"
                                required
                              ></b-form-input>
                            </b-form-group>
                          </b-form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeSignInModal">Cancel</button>
                        <button type="button" class="btn btn-primary">Sign In</button>
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