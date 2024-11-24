import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SignInModal from '../../src/components/SignInModal.vue'

describe('SignInModal.vue', () => {
  it('should renders the modal name', () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Assert that the modal name is contained in the SignInModal
    expect(wrapper.text()).toContain('Sign In');
  });

  it('should validate valid email input', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the email input
    const emailInput = wrapper.find("input#email");

    // Setting the input to a value
    await emailInput.setValue("test@example.com");

    // Assert that the email input field is populated and does not have the is-invalid class
    expect(wrapper.vm.signInForm.email).toBe("test@example.com");
    expect(emailInput.classes("is-invalid")).toBe(false);
  });

  it('should validate invalid email input', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the email input
    const emailInput = wrapper.find("input#email");

    // Setting the input to a value
    await emailInput.setValue("test@example");

    // Assert that the email input field is populated and does have the is-invalid class
    expect(wrapper.vm.signInForm.email).toBe("test@example");
    expect(emailInput.classes("is-invalid")).toBe(true);
  });

  it('should validate valid password input', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the password input
    const passwordInput = wrapper.find("input#password");

    // Setting the input to a value
    await passwordInput.setValue("123");

    // Assert that the password input field is populated and does not have the is-invalid class
    expect(wrapper.vm.signInForm.password).toBe("123");
    expect(passwordInput.classes("is-invalid")).toBe(false);
  });

  it('should validate invalid password input', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the password input
    const passwordInput = wrapper.find("input#password");

    // Setting the input to a value
    await passwordInput.setValue("");

    // Assert that the password input field is populated and does have the is-invalid class
    expect(wrapper.vm.signInForm.password).toBe("");
    expect(passwordInput.classes("is-invalid")).toBe(true);
  });

  it('should disable sign in button both email and password are invalid', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the SignIn button
    const signInButton = wrapper.find("#signInButton");

    // Finding the email and password input
    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    // Setting the inputs to a value
    await emailInput.setValue("test");
    await passwordInput.setValue("");

    // Assert that the sign in button is disabled if any of the fields are invalid
    expect(wrapper.vm.signInForm.email).toBe("test");
    expect(wrapper.vm.signInForm.password).toBe("");
    expect(signInButton.attributes("disabled")).toBeDefined();
  });

  it('should disable sign in button initially', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the SignIn button
    const signInButton = wrapper.find("#signInButton");

    // Assert that the sign in button is disabled initially
    expect(signInButton.attributes("disabled")).toBeDefined();
  });

  it('should disable sign in button if only email is invalid', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the SignIn button
    const signInButton = wrapper.find("#signInButton");

    // Finding the email and password input
    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    // Setting the inputs to a value
    await emailInput.setValue("test");
    await passwordInput.setValue("123");

    // Assert that the sign in button is disabled if any of the fields are invalid
    expect(wrapper.vm.signInForm.email).toBe("test");
    expect(wrapper.vm.signInForm.password).toBe("123");
    expect(signInButton.attributes("disabled")).toBeDefined();
  });

  it('should enable sign in button if both email and password are valid', async () => {
    // Mount the Vue component
    const wrapper = mount(SignInModal);

    // Finding the SignIn button
    const signInButton = wrapper.find("#signInButton");

    // Finding the email and password input
    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    // Setting the inputs to a value
    await emailInput.setValue("test@example.com");
    await passwordInput.setValue("123");

    // Assert that the sign in button is disabled if any of the fields are invalid
    expect(wrapper.vm.signInForm.email).toBe("test@example.com");
    expect(wrapper.vm.signInForm.password).toBe("123");
    expect(signInButton.attributes("disabled")).toBeUndefined();
  });
});