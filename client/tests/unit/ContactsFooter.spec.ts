import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ContactsFooter from '../../src/components/ContactsFooter.vue'

describe('ContactsFooter.vue', () => {
    it('should renders the names of different contact types', () => {
        const wrapper = mount(ContactsFooter);

        expect(wrapper.text()).toContain('Instagram');
        expect(wrapper.text()).toContain('Discord');
        expect(wrapper.text()).toContain('TikTok');
    });
});