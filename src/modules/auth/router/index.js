export default {
  name: 'auth',
  component: () => import(/* webpackChunckName: "AuthLayout" */ '@/modules/auth/layouts/AuthLayout.vue'),
  children: [
    {
      path: '',
      name: 'login',
      component: () => import(/* webpackChunckName: "LogIn" */ '@/modules/auth/views/LogIn.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunckName: "SignUp" */ '@/modules/auth/views/SignUp.vue')
    }
  ]
};
