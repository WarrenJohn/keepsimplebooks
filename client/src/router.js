import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import History from './views/History.vue';
import Transactions from './views/Transactions.vue';
import Upload from './views/Upload.vue';
import store from './store';
// import axios from 'axios';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/', name: 'home',
            component: Home},
        {
            path: '/register',
            name: 'register',
            component: Register},
        {
            path: '/login',
            name: 'login',
            component: Login},
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        },
        {
            path: '/history',
            name: 'history',
            component: History,
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: Transactions,
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        },
        {
            path: '/upload',
            name: 'upload',
            component: Upload,
            beforeEnter: (to, from, next) => {
                store.state.userLoggedIn ? next() : next('login');
            }
        }
    ]
});
