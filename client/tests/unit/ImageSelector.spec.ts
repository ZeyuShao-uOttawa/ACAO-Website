import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ImageSelector from '../../src/components/ImageSelector.vue'

describe('ImageSelector.vue', () => {
    it('should renders the button name', () => {
        const wrapper = mount(ImageSelector);

        expect(wrapper.text()).toContain('Choose Image');
    });
});