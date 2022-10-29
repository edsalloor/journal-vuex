import { createStore as createVuexStore } from 'vuex';

import authStore from '@/modules/auth/store';
import journalStore from '@/modules/daybook/store/journal';
import authState from '@/../tests/unit/mocks/authState';
import journalState from '@/../tests/unit/mocks/journalState';

const createStore = (authInitState=authState, journalInitState=journalState) =>
  createVuexStore({
    modules: {
      auth: {
        ...authStore,
        state: { ...authInitState }
      },
      journal: {
        ...journalStore,
        state: { ...journalInitState }
      }
    }
  });

export default createStore;
