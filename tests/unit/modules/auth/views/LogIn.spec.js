import { shallowMount } from '@vue/test-utils';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

import useAuth from '@/modules/auth/composables/useAuth';
import LogIn from '@/modules/auth/views/LogIn';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

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
const logInUserMock = jest.fn();
useAuth.mockReturnValue({
  logInUser: logInUserMock
});

describe('<LogIn />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(LogIn);
    jest.clearAllMocks();
  });

  it('should render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
  
  it('should fire SWAL error when logInUser() fails', async () => {
    const testErrorMessage = 'testErrorMessage';
    logInUserMock.mockReturnValue({
      ok: false,
      message: testErrorMessage
    });

    await wrapper.find('form').trigger('submit');

    expect(logInUserMock).toHaveBeenCalledTimes(1);
    expect(logInUserMock).toHaveBeenCalledWith({email: '', password: ''});
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith('Error', testErrorMessage, 'error');
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('should call router.push() when logInUser() success', async () => {
    logInUserMock.mockReturnValue({ ok: true });
    const testEmail = 'test@mail.com';
    const testPassword = '123456';

    const [ emailInput, passwordInput ] = wrapper.findAll('input');
    emailInput.setValue(testEmail);
    passwordInput.setValue(testPassword);
    await wrapper.find('form').trigger('submit');

    expect(logInUserMock).toHaveBeenCalledTimes(1);
    expect(logInUserMock).toHaveBeenCalledWith({
        email: testEmail,
        password: testPassword
    });
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({ name: 'no-entry' });
    expect(Swal.fire).not.toHaveBeenCalled();
  });
});
