<template>
  <div class="history text-center">
    <h1 class="m-5">Transactions history</h1>
    <div class="container" v-if="$store.state.transactions" >
        <b-table striped hover small :items="info" :fields="fields"></b-table>
    </div>
    <div v-else>

    </div>
  </div>
</template>
<script>
import api from '@/services/api';
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
    methods:{
        setupHistory: function(){
            let transactions;
            if(this.$store.state.transactions){
                // object is mapped to create a new copy and avoid mutation of state.transactions
                transactions = this.$store.state.transactions.map(o => (o));
            }else{
                transactions = Array();
            }
            this.info = transactions
            api
                .get('users')
                .then(() => {/* if no error then user still has token */})
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login');
                });
        }
    },

    created () {
        this.setupHistory();
    }
}
</script>
