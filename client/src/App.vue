
<template>
  <div id="app">
  <img alt="Vue logo" src="./assets/logo.png">
  <nav>
      <ul>
          <li>
              <router-link :to="{name: 'home'}">Home</router-link>
          </li>
          <li>
              <router-link :to="{name: 'register'}">Register</router-link>
          </li>
          <li>
              <router-link :to="{name: 'login'}">Login</router-link>
          </li>
      </ul>
  </nav>
    <router-view />
  </div>
</template>

<script>
export default {
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
