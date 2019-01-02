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
                                <!-- <b-table outlined hover small :items="line.transactions" :fields="fields"></b-table> -->

                                <table class="table table-bordered table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Withdrawn</th>
                                            <th scope="col">Deposited</th>
                                            <th scope="col">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in line.transactions" :key="row.id + '-table'">
                                            <th scope="row">{{row.date}}</th>
                                            <td>{{ row.description }}</td>

                                            <td v-if="row.withdrawl > 0" class="table-danger">{{ row.withdrawl }}</td>
                                            <td v-else>{{ row.withdrawl }}</td>

                                            <td v-if="row.deposit > 0" class="table-success">{{ row.deposit }}</td>
                                            <td v-else>{{ row.deposit }}</td>

                                            <td>{{ row.balance }}</td>
                                        </tr>
                                        <div v-for="(row, index) in line.transactions" :key="index + '-buttons'">
                                            <div v-if="index == 0">
                                                <b-button variant="outline-danger" size="sm">Description</b-button>
                                                <b-button v-if="row.deposit == 0 " variant="outline-danger" size="sm">Withdrawl</b-button>
                                                <b-button v-else variant="outline-danger" size="sm">Deposit</b-button>
                                                <b-button variant="outline-success" size="sm">Tag</b-button>
                                            </div>
                                        </div>
                                    </tbody>
                                </table>

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
            form: {
                tag: ''
            },
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
                        trans_obj.id = res_obj.description;
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
