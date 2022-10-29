import authApi from '@/api/authApi';

export const createUser = async ({ commit }, user) => {
  const { name, email, password } = user;

  try {
    const { data } = await authApi.post('accounts:signUp', {
      email,
      password,
      returnSecureToken: true
    });
    const { idToken, refreshToken } = data;

    await authApi.post('accounts:update', { displayName: name, idToken });
    delete user.password;
    commit('logInUser', { user, idToken, refreshToken });

    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.response.data.error.message };
  }
};

export const signInUser = async ({ commit }, user) => {
  const { email, password} = user;

  try {
    const { data } = await authApi.post('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true
    });
    const { displayName, idToken, refreshToken } = data;

    user.name = displayName;
    commit('logInUser', { user, idToken, refreshToken });

    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.response.data.error.message };
  }
};

export const checkAuthStatus = async ({ commit }) => {
  const idToken = localStorage.getItem('idToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if ( !idToken ) {
    commit('logOut');
    return { ok: false, message: 'No token found.' };
  }

  try {
    const { data } = await authApi.post('accounts:lookup', { idToken });
    const { displayName, email } = data.users[0];
    const user = { name: displayName, email };

    commit('logInUser', { user, idToken, refreshToken });
    return { ok: true };
  } catch (error) {
    commit('logOut');
    return { ok: false, message: error.response.data.error.message };
  }
};
