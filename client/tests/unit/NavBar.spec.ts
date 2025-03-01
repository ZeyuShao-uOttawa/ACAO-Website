import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import NavBar from '../../src/components/NavBar.vue';

describe('NavBar.vue', () => {
  it('renders the nav brand name', () => {
    const wrapper = mount(NavBar);

    expect(wrapper.text()).toContain('Asian CanadiansAssociation uOttawa');
  });
});