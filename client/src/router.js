import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';
// import axios from 'axios';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {path: '/', name: 'home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Home},
        {
            path: '/register',
            name: 'register',
            component: () => import (/* webpackChunkName: "about" */ './views/Register.vue')},
        {
            path: '/login',
            name: 'login',
            component: () => import ('./views/Login.vue')},
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import ('./views/Dashboard.vue'),
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        },
        {
            path: '/history',
            name: 'history',
            component: () => import ('./views/History.vue'),
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: () => import ('./views/Transactions.vue'),
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        },
        {
            path: '/upload',
            name: 'upload',
            component: () => import ('./views/Upload.vue'),
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        }
    ]
});
