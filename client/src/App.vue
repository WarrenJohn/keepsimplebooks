<template>
  <div id="app">
    <b-nav fill tabs>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
        <b-nav-item
            v-if="!$store.state.userLoggedIn"
            to="/register">Register
        </b-nav-item>
        <b-nav-item
            v-if="!$store.state.userLoggedIn"
            to="/login">Login
        </b-nav-item>
        <b-nav-item to="/dashboard">Dashboard</b-nav-item>
        <b-nav-item to="/transactions">Transactions</b-nav-item>
        <b-nav-item to="/history">History</b-nav-item>
        <b-nav-item to="/upload">Upload</b-nav-item>
        <b-button
            v-if="$store.state.userLoggedIn"
            @click="logout"
            variant="link" size="sm">log out
        </b-button>
    </b-nav>
    <router-view/>
  </div>
</template>

<script>

export default {
    methods: {
        logout: function(){
            this.$store.dispatch('logoutUser');
            this.$router.push('login');
        }
    }
}

</script>
