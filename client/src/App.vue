<template>
  <div id="app">

      <link rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"
      integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
      crossorigin="anonymous">

    <b-navbar toggleable="md" variant="primary" type="dark" sticky>
        
        <b-navbar-brand
            v-if="!$store.state.userLoggedIn"
            class="text-white logo" to="/">keepsimplebooks
        </b-navbar-brand>
        <status v-else></status>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-navbar-nav tag="h6">

                <b-nav-item
                    class="text-white"
                    v-if="!$store.state.userLoggedIn"
                    to="/register">Register
                </b-nav-item>
                <b-nav-item
                    v-if="!$store.state.userLoggedIn"
                    to="/login">Login
                </b-nav-item>
                <b-nav-item
                    v-if="$store.state.userLoggedIn"
                    to="/dashboard">Dashboard</b-nav-item>
                <b-nav-item
                    v-if="$store.state.userLoggedIn"
                    to="/transactions">Transactions</b-nav-item>
                <b-nav-item
                    v-if="$store.state.userLoggedIn"
                    to="/history">History</b-nav-item>
                <b-nav-item
                    v-if="$store.state.userLoggedIn"
                    to="/upload">Upload</b-nav-item>
                <b-nav-item
                    v-if="$store.state.userLoggedIn"
                    @click="logout"
                    variant="light" size="sm">Log out
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar-nav>
    </b-navbar>

    <router-view/>

    <footer>
        <b-alert variant="primary" style="margin-top:5rem; padding-bottom:12rem" show>
        </b-alert>
    </footer>
  </div>
</template>

<script>
import Status from './components/Status.vue'

export default {
    components:{
        Status
    },
    methods: {
        logout: function(){
            this.$store.dispatch('logoutUser');
            this.$router.push('login');
        }
    }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Viga');
@import url('https://fonts.googleapis.com/css?family=Quicksand');
.userinput{
    padding-top: 8rem;
    padding-bottom: 15rem;
}
.logo{
    font-family: 'Viga';
    font-weight: bold;
}
#app{
    font-family: 'Quicksand'
}
</style>
