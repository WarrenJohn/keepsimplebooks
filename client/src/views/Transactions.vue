<template>
    <div id="transactions">
        <b-container fluid>
            <b-row>
                <b-col sm="4">
                    <div>
                        <categories v-model="tag.category" ref="categories"/>
                        <b-form-input type="text"
                            placeholder="Description"
                            ref="description"
                            v-model="tag.description">
                        </b-form-input>
                        <b-form-input type="text"
                            placeholder="Amount"
                            ref="amount"
                            v-model="tag.amount">
                        </b-form-input>
                        <b-dropdown-divider></b-dropdown-divider>
                    </div>
            <div class="text-center">
                <p v-if="tag.description && tag.amount && tag.category">We'll label all transactions that contain the text <b>'{{ tag.description }}'</b> and the exact amount of <b>'{{ tag.amount }}'</b> as <b>'{{ tag.category }}'</b>.</p>
                <p v-else></p>
                <b-button block variant="success" @click="validateTag">Add this tag</b-button>
                <div v-if="clientResponseClass">
                    <b-alert show :variant="clientResponseClass">
                        {{clientResponse}}
                    </b-alert>
                </div>
                {{test}}<br><br>
                tag{{tag}}
                <h3>Current Tags</h3>
                <ul>
                    <li v-for="(item, index) in posted_tags" :key="index + '-tagsd'">
                        {{item}}
                    </li>
                </ul>
            </div>
                </b-col>
                <b-col sm="8">
                    <h1>This is the Transactions page</h1>
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
                                                            <b-button variant="outline-success"
                                                                size="sm"
                                                                @click="createTag(row.id)">Tag
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
            </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios';
import Categories from '@/components/Categories.vue'
export default{

    name: 'category',
    components: {
      Categories
  },
    data () {
        return {
            all_tags: Array(),
            tag: { 'category': '', 'description': '', 'amount': '', 'user': '' },
            posted_tags: Array(),
            info: '',
            clientResponse: '',
            clientResponseClass: '',
            test: ''
        }
    },
    methods:{
        validateTag: function(){
                if (!this.tag.category){
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'Category is required!';
                }else if (!this.tag.description || !this.tag.amount) {
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'Description or Amount are required!';
                }else{
                    this.addTag();
                }
        },
        addTag: function(){
            // TODO: Parse the transactions out that already have matching tags
            axios
                .post('http://localhost:5000/transactions', {tag: this.tag})
                .then(response => {
                    this.test = response
                    if(response.data.created){
                        // referencing the response from findOrCreate method of sequelize
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Tag successfully created!';
                    }else{
                        this.clientResponseClass = 'warning text-center';
                        this.clientResponse = 'Tag already exists!';
                    }
                })
        },
        createTag: function(id){
            this.all_tags.forEach(item => {
                if (item.id === id){
                    this.tag.description = item.description;
                    this.tag.amount = item.amount;
                    this.tag.user = 'warren';
                }
            })
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
                        if (!res_obj.deposit){
                                this.all_tags.push({id: res_obj.id, category: '', description: res_obj.description, amount: res_obj.withdrawl, user: 'warren'});
                        }else{
                            this.all_tags.push({id: res_obj.id, category: '', description: res_obj.description, amount: res_obj.deposit, user: 'warren'});
                        }
                        trans_obj.id = res_obj.description;
                    }
                });
                trans_obj.count = trans_obj.transactions.length;
            });
        this.info = transactions;
        })
    }
}
</script>
