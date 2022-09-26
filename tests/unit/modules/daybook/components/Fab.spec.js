import { shallowMount } from '@vue/test-utils';
import Fab from '@/modules/daybook/components/Fab';

describe('<Fab />', () => {
  it('should render default icon', () => {
    const wrapper = shallowMount(Fab);
    const iTag = wrapper.find('i');

    expect(iTag.classes('fa-plus')).toBeTruthy();
  });

  it('should render custom icon', () => {
    const customIcon = 'test-icon';
    const wrapper = shallowMount(Fab, {
      props: { icon: customIcon }
    });
    const iTag = wrapper.find('i');

    expect(iTag.classes(customIcon)).toBeTruthy();
  });

  it('should emit "fab:click" event on click', () => {
    const wrapper = shallowMount(Fab);
    wrapper.find('button').trigger('click');

    expect(wrapper.emitted('fab:click')).toHaveLength(1);
  });
});
