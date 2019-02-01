<template>
  <div id="app">
    <b-navbar toggleable="md" variant="primary" type="dark" sticky>
      <b-navbar-brand class="text-white" to="/">keepsimple</b-navbar-brand>
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

<style>
@import url('https://fonts.googleapis.com/css?family=Questrial');
#app{
    font-family: 'Questrial'
}
</style>
