import { computed } from 'vue';
import { useStore } from 'vuex';

const useAuth = () => {
  const store = useStore();

  const createUser = async (user) => {
    const response = await store.dispatch('auth/createUser', user);
    return response;
  };

  const logInUser = async (user) => {
    const response = await store.dispatch('auth/signInUser', user);
    return response;
  };

  const checkAuthStatus = async () => {
    const response = await store.dispatch('auth/checkAuthStatus');
    return response;
  };

  const logOut = () => {
    store.commit('auth/logOut');
    store.commit('journal/clearEntries');
  };

  return {
    checkAuthStatus,
    createUser,
    logInUser,
    logOut,
    // Computed
    authStatus: computed(() => store.getters['auth/currentStatus']),
    username: computed(() => store.getters['auth/username'])
  };
};

export default useAuth;
