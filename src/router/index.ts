import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';
import Vue from 'vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/threads',
    name: 'Threads',
    props: true,
    component: () => import('../views/threads/Index.vue'),
    children: [
      {
        path: 'create',
        name: 'ThreadCreate',
        component: () => import('../views/threads/ThreadCreate.vue'),
      },
      {
        path: ':id',
        props: true,
        component: {
          render(c) {
            return c('router-view');
          },
        },
        children: [
          {
            path: '',
            name: 'ThreadRetrieve',
            props: true,
            component: () => import('../views/threads/ThreadRetrieve.vue'),
          },
          {
            path: 'edit',
            name: 'ThreadEdit',
            props: true,
            component: () => import('../views/threads/ThreadEdit.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/users',
    component: {
      render(c) {
        return c('router-view');
      },
    },
    children: [
      {
        path: '',
        name: 'UserList',
        component: () =>
          import(
            /* webpackChunkName: "UserList" */ '../views/users/UserList.vue'
          ),
      },
      {
        path: ':id',
        props: true,
        name: 'UserRetrieve',
        component: () =>
          import(
            /* webpackChunkName: "UserRetrieve" */ '../views/users/UserRetrieve.vue'
          ),
      },
    ],
  },

  {
    path: '/404',
    alias: '*',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
