import createStore from '@/../tests/unit/mocks/createStore';
import authApi from '@/api/authApi';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const initialState = {
  status: 'authenticated',
  user: { name: 'Tester', email: 'test@mail.com' },
  idToken: 'ABC-123',
  refreshToken: 'XYZ-456'
};

const testIdToken = 'testIdToken';
const testRefreshToken = 'testRefreshToken';

describe('Vuex - Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initial state', () => {
    const store = createStore();
    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe('authenticating');
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
  });

  describe('mutations', () => {
    it('logInUser()', () => {
      const payload = {
        user: { name: 'Tester', email: 'test@mail.com' },
        idToken: 'ABC-123',
        refreshToken: 'XYZ-456'
      };

      const store = createStore();
      store.commit('auth/logInUser', payload);

      const { status, user, idToken, refreshToken } = store.state.auth;

      expect(status).toBe('authenticated');
      expect(user).toStrictEqual(payload.user);
      expect(idToken).toBe(payload.idToken);
      expect(refreshToken).toBe(payload.refreshToken);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
        1, 'idToken', payload.idToken
      );
      expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
        2, 'refreshToken', payload.refreshToken
      );
    });

    it('logOut()', () => {
      const store = createStore(initialState);
      store.commit('auth/logOut');

      const { status, user, idToken, refreshToken } = store.state.auth;

      expect(status).toBe('not-authenticated');
      expect(user).toStrictEqual(null);
      expect(idToken).toBe(null);
      expect(refreshToken).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorageMock.removeItem).toHaveBeenNthCalledWith(1, 'idToken');
      expect(localStorageMock.removeItem).toHaveBeenNthCalledWith(2, 'refreshToken');
    });
  });

  describe('getters', () => {
    let store;

    beforeEach(() => {
      store = createStore(initialState);
    });

    it('currentStatus()', () => {
      expect(store.getters['auth/currentStatus']).toStrictEqual(initialState.status);
    });

    it('username()', () => {
      expect(store.getters['auth/username']).toStrictEqual(initialState.user.name);
    });
  });

  describe('actions', () => {
    authApi.post = jest.fn();

    describe('createUser()', () => {
      it('should throw error when user already exists', async () => {
        const errorMessage = 'EMAIL_EXISTS';
        authApi.post.mockReturnValueOnce(Promise.reject({
          response: { data: { error: { message: errorMessage }}}
        }));
        const newUser = {
          ...initialState.user,
          password: '123456'
        };

        const store = createStore();
        const result = await store.dispatch('auth/createUser', newUser);

        expect(authApi.post).toHaveBeenCalledTimes(1);
        expect(authApi.post).toHaveBeenCalledWith('accounts:signUp', {
          email: newUser.email,
          password: newUser.password,
          returnSecureToken: true
        });
        expect(result).toStrictEqual({ ok: false, message: errorMessage });
      });

      it('should create user when it does not exist', async () => {
        authApi.post.mockReturnValueOnce(Promise.resolve({ data: {
          idToken: testIdToken,
          refreshToken: testRefreshToken
        }}));
        authApi.post.mockReturnValueOnce(Promise.resolve());
        const newUser = {
          ...initialState.user,
          password: '123456'
        };
        const newUserCopy = { ...newUser };

        const store = createStore();
        const result = await store.dispatch('auth/createUser', newUser);

        expect(authApi.post).toHaveBeenCalledTimes(2);
        expect(authApi.post).toHaveBeenNthCalledWith(1, 'accounts:signUp', {
          email: newUserCopy.email,
          password: newUserCopy.password,
          returnSecureToken: true
        });
        expect(authApi.post).toHaveBeenNthCalledWith(2, 'accounts:update', {
          displayName: newUserCopy.name,
          idToken: testIdToken
        });
        expect(result).toStrictEqual({ ok: true });
      });
    });
  });

  describe('checkAuthStatus()', () => {
    it('should return true when user is authenticated', async () => {
      localStorageMock.getItem.mockReturnValueOnce(testIdToken);
      localStorageMock.getItem.mockReturnValueOnce(testRefreshToken);

      const user = { ...initialState.user };
      authApi.post.mockReturnValueOnce(Promise.resolve({ data: {
        users: [{ email: user.email, displayName: user.name }]
      }}));

      const store = createStore();
      store.commit = jest.fn();

      const result = await store.dispatch('auth/checkAuthStatus');

      expect(authApi.post).toHaveBeenCalledTimes(1);
      expect(authApi.post).toHaveBeenNthCalledWith(1, 'accounts:lookup', {
        idToken: testIdToken
      });
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        'auth/logInUser',
        {
          idToken: testIdToken,
          refreshToken: testRefreshToken,
          user
        },
        undefined
      );
      expect(result).toStrictEqual({ ok: true });
    });

    it('should return false when user is not authenticated', async () => {
      localStorageMock.getItem.mockReturnValueOnce('');
      localStorageMock.getItem.mockReturnValueOnce('');

      const store = createStore();
      store.commit = jest.fn();

      const result = await store.dispatch('auth/checkAuthStatus');

      expect(authApi.post).not.toHaveBeenCalled();
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith('auth/logOut', undefined, undefined);
      expect(result).toStrictEqual({ ok: false, message: 'No token found.' });
    });

    it('should return false when user token is invalid', async () => {
      localStorageMock.getItem.mockReturnValueOnce(testIdToken);
      localStorageMock.getItem.mockReturnValueOnce(testRefreshToken);
      const errorMessage = 'INVALID_ID_TOKEN';
      authApi.post.mockReturnValueOnce(Promise.reject({
        response: { data: { error: { message: errorMessage }}}
      }));

      const store = createStore();
      store.commit = jest.fn();

      const result = await store.dispatch('auth/checkAuthStatus');

      expect(authApi.post).toHaveBeenCalledTimes(1);
      expect(authApi.post).toHaveBeenNthCalledWith(1, 'accounts:lookup', {
        idToken: testIdToken
      });
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith('auth/logOut', undefined, undefined);
      expect(result).toStrictEqual({ ok: false, message: errorMessage });
    });
  });
});