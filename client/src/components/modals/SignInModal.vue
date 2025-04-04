<script setup lang="ts">
import { ref, computed } from 'vue'
import AuthService from '../../services/authService';

interface SignInModalProps {
    showSignInModal: boolean;
}

const props = defineProps<SignInModalProps>();

const emit = defineEmits<{
    (event: 'update:showSignInModal', value: boolean): void
}>();

const authService = new AuthService();

let signInForm: { email: string; password: string } = {
  email: "",
  password: "",
};

let emailState = ref<boolean|null>(null);
let passwordState = ref<boolean|null>(null);

// Close Modal
const closeSignInModal = () => {
  emit('update:showSignInModal', false);
};

// Making sure email format is correct
const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailState.value = emailRegex.test(signInForm.email);
};

// Making sure a password is entered
const validatePassword = () => {
    passwordState.value = signInForm.password.length > 0;
};

// Disables sign in button until input fields are correct
const isSignInButtonDisabled = computed(() => {
    return !(emailState.value == true && passwordState.value == true);
})

// Sign in user and close modal
const onSignIn = async() => {
    try {
        await authService.login(signInForm);
        closeSignInModal();
    } catch (err) {
        alert("Invalid credentials");
    }
}
</script>

<template>
    <div class="modal-backdrop font-lexand">
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
                        <BForm>
                            <BFormGroup
                              id="email-label"
                              class="mb-2"
                              label="Email address:"
                              label-for="email"
                            >
                                <BFormInput
                                    id="email"
                                    v-model="signInForm.email"
                                    type="email"
                                    @input="validateEmail"
                                    :class="{ 'is-invalid': emailState == false  }"
                                    placeholder="Enter your email"
                                ></BFormInput>
                                <BFormInvalidFeedback id="invalid-email">
                                    Please enter a valid email address.
                                </BFormInvalidFeedback>
                            </BFormGroup>
                            <BFormGroup id="password-label" class="mb-2" label="Password:" label-for="password">
                                <BFormInput
                                    id="password"
                                    v-model="signInForm.password"
                                    type="password"
                                    @input="validatePassword"
                                    :class="{ 'is-invalid': passwordState == false }"
                                    placeholder="Enter your password"
                                ></BFormInput>
                                <BFormInvalidFeedback id="invalid-password">
                                    Please enter a password
                                </BFormInvalidFeedback>
                            </BFormGroup>
                          </BForm>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeSignInModal">Cancel</button>
                        <BButton id="signInButton" type="button" class="pink-button" @click="onSignIn" :disabled="isSignInButtonDisabled">Sign In</BButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>