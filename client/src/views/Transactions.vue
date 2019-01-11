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
                <p v-if="tag.description && tag.amount && tag.category">
                    Label all transactions that contain the text <b>'{{ tag.description }}'</b> and the exact amount of <b>'{{ tag.amount }}'</b> as <b>'{{ tag.category }}'</b>.
                </p>
                <p v-else-if="!tag.description && tag.amount && tag.category">
                    Label all transactions with the exact amount of <b>'{{ tag.amount }}'</b> as <b>'{{ tag.category }}'</b>.
                </p>
                <p v-else-if="!tag.amount && tag.description && tag.category">
                    Label all transactions that contain the text <b>'{{ tag.description }}'</b> as <b>'{{ tag.category }}'</b>.
                </p>
                <p v-else></p>
                <b-button block variant="success" @click="validateTag">Add this tag</b-button>
                <div v-if="clientResponseClass">
                    <b-alert show :variant="clientResponseClass">
                        {{clientResponse}}
                    </b-alert>
                </div>
                {{test}}
                <br><br>
                {{info}}
                <br><br>
                {{allTags}}
                <h3>Current Tags</h3>
                <ul>
                    <li v-for="(item, index) in userTags" :key="index + '-tagsd'">
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
            test: '',
            allTags: Array(),
            userTags: Array(),
            tag: { 'category': '', 'description': '', 'amount': '', 'user': '' },
            postedTags: Array(),
            info: '',
            clientResponse: '',
            clientResponseClass: ''
        }
    },
    methods:{
        validateTag: function(){
                if (!this.tag.category){
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'Category is required!';
                }else if (this.tag.description || !this.tag.amount) {
                    this.addTag();
                }else if (!this.tag.description || this.tag.amount) {
                    this.addTag();
                }else{
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'Description or Amount are required!';
                }
        },
        addTag: function(){
            // TODO: Parse the transactions out that already have matching tags
            axios
                .post('http://localhost:5000/transactions', {tag: this.tag})
                .then(response => {
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
            this.allTags.forEach(item => {
                if (item.id === id){
                    this.tag.description = item.description;
                    this.tag.amount = item.amount;
                    this.tag.user = 'warren';
                }
            })
        }
    },

    created () {
        axios
        .get('http://localhost:5000/transactions')
        .then(response => {
            let descriptions = Array();
            let transactions = Array();
            this.userTags = response.data.tags
            this.test = response.data.transactions
            // not working correctly
            response.data.transactions.forEach(object => {
                response.data.tags.forEach(tag => {
                    // Parsing out all previously tagged transactions
                    if (tag.description && tag.amount){
                        if(tag.amount === object.withdrawl && tag.description === object.description){
                            response.data.transactions.splice(response.data.transactions.indexOf(object), 1);
                            console.log(object.description, object.amount, "(tag.amount === object.withdrawl || tag.amount === object.deposit)");
                        }else if(tag.amount === object.deposit && tag.description === object.description){
                            response.data.transactions.splice(response.data.transactions.indexOf(object), 1);
                        }
                    }
                    else if (!tag.amount){
                        if (tag.description === object.description){
                            response.data.transactions.splice(response.data.transactions.indexOf(object), 1);
                            console.log(object.description, object.amount, '(tag.description === object.description)');
                        }
                    }
                    else if (!tag.description){
                        if(tag.amount === object.withdrawl){
                            console.log(tag, object.description, object.amount, '(!tag.description)');
                            response.data.transactions.splice(response.data.transactions.indexOf(object), 1);
                        }else if(tag.amount === object.deposit){
                            response.data.transactions.splice(response.data.transactions.indexOf(object), 1);
                        }
                    }else{
                        console.log(object.description, tag.description, tag.amount)
                    }
                })
            })

            response.data.transactions.forEach(row => {
                // Pushing each unique occurance of a description name to the description array
                if (descriptions.indexOf(row.description) === -1){
                    descriptions.push(row.description);
                }
            });

            descriptions.forEach(item => {
                transactions.push({
                    // This is the main 'transaction' that is used for the table accordion
                    // all other transactions with the same description (but potentially different amounts)
                    // are stored in the transactions array in this object
                    id: '',
                    name: item,
                    transactions: Array(),
                    count: 0
                    });
                });
            transactions.forEach(trans_obj => {
                response.data.transactions.forEach(res_obj => {
                    // Parsing and organizing all similar transactions into their corresponding transaction array
                    if (trans_obj.name === res_obj.description){
                        trans_obj.transactions.push(res_obj);
                        if (!res_obj.deposit){
                                this.allTags.push({id: res_obj.id, category: '', description: res_obj.description, amount: res_obj.withdrawl, user: 'warren'});
                        }else{
                            this.allTags.push({id: res_obj.id, category: '', description: res_obj.description, amount: res_obj.deposit, user: 'warren'});
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
