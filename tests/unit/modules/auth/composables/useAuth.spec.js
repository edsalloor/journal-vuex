import { useStore } from 'vuex';

import useAuth from '@/modules/auth/composables/useAuth';

const storeMock = {
  commit: jest.fn(),
  dispatch: jest.fn(),
  getters: {
    'auth/currentStatus': 'authenticated',
    'auth/username': 'testermaster'
  }
};
jest.mock('vuex', () => ({
  useStore: jest.fn()
}));
useStore.mockReturnValue(storeMock);

const newUser = {
  name: 'Tester',
  email: 'test@mail.com'
};
const dispatchReturnValue = 'dispatchReturnValue';
const errorMessage = 'dispatchErrorMessage';

describe('useAuth() hook', () => {
  const {
    createUser,
    logInUser,
    checkAuthStatus,
    logOut,
    // Computed
    authStatus,
    username
  } = useAuth();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser()', () => {
    it('should dispatch "auth/createUser" action', async () => {
      storeMock.dispatch.mockImplementation(() =>
        Promise.resolve(dispatchReturnValue)
      );

      const result = await createUser(newUser);

      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
      expect(storeMock.dispatch).toHaveBeenCalledWith('auth/createUser', newUser);
      expect(result).toBe(dispatchReturnValue);
    });

    it('should throw error when dispatched action rejects', async () => {
      storeMock.dispatch.mockImplementation(() =>
        Promise.reject(new Error(errorMessage))
      );

      try {
        await createUser(newUser);
        throw new Error('Expected error did not thrown');
      } catch (error) {
        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith('auth/createUser', newUser);
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('logInUser()', () => {
    it('should dispatch "auth/signInUser" action', async () => {
      storeMock.dispatch.mockImplementation(() =>
        Promise.resolve(dispatchReturnValue)
      );

      const result = await logInUser(newUser);

      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
      expect(storeMock.dispatch).toHaveBeenCalledWith('auth/signInUser', newUser);
      expect(result).toBe(dispatchReturnValue);
    });

    it('should throw error when dispatched action rejects', async () => {
      storeMock.dispatch.mockImplementation(() =>
        Promise.reject(new Error(errorMessage))
      );

      try {
        await logInUser(newUser);
        throw new Error('Expected error did not thrown');
      } catch (error) {
        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith('auth/signInUser', newUser);
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('checkAuthStatus()', () => {
    it('should dispatch "auth/checkAuthStatus" action', async () => {
      storeMock.dispatch.mockImplementation(() =>
        Promise.resolve(dispatchReturnValue)
      );

      const result = await checkAuthStatus();

      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
      expect(storeMock.dispatch).toHaveBeenCalledWith('auth/checkAuthStatus');
      expect(result).toBe(dispatchReturnValue);
    });

    it('should throw error when dispatched action rejects', async () => {
      storeMock.dispatch.mockImplementation(() =>
        Promise.reject(new Error(errorMessage))
      );

      try {
        await checkAuthStatus();
        throw new Error('Expected error did not thrown');
      } catch (error) {
        expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
        expect(storeMock.dispatch).toHaveBeenCalledWith('auth/checkAuthStatus');
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('logOut()', () => {
    it('should commit mutations', () => {
      logOut();

      expect(storeMock.commit).toHaveBeenCalledTimes(2);
      expect(storeMock.commit).toHaveBeenNthCalledWith(1, 'auth/logOut');
      expect(storeMock.commit).toHaveBeenNthCalledWith(2, 'journal/clearEntries');
    });
  });

  describe('computed', () => {
    it('authStatus', () => {
      expect(authStatus.value).toBe(storeMock.getters['auth/currentStatus']);
    });
  
    it('username', () => {
      expect(username.value).toBe(storeMock.getters['auth/username']);
    });
  });
});
