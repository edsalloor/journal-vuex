// export const myMutation = state => {

// };

export const startLoading = (state) => {
  state.isLoading = true;
};

export const stopLoading = (state) => {
  state.isLoading = false;
};

export const setEntries = (state, entries) => {
  state.entries = [...state.entries, ...entries];
};

export const updateEntry = (state, updatedEntry) => {
  state.entries = state.entries.map(entry => {
    if (entry.id === updatedEntry.id) {
      return updatedEntry;
    }

    return entry;
  });
};

export const addEntry = (state, newEntry) => {
  state.entries = [
    newEntry,
    ...state.entries
  ];
};

export const removeEntry = (state, id) => {
  state.entries = state.entries.filter(entry =>
    entry.id !== id
  );
};

export const clearEntries = state => {
  state.entries = [];
};
