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
            api.get('transactions')
                .then(transactions => {
                    this.$store.dispatch('setTransactions', transactions.data);
                    this.status = true;
                })
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login');
                })
        },
        // postTransactions: function(){
        //     api.post('transactions', fileData)
        //         .then(response => {
        //             console.log('all done');
        //         })
        // }
    },
    created(){
        this.getTransactions();
    }
}
</script>
