<template>
  <div class="history">
    <h1>This is the History page</h1>
    <div class="container">
        <b-table striped hover small :items="info" :fields="fields"></b-table>
    </div>
  </div>
</template>
<script>

import axios from 'axios';

export default{
    data () {
        return {
            info: Array(),
            fields: [
                {
                    key: 'date',
                    sortable: true
                },
                {
                    key: 'description',
                    sortable: true
                },
                {
                    key: 'withdrawl',
                    sortable: true
                },
                {
                    key: 'deposit',
                    sortable: true
                },
                {
                    key: 'balance',
                    sortable: true
                }
            ]
        }
    },
    methods:{},

    created () {
        axios
        .get('http://localhost:5000/transactions', {
            headers: {
                authorization: `Bearer ${this.$store.state.token}`}})
        .then(response => (this.info = response.data))
        .catch(() => {
            this.$store.dispatch('logoutUser');
            this.$router.push('login');
        });
    }
}
</script>
