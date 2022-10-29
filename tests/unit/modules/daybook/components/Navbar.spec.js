import { shallowMount } from '@vue/test-utils';
import { useRouter } from 'vue-router';

import useAuth from '@/modules/auth/composables/useAuth';
import Navbar from '@/modules/daybook/components/Navbar';

jest.mock('vue-router', () => {
  const original = jest.requireActual('vue-router');
  return {
    ...original,
    useRouter: jest.fn()
  };
});
const routerMock = {
  push: jest.fn()
};
useRouter.mockReturnValue(routerMock);

jest.mock('@/modules/auth/composables/useAuth');
const logOutMock = jest.fn();
useAuth.mockReturnValue({
  username: 'Tester',
  logOut: logOutMock
});

describe('<NavBar />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Navbar);
    jest.clearAllMocks();
  });

  it('should render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  
  it('should call logOut() when logout button is clicked', async () => {
    await wrapper.find('button').trigger('click');

    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({ name: 'login' });
    expect(logOutMock).toHaveBeenCalledTimes(1);
  });
});
