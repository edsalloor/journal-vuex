import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import defaultInitialState from '@/../tests/unit/mocks/journalState';
import EntryList from '@/modules/daybook/components/EntryList';
import journalModule from '@/modules/daybook/store/journal';

const setupStore = (initialState=defaultInitialState) => createStore({
  modules: {
    journal: {
      ...journalModule,
      state: { ...initialState }
    }
  }
});

const routerMock = {
  push: jest.fn()
};

const setup = () => shallowMount(EntryList, {
  global: {
    mocks: {
      $router: routerMock
    },
    plugins: [ setupStore() ]
  }
});

describe('<EntryList />', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = setup();
  });

  it('should call getEntriesByTerm() and show all entries', () => {
    expect(wrapper.findAll('entry-stub').length).toBe(2);
  });

  it('should call getEntriesByTerm() and filter the entries', async () => {
    const input = wrapper.find('input');
    await input.setValue('Friend');

    expect(wrapper.findAll('entry-stub').length).toBe(1);
  });

  it('should redirect too "/new" endpoint when "New" button is clicked', async () => {
    const expectedRoute = {name: 'entry', params: {id: 'new'}};
    const button = wrapper.find('button');
    await button.trigger('click');

    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith(expectedRoute);
  });
});
