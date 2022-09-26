import { shallowMount } from '@vue/test-utils';

import AboutView from '@/views/AboutView';

describe('AboutView', () => {
  it('should render', () => {
    const wrapper = shallowMount(AboutView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
