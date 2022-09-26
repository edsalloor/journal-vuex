import { createStore } from 'vuex';

import defaultInitialState from '@/../tests/unit/mocks/journalState';
import journalApi from '@/api/journalApi';
import journalModule from '@/modules/daybook/store/journal';

jest.mock('@/api/journalApi');

const setupStore = (initialState=defaultInitialState) => createStore({
  modules: {
    journal: {
      ...journalModule,
      state: { ...initialState }
    }
  }
});

describe('Vuex - Journal Store', () => {
  it('initial state', () => {
    const store = setupStore();
    const { entries, isLoading } = store.state.journal;

    expect(entries).toStrictEqual(defaultInitialState.entries);
    expect(isLoading).toBe(defaultInitialState.isLoading);
  });

  describe('mutations', () => {
    it('setEntries()', () => {
      const store = setupStore({ entries: [], isLoading: true });
      store.commit('journal/setEntries', defaultInitialState.entries);

      expect(store.state.journal.entries).toStrictEqual(defaultInitialState.entries);
      expect(store.state.journal.isLoading).toBe(true);

      store.commit('journal/setEntries', defaultInitialState.entries);
      expect(store.state.journal.entries).toStrictEqual([
        ...defaultInitialState.entries,
        ...defaultInitialState.entries
      ]);
      expect(store.state.journal.isLoading).toBe(true);
    });

    it('updateEntry()', () => {
      const updatedEntry = {
        id: defaultInitialState.entries[1].id,
        text: 'Goodbye Friend!',
        date: 1627077227980
      };
      const expectedEntries = [
        defaultInitialState.entries[0],
        updatedEntry
      ];

      const store = setupStore();
      store.commit('journal/updateEntry', updatedEntry);

      expect(store.state.journal.entries).toStrictEqual(expectedEntries);
    });

    it('addEntry()', () => {
      const newEntry = {
        id: 'XYZ',
        text: 'How are you doing?',
        date: 1627077227981
      };
      const expectedEntries = [
        newEntry,
        ...defaultInitialState.entries
      ];

      const store = setupStore();
      store.commit('journal/addEntry', newEntry);

      expect(store.state.journal.entries).toStrictEqual(expectedEntries);
    });

    it('removeEntry()', () => {
      const expectedEntries = [
        defaultInitialState.entries[0]
      ];

      const store = setupStore();
      store.commit('journal/removeEntry', defaultInitialState.entries[1].id);

      expect(store.state.journal.entries).toStrictEqual(expectedEntries);
    });
  });

  describe('getters', () => {
    let store;

    beforeEach(() => {
      store = setupStore();
    });

    it('getEntriesByTerm()', () => {
      expect(store.getters['journal/getEntriesByTerm']('')).toStrictEqual(defaultInitialState.entries);
      expect(store.getters['journal/getEntriesByTerm']('World')).toStrictEqual([defaultInitialState.entries[0]]);
    });

    it('getEntryById()', () => {
      expect(store.getters['journal/getEntryById']('ABC123')).toStrictEqual(defaultInitialState.entries[0]);
    });
  });

  describe('actions', () => {
    it('loadEntries', async () => {
      const entryIds = defaultInitialState.entries.map(entry => entry.id);
      const entriesObj = {};
      entryIds.forEach((id, idx) => {
        const entryContent = { ...defaultInitialState.entries[idx] };
        delete entryContent.id;
        entriesObj[id] = entryContent;
      });
      journalApi.get = jest.fn(() => Promise.resolve({ data: entriesObj }));

      const store = setupStore({ entries: [], isLoading: false });
      await store.dispatch('journal/loadEntries');

      expect(journalApi.get).toHaveBeenCalledTimes(1);
      expect(journalApi.get).toHaveBeenCalledWith('/entries.json');
      expect(store.state.journal.entries).toStrictEqual(defaultInitialState.entries);
    });

    it('updateEntry', async () => {
      const updatedEntry = {
        id: defaultInitialState.entries[0].id,
        text: 'This entry has been updated!',
        date: 1627077227990,
        picture: 'https://res.cloudinary.com/cat.jpg'
      };
      const expectedEntries = [
        updatedEntry,
        defaultInitialState.entries[1]
      ];
      const expectedPayload = { ...updatedEntry };
      delete expectedPayload.id;
      journalApi.put = jest.fn(() => Promise.resolve({ data: expectedPayload }));

      const store = setupStore();
      await store.dispatch('journal/updateEntry', updatedEntry);

      expect(journalApi.put).toHaveBeenCalledTimes(1);
      expect(journalApi.put).toHaveBeenCalledWith(`/entries/${updatedEntry.id}.json`, expectedPayload);
      expect(store.state.journal.entries).toStrictEqual(expectedEntries);
    });

    it('createEntry', async () => {
      const entryData = {
        text: 'This is a new entry!',
        date: 1627077227991,
        picture: 'https://res.cloudinary.com/cat.jpg'
      };
      const expectedNewEntry = {
        id: 'UVW',
        ...entryData
      };
      const expectedEntries = [
        expectedNewEntry,
        ...defaultInitialState.entries
      ];

      journalApi.post = jest.fn(() => Promise.resolve({ data: { name: expectedNewEntry.id }}));

      const store = setupStore();
      const result = await store.dispatch('journal/createEntry', entryData);

      expect(result).toStrictEqual(expectedNewEntry);
      expect(store.state.journal.entries).toStrictEqual(expectedEntries);
    });

    it('deleteEntry', async () => {
      const idToDelete = defaultInitialState.entries[1].id;
      const expectedEntries = [ defaultInitialState.entries[0] ];
      journalApi.delete = jest.fn(() => Promise.resolve());

      const store = setupStore();
      const result = await store.dispatch('journal/deleteEntry', idToDelete);

      expect(result).toBe(true);
      expect(journalApi.delete).toHaveBeenCalledTimes(1);
      expect(journalApi.delete).toHaveBeenCalledWith(`/entries/${ idToDelete }.json`);
      expect(store.state.journal.entries).toStrictEqual(expectedEntries);
    });
  });
});