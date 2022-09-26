import { shallowMount } from '@vue/test-utils';
import Swal from 'sweetalert2';
import { createStore } from 'vuex';

import defaultInitialState from '@/../tests/unit/mocks/journalState';
import journalModule from '@/modules/daybook/store/journal';
import EntryView from '@/modules/daybook/views/EntryView';

jest.mock('sweetalert2', () => ({
  close: jest.fn(),
  fire: jest.fn(),
  showLoading: jest.fn()
}));

const setupStore = (initialState=defaultInitialState) => createStore({
  modules: {
    journal: {
      ...journalModule,
      state: { ...initialState }
    }
  }
});
const store = setupStore();
store.dispatch = jest.fn();

const routerMock = {
  push: jest.fn()
};

const setup = props => shallowMount(EntryView, {
  global: {
    mocks: {
      $router: routerMock
    },
    plugins: [ store ],
  },
  props: {
    id: defaultInitialState.entries[0].id,
    ...props
  }
});

describe('<EntryView />', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to "/no-entry" endpoint when entry id does not exist', () => {
    setup({ id: 'non-existing-id' });

    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({name: 'no-entry'});
  });

  it('should render entry when entry id exists', () => {
    wrapper = setup();

    expect(wrapper.html()).toMatchSnapshot();
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('should delete entry and redirect to "/no-entry" endpoint', (done) => {
    wrapper = setup();
    Swal.fire.mockReturnValue(Promise.resolve({ isConfirmed: true }));

    wrapper.find('.btn-danger').trigger('click');

    setTimeout(() => {
      expect(Swal.fire).toHaveBeenCalledTimes(3);
      expect(Swal.fire).toHaveBeenNthCalledWith(1, {
        title: 'Do you want to delete this entry?',
        text: 'This action can not be undone.',
        showDenyButton: true,
        confirmButtonText: 'Delete'
      });
      expect(Swal.fire).toHaveBeenNthCalledWith(2, {
        title: 'Please wait...',
        allowOutsideClick: false
      });
      expect(Swal.fire).toHaveBeenNthCalledWith(3, 'Entry deleted', '', 'success');

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        'journal/deleteEntry',
        defaultInitialState.entries[0].id
      );

      expect(routerMock.push).toHaveBeenCalledTimes(1);
      expect(routerMock.push).toHaveBeenCalledWith({name: 'no-entry'});
      done();
    }, 1);
  });
});
