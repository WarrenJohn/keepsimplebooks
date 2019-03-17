import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        token: null,
        user: null,
        transactions: Array(),
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
        extendTransactions(state, transactions){
            // only used when uploading so the user doesn't
            // need to wait for encryption AND decryption
            state.transactions.push(...transactions);
        },
        setTransactions(state, transactions){
            state.transactions = transactions;
        },
        deleteOneTransaction(state, id){
            state.transactions = state.transactions.filter(row => (
                row.id != id
            ))
        },
        logoutUser(state){
            state.token = null;
            state.user = null;
            state.transactions = Array();
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
        extendTransactions({commit}, transactions){
            commit('extendTransactions', transactions);
        },
        setTransactions({commit}, transactions){
            commit('setTransactions', transactions);
        },
        deleteOneTransaction({commit}, id){
            commit('deleteOneTransaction', id);
        },
        logoutUser({commit}){
            commit('logoutUser');
        }
    }
})
