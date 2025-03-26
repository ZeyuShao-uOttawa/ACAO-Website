import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ModifyEventModal from '../../src/components/modals/ModifyEventModal.vue'

describe('ModifyEventModal.vue', () => {
    it('should renders the modal name', () => {
        const wrapper = mount(ModifyEventModal, {
            props: {
                currentEventDetails: {
                    eventTitle: 'Test Event',
                    eventDetails: 'Test Event Details',
                    eventLocation: 'Test Event Location',
                    eventPrice: 3,
                    eventImageUrl: 'test_image.jpg',
                }
            }
        });

        expect(wrapper.text()).toContain('Update Event Details');
    });
});