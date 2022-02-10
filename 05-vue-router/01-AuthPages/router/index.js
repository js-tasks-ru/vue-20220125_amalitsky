import { createRouter, createWebHistory } from 'vue-router';
import PageIndex from '../views/PageIndex';
import PageLogin from '../views/PageLogin';
import PageRegister from '../views/PageRegister';

const routes = [
  {
    name: 'index',
    path: '/',
    component: PageIndex,
  }, {
    name: 'login',
    path: '/login',
    component: PageLogin,
    props: route => ({ from: route.query.from }),
  }, {
    name: 'register',
    path: '/register',
    component: PageRegister,
  }
];

export const router = createRouter({
  history: createWebHistory('/05-vue-router/01-AuthPages'),
  routes,
});
