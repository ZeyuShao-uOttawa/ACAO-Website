import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EventsPage from '../../src/components/EventsPage.vue'

describe('EventsPage.vue', () => {
    it('should renders the section name', () => {
        const wrapper = mount(EventsPage);

        expect(wrapper.text()).toContain('Our Upcoming Event');
    });
});