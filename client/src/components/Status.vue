<template>
    <b-alert v-if='!status' variant='warning' show>Decrypting</b-alert>
    <b-alert v-else variant='success' show>Decrypted</b-alert>
</template>
<script>
import api from '@/services/api';

export default{
    name:'Status',
    data(){
        return{
            status: false,
        }
    },
    methods:{
        getTransactions: function(){
            api().get('transactions')
                .then(transactions => {
                    this.$store.dispatch('setTransactions', transactions.data);
                    this.status = true;
                })
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login');
                })
        }
    },
    created(){
        this.getTransactions();
    }
}
</script>
