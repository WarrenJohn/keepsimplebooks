<template>
    <div id="transactions">
        <!-- New -->
        <b-container fluid>
            <b-row>
                <b-col sm="4">
                    <div v-for="(tag, index) in tags" :key="index+'tags'">
                        <b-form-input type="text"
                            placeholder="Expense category"
                            v-model="tags[index].category">
                        </b-form-input>
                        <b-form-input type="text"
                            placeholder="Description"
                            v-model="tags[index].description">
                        </b-form-input>
                        <b-form-input type="text"
                            placeholder="Amount"
                            v-model="tags[index].amount">
                        </b-form-input>
                        <b-dropdown-divider></b-dropdown-divider>
                    </div>
                <ul>
                    <li v-for="(item, index) in tags" :key="index + '-tagsd'">
                        {{item}}
                    </li>
                </ul>
                </b-col>
                <b-col sm="8">
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
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(row, index) in line.transactions" :key="index + '-table'">
                                                        <th scope="row">{{row.date}}</th>
                                                        <td>{{ row.description }}</td>

                                                        <td v-if="row.withdrawl > 0" class="table-danger">{{ row.withdrawl }}</td>
                                                        <td v-else>{{ row.withdrawl }}</td>

                                                        <td v-if="row.deposit > 0" class="table-success">{{ row.deposit }}</td>
                                                        <td v-else>{{ row.deposit }}</td>

                                                        <td>{{ row.balance }}</td>
                                                        <td>
                                                            <!-- <div v-for="(tag, index) in tags" :key="index+'tags'">
                                                                <b-form-input type="text"
                                                                    placeholder="Expense category"
                                                                    v-model="tags[index].category">
                                                                </b-form-input>
                                                                <b-form-input type="text"
                                                                    placeholder="Description"
                                                                    :value="row.description"
                                                                    v-model="tags[index].description">
                                                                </b-form-input>
                                                                <b-form-input v-if="row.deposit > 0"
                                                                    type="text"
                                                                    placeholder="Deposit Amt."
                                                                    :value="row.deposit"
                                                                    v-model="tags[index].amount">
                                                                </b-form-input>
                                                                <b-form-input v-else type="text"
                                                                    placeholder="Withdrawl Amt."
                                                                    :value="row.withdrawl"
                                                                    v-model="tags[index].amount">
                                                                </b-form-input>
                                                            </div> -->
                                                            <b-button variant="outline-success"
                                                                size="sm"
                                                                @click.once="addTag">Tag
                                                            </b-button>
                                                        </td>
                                                    </tr>
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
            </b-col>
            </b-row>
        </b-container>
        <!-- Original -->
        <!-- <h1>This is the Transactions page</h1> -->
        <!-- <div class="container">
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
                                <b-collapse :id="line.id" accordion="transactions" role="tabpanel"> -->
                                    <!-- <b-table outlined hover small :items="line.transactions" :fields="fields"></b-table> -->

                                    <!-- <table class="table table-bordered table-hover table-sm">
                                        <thead>
                                            <tr>
                                                <th scope="col">Date</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Withdrawn</th>
                                                <th scope="col">Deposited</th>
                                                <th scope="col">Balance</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(row, index) in line.transactions" :key="index + '-table'">
                                                <th scope="row">{{row.date}}</th>
                                                <td>{{ row.description }}</td>

                                                <td v-if="row.withdrawl > 0" class="table-danger">{{ row.withdrawl }}</td>
                                                <td v-else>{{ row.withdrawl }}</td>

                                                <td v-if="row.deposit > 0" class="table-success">{{ row.deposit }}</td>
                                                <td v-else>{{ row.deposit }}</td>

                                                <td>{{ row.balance }}</td>
                                                <td> -->
                                                    <!-- <div v-for="(tag, index) in tags" :key="index+'tags'">
                                                        <b-form-input type="text"
                                                            placeholder="Expense category"
                                                            v-model="tags[index].category">
                                                        </b-form-input>
                                                        <b-form-input type="text"
                                                            placeholder="Description"
                                                            :value="row.description"
                                                            v-model="tags[index].description">
                                                        </b-form-input>
                                                        <b-form-input v-if="row.deposit > 0"
                                                            type="text"
                                                            placeholder="Deposit Amt."
                                                            :value="row.deposit"
                                                            v-model="tags[index].amount">
                                                        </b-form-input>
                                                        <b-form-input v-else type="text"
                                                            placeholder="Withdrawl Amt."
                                                            :value="row.withdrawl"
                                                            v-model="tags[index].amount">
                                                        </b-form-input>
                                                    </div> -->
                                                    <!-- <b-button variant="outline-success"
                                                        size="sm"
                                                        @click.once="addTag">Tag
                                                    </b-button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </b-collapse>
                            </th>
                            <td class="col-1">{{ line.count }}</td>
                        </tr>
                    </tbody>
                </table>
            </div> -->
        <!-- </div> -->
        <!-- test -->
        <!-- <div v-for="(tag, index) in tags" :key="index+'tags'">
            <b-form-input type="text"
                placeholder="Expense category"
                v-model="tags[index].category">
            </b-form-input>
            <b-form-input type="text"
                placeholder="Description"
                v-model="tags[index].description">
            </b-form-input>
            <b-form-input type="text"
                placeholder="Amount"
                v-model="tags[index].amount">
            </b-form-input>
        </div>
        <ul>
            <li v-for="(item, index) in tags" :key="index + '-tagsd'">
                {{item}}
            </li>
        </ul> -->

    </div>
</template>

<script>
import axios from 'axios';

export default{
    data () {
        return {
            tags: [],

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
    methods:{
        addTag: function(){
            this.tags.push({category: '', description: '', amount: ''});
        }
    },

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
                this.tags.push(trans_obj)
                // I might be using the wrong object for this.
                // { "id": "CIBC MTGE CORP MTG", "name": "CIBC MTGE CORP MTG", "transactions": [ { "id": 24, "date": "12/20/2018", "description": "CIBC MTGE CORP MTG", "withdrawl": "918.46", "deposit": "", "balance": "17782.77" } ], "count": 1 }
                // if (trans_obj.deposit < 0){
                    // this.tags.push({category: '', description:trans_obj.name, amount: trans_obj.withdrawl});
                // }else{
                //     this.tags.push({category: '', description:trans_obj.name, amount: trans_obj.deposit});
                // }
                trans_obj.count = trans_obj.transactions.length;
            });
        this.info = transactions;
        })
    }
}
</script>
