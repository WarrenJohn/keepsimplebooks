<template>
  <div class="history">
    <h1>This is the History page</h1>
    <div class="container">
        <!-- <table class="table table-bordered table-hover table-sm">
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
                <tr v-for="line in info.data" v-bind:key="line.id">
                    <th scope="row">{{line.date}}</th>
                    <td>{{ line.description }}</td>

                    <td v-if="line.withdrawl > 0" class="table-danger">{{ line.withdrawl }}</td>
                    <td v-else>{{ line.withdrawl }}</td>

                    <td v-if="line.deposit > 0" class="table-success">{{ line.deposit }}</td>
                    <td v-else>{{ line.deposit }}</td>

                    <td>{{ line.balance }}</td>
                </tr>
            </tbody>
        </table> -->
        <b-table striped hover small :items="info" :fields="fields"></b-table>
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
        .then(response => (this.info = response.data))
    }
}
</script>
