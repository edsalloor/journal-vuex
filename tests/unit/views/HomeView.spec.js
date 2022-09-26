import { shallowMount } from '@vue/test-utils';

import HomeView from '@/views/HomeView';

const routerMock = {
  push: jest.fn()
};

describe('AboutView', () => {
  const wrapper = shallowMount(HomeView, {
    global: {
      mocks: {
        $router: routerMock
      }
    }
  });

  it('should render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should redirect to "no-entry" on click', () => {
    wrapper.find('button').trigger('click');

    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({name: 'no-entry'});
  });
});
