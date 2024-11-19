import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import NavBar from '../../src/components/NavBar.vue';

describe('NavBar.vue', () => {
  it('renders the nav brand name', () => {
    // Mount the Vue component
    const wrapper = mount(NavBar);

    // Assert that the brand name is contained in the NavBar
    expect(wrapper.text()).toContain('Asian CanadiansAssociation uOttawa');
  });
});