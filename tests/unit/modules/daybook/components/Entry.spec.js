import { shallowMount } from '@vue/test-utils';

import Entry from '@/modules/daybook/components/Entry';

const routerMock = {
  push: jest.fn()
};

const defaultProps = { entry: {
  id: 'DEF456',
  text: 'Hello Friend!',
  date: 1627077227979
}};

const setup = props => shallowMount(Entry, {
  props: { ...defaultProps, props },
  global: {
    mocks: { $router: routerMock }
  }
});

describe('<Entry />', () => {
  const wrapper = setup();

  it('should render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should redirect on click', () => {
    const entryContainer = wrapper.find('.entry-container');

    entryContainer.trigger('click');

    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({
      name: 'entry',
      params: { id: defaultProps.entry.id }
    });
  });

  it('computed props', () => {
    expect(wrapper.vm.day).toBe(23);
    expect(wrapper.vm.month).toBe('July');
    expect(wrapper.vm.yearDay).toBe('2021, Friday');
  });
});
