<template>
    <div class="">
        <!-- <b-alert v-if='!status' variant='danger' show>Decrypting</b-alert>
        <b-alert v-else variant='success' show>Decrypted</b-alert> -->
        <b-alert v-if='!status' variant='danger' show>Fetching Data</b-alert>
        <b-alert v-else variant='success' show>Data Retrieved</b-alert>
    </div>
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
            api.getRoute('transactions')
                .then(transactions => {
                    // check store next
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
