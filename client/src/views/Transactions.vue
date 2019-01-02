<template>
  <div class="transactions">
    <h1>This is the Transactions page</h1>
    <div class="container">
        <div class="container">
            <table class="table table-hover table-sm" style="table-layout:fixed">
                <thead>
                    <tr class="d-flex">
                        <th scope="col" class="col-10">Description</th>
                        <th scope="col" class="col-1">#</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(line, index) in info" :key="index" class="d-flex">
                        <th scope="row" class="col-10">
                            <b-btn block href="#" v-b-toggle=line.id variant="light">{{line.name}}</b-btn>
                            <b-collapse :id="line.id" accordion="transactions" role="tabpanel">
                                <b-table outlined hover small :items="line.transactions" :fields="fields"></b-table>
                            </b-collapse>
                        </th>
                        <td class="col-1">{{ line.count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    </div>
</template>
<script>
import axios from 'axios';

export default{
    data () {
        return {
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
            ],
            info: ''
        }
    },
    methods:{},

    mounted () {
        axios
        .get('http://localhost:5000/transactions')
        .then(response => {
            let descriptions = Array();
            let transactions = Array();

            response.data.forEach(row => {
                if (descriptions.indexOf(row.description) === -1){
                    descriptions.push(row.description);
                }
            });

            descriptions.forEach(item => {
                transactions.push({
                    id: '',
                    name: item,
                    transactions: Array(),
                    count: 0
                    });
                });
            transactions.forEach(trans_obj => {
                response.data.forEach(res_obj => {
                    if (trans_obj.name === res_obj.description){
                        trans_obj.transactions.push(res_obj);
                        trans_obj.id = res_obj.description.replace(' ', '');
                    }

                });
                trans_obj.count = trans_obj.transactions.length;
            });
        this.info = transactions;
        })
        // .then(data => (this.info=data))
        // .then(response => (this.info = response))
    }
}
</script>
