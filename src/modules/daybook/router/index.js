export default {
  name: 'daybook',
  component: () => import(/* webpackChunkName: "daybook" */ '@/modules/daybook/layouts/DaybookLayout.vue'),
  children: [
    {
      path: '',
      name: 'no-entry',
      component: () => import(/* webpackChunkName: "DaybookNoEntry" */ '@/modules/daybook/views/NoEntrySelected.vue'),
    },
    {
      path: ':id',
      name: 'entry',
      component: () => import(/* webpackChunkName: "EntryView" */ '@/modules/daybook/views/EntryView.vue'),
    }
  ]
};
