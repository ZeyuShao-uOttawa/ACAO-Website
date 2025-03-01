import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SignInModal from '../../src/components/SignInModal.vue'

describe('SignInModal.vue', () => {
  it('should renders the modal name', () => {
    const wrapper = mount(SignInModal);

    expect(wrapper.text()).toContain('Sign In');
  });

  it('should validate valid email input', async () => {
    const wrapper = mount(SignInModal);

    const emailInput = wrapper.find("input#email");

    await emailInput.setValue("test@example.com");

    expect(wrapper.vm.signInForm.email).toBe("test@example.com");
    expect(emailInput.classes("is-invalid")).toBe(false);
  });

  it('should validate invalid email input', async () => {
    const wrapper = mount(SignInModal);

    const emailInput = wrapper.find("input#email");

    await emailInput.setValue("test@example");

    expect(wrapper.vm.signInForm.email).toBe("test@example");
    expect(emailInput.classes("is-invalid")).toBe(true);
  });

  it('should validate valid password input', async () => {
    const wrapper = mount(SignInModal);

    const passwordInput = wrapper.find("input#password");

    await passwordInput.setValue("123");

    expect(wrapper.vm.signInForm.password).toBe("123");
    expect(passwordInput.classes("is-invalid")).toBe(false);
  });

  it('should validate invalid password input', async () => {
    const wrapper = mount(SignInModal);

    const passwordInput = wrapper.find("input#password");

    await passwordInput.setValue("");

    expect(wrapper.vm.signInForm.password).toBe("");
    expect(passwordInput.classes("is-invalid")).toBe(true);
  });

  it('should disable sign in button both email and password are invalid', async () => {
    const wrapper = mount(SignInModal);

    const signInButton = wrapper.find("#signInButton");

    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    await emailInput.setValue("test");
    await passwordInput.setValue("");

    expect(wrapper.vm.signInForm.email).toBe("test");
    expect(wrapper.vm.signInForm.password).toBe("");
    expect(signInButton.attributes("disabled")).toBeDefined();
  });

  it('should disable sign in button initially', async () => {
    const wrapper = mount(SignInModal);

    const signInButton = wrapper.find("#signInButton");

    expect(signInButton.attributes("disabled")).toBeDefined();
  });

  it('should disable sign in button if only email is invalid', async () => {
    const wrapper = mount(SignInModal);

    const signInButton = wrapper.find("#signInButton");

    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    await emailInput.setValue("test");
    await passwordInput.setValue("123");

    expect(wrapper.vm.signInForm.email).toBe("test");
    expect(wrapper.vm.signInForm.password).toBe("123");
    expect(signInButton.attributes("disabled")).toBeDefined();
  });

  it('should enable sign in button if both email and password are valid', async () => {
    const wrapper = mount(SignInModal);

    const signInButton = wrapper.find("#signInButton");

    const emailInput = wrapper.find("input#email");
    const passwordInput = wrapper.find("input#password");

    await emailInput.setValue("test@example.com");
    await passwordInput.setValue("123");

    expect(wrapper.vm.signInForm.email).toBe("test@example.com");
    expect(wrapper.vm.signInForm.password).toBe("123");
    expect(signInButton.attributes("disabled")).toBeUndefined();
  });
});