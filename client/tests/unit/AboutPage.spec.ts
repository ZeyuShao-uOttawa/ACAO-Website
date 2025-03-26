import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AboutPage from '../../src/components/AboutPage.vue'

describe('AboutPage.vue', () => {
    it('should renders the section name', () => {
        const wrapper = mount(AboutPage);

        expect(wrapper.text()).toContain('Meet Our Exec Team');
    });
});