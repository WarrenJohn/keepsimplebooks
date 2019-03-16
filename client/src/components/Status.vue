<template>
    <div class="">
        <b-alert v-if='!status' variant='danger' show>Decrypting</b-alert>
        <b-alert v-else variant='success' show>Decrypted</b-alert>
    </div>
</template>
<script>
import api from '@/services/api';

export default{
    // props: ['uploaded'],
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
                    console.log(transactions);
                    // check store next
                    this.$store.dispatch('setTransactions', transactions.data);
                    console.log('store', this.$store.state.transactions);
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
