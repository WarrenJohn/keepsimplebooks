import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        token: null,
        user: null,
        userLoggedIn: false
    },
    mutations: {
        setToken(state, token){
            state.token = token;
            if (token){
                state.userLoggedIn = true;
            }else {
                state.userLoggedIn = false;
            }
        },
        setUser(state, user){
            state.user = user;
        },
        logoutUser(state){
            state.token = null;
            state.user = null;
            state.userLoggedIn = false;
        }
    },
    actions: {
        setToken({commit}, token){
            commit('setToken', token);
        },
        setUser({commit}, user){
            commit('setUser', user);
        },
        logoutUser({commit}){
            commit('logoutUser')
        }
    }
})
