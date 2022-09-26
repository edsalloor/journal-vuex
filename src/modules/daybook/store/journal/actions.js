import journalApi from '@/api/journalApi';


export const loadEntries = async ({ commit }) => {
  commit('startLoading');

  const { data } = await journalApi.get('/entries.json');
  const entries = [];

  if (data) {
    Object.keys(data).forEach((id) => {
      entries.push({
        id,
        ...data[id]
      });
    });
  }

  commit('setEntries', entries);
  commit('stopLoading');
};

export const updateEntry = async ({ commit }, entry) => {
  const { id, date, picture, text } = entry;
  const payload = { date, picture, text };

  const { data } = await journalApi.put(`/entries/${id}.json`, payload);

  commit('updateEntry', { id, ...data });
};

export const createEntry = async ({ commit }, entry) => {
  const { date, picture, text } = entry;
  const payload = { date, picture, text };

  const { data } = await journalApi.post('/entries.json', payload);
  const newEntry = { id: data.name, ...payload };

  commit('addEntry', newEntry);

  return newEntry;
};

export const deleteEntry = async ({ commit }, id) => {
  await journalApi.delete(`/entries/${ id }.json`);

  commit('removeEntry', id);

  return true;
};
