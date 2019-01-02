<template>
  <div id="app">
    <b-nav fill tabs>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
        <b-nav-item to="/register">Register</b-nav-item>
        <b-nav-item to="/login">Login</b-nav-item>
        <b-nav-item to="/dashboard">Dashboard</b-nav-item>
        <b-nav-item to="/history">History</b-nav-item>
        <b-nav-item to="/transactions">Transactions</b-nav-item>
        <b-nav-item to="/upload">Upload</b-nav-item>
    </b-nav>
    <router-view/>
  </div>
</template>
