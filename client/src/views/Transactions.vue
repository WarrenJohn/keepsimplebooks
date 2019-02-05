<template>
    <div id="transactions">
        <b-container fluid>
            <b-row class="m-3">
                <b-col sm="4" class="p-5">
                    <div>
                        <categories v-model="tag.category"/>

                        <b-form-input type="text"
                            placeholder="Description"
                            v-model="tag.description">
                        </b-form-input>

                        <b-form-input type="text"
                            placeholder="Amount"
                            v-model="tag.amount">
                        </b-form-input>

                        <b-dropdown-divider></b-dropdown-divider>
                    </div>
            <div class="text-center">
                <p v-if="tag.description && tag.amount && tag.category">
                    Label all transactions that contain the text <b>'{{ tag.description.toUpperCase() }}'</b> and the exact amount of <b>'{{ tag.amount }}'</b> as
                    <b>'{{ tag.category.toUpperCase() }}'</b>.
                </p>
                <p v-else-if="!tag.description && tag.amount && tag.category">
                    Label all transactions with the exact amount of <b>'{{ tag.amount }}'</b> as <b>'{{ tag.category.toUpperCase() }}'</b>.
                </p>
                <p v-else-if="!tag.amount && tag.description && tag.category">
                    Label all transactions that contain the text <b>'{{ tag.description.toUpperCase() }}'</b> as <b>'{{ tag.category.toUpperCase() }}'</b>.
                </p>
                <p v-else></p>
                <b-button block variant="success" @click="validateTag">Add this tag</b-button>
                <div v-if="clientResponseClass">
                    <b-alert show :variant="clientResponseClass">
                        {{clientResponse}}
                    </b-alert>
                </div>
            </div>
                </b-col>
                <b-col sm="8">
                    <p class="p-5 text-center">
                        Select the transaction you'd like to tag but hitting the 'tag' button. Give it a category and specify
                        whether you'd like to track this transaction by the description, price, or both.
                    </p>
                    <div class="container">
                        <table class="table table-hover table-sm" style="table-layout:fixed">
                            <thead>
                                <tr class="d-flex">
                                    <th scope="col" class="col-10">Description</th>
                                    <th scope="col" class="col-1">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(line, index) in info" :key="index+'_transactions'" class="d-flex">
                                    <th scope="row" class="col-10">
                                        <b-btn block href="#" variant="link">{{line.name}}</b-btn>
                                            <table class="table table-hover table-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Description</th>
                                                        <th scope="col">Amount</th>
                                                        <th scope="col"></th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(row, index) in line.transactions" :key="index + '-table'">
                                                        <td scope="row" style="font-weight:normal">{{row.date}}</td>
                                                        <td style="font-weight:normal" >{{ row.description }}</td>

                                                        <td style="font-weight:normal" class="text-danger" v-if="row.withdrawl > 0">$({{ row.withdrawl }})</td>

                                                        <td style="font-weight:normal" v-else>${{ row.deposit }}</td>

                                                        <td>
                                                            <b-button variant="outline-success"
                                                                size="sm"
                                                                @click="createTag(row.id)">Tag
                                                            </b-button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
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
import api from '../services/api';
import Categories from '@/components/Categories.vue';

export default{
    name: 'category',
    components: {
      Categories
  },
    data () {
        return {
            allTags: Array(),
            userTags: Array(),
            tag: { category: '', description: '', amount: '', user: '' },
            postedTags: Array(),
            info: null,
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        createTag: function(id){
            // populating the inital tag when the user clicks the 'tag' button
            this.allTags.forEach(item => {
                if (item.id === id){
                    this.tag.description = item.description;
                    this.tag.amount = item.amount;
                    this.tag.user = this.$store.state.user.email;
                }
            })
        },
        validateTag: function(){
            // validate user created tag
                if (!this.tag.category){
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'Category is required!';
                    return;
                }
                if (!this.tag.description && !this.tag.amount){
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'Description or Amount are required!';
                    return;
                }
                if (this.tag.description || !this.tag.amount) {
                    return this.addTag();
                }
                if (!this.tag.description || this.tag.amount) {
                    return this.addTag();
                }
        },
        addTag: function(){
            this.tag.description = this.tag.description.toUpperCase()
            api()
                .post('tags', {tag: this.tag})
                .then(response => {
                    if(response.data.created){
                        // 'created' is referencing the response from findOrCreate method of sequelize
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Tag successfully created!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    }else{
                        this.clientResponseClass = 'warning text-center';
                        this.clientResponse = 'Tag already exists!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    }
                })
                .then(() => {
                    this.setupTransactionsPage();
                })
                .catch(() => {
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'An error occured!';
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                })
        },
        parseTransactions: function(transactions, tags){
            // Parsing out all previously tagged transactions
            let tagged= Array();
            tags.map(tag => {
                if (tag.description && tag.amount){
                        tagged.push(...transactions.filter(transaction =>
                                (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.withdrawl) == Number(tag.amount))
                                ||
                                (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.deposit) == Number(tag.amount))
                        ));
                }if (!tag.description && tag.amount){ // were previously an else if
                        tagged.push(...transactions.filter(transaction =>
                                (Number(transaction.withdrawl) == Number(tag.amount))
                                ||
                                (Number(transaction.deposit) == Number(tag.amount))
                        ));
                }if(!tag.amount && tag.description){ // were previously an else if
                    tagged.push(...transactions.filter(transaction => transaction.description.toUpperCase().includes(tag.description.toUpperCase())))
                }
            });

            tagged.map(tag => {
                if(transactions.indexOf(tag) !== -1){
                    transactions.splice(transactions.indexOf(tag), 1);
                }
            });

            return transactions;
        },
        sortTransactions: function(transactions){
            let unsortedTransactions = transactions;
            let sortedDescriptions = Array();
            let sortedTransactions = Array();
            transactions.forEach(row => {
                // Pushing each unique occurance of a description name to the description array
                if (sortedDescriptions.indexOf(row.description) === -1){
                    sortedDescriptions.push(row.description);
                }
            });
            sortedDescriptions.forEach(item => {
                sortedTransactions.push({
                    // This is the main 'transaction' that is used for the table accordion
                    // all other transactions with the same description (but potentially different amounts)
                    // are stored in the transactions array in this object
                    id: '',
                    name: item,
                    transactions: Array(),
                    count: 0
                    });
                });
            sortedTransactions.forEach(trans_obj => {
                unsortedTransactions.forEach(unsortedTrans_obj => {
                    // Parsing and organizing all similar transactions into their corresponding transaction array
                    if (trans_obj.name === unsortedTrans_obj.description){
                        trans_obj.transactions.push(unsortedTrans_obj);
                        if (!unsortedTrans_obj.deposit){
                                this.allTags.push({id: unsortedTrans_obj.id, category: '', description: unsortedTrans_obj.description, amount: unsortedTrans_obj.withdrawl, user: this.$store.state.user.email});
                        }else{
                            this.allTags.push({id: unsortedTrans_obj.id, category: '', description: unsortedTrans_obj.description, amount: unsortedTrans_obj.deposit, user: this.$store.state.user.email});
                        }
                        trans_obj.id = unsortedTrans_obj.description;
                    }
                });
                trans_obj.count = trans_obj.transactions.length;
            });
            return sortedTransactions;
        },
        getTransactions: function(){
            return api().get('transactions');
        },
        getTags: function(){
            return api().get('tags');
        },
        setupTransactionsPage: function(){
            axios.all([this.getTransactions(), this.getTags()])
                .then(axios.spread((transactions, tags) => {
                    let parsedTransactions = transactions.data;
                    this.userTags = tags.data;
                    console.log('len before parse ',parsedTransactions.length);
                    parsedTransactions = this.parseTransactions(transactions.data, tags.data);
                    console.log('len after parse ', parsedTransactions.length);

                    this.info = this.sortTransactions(parsedTransactions);
                }))
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login');
                });
        }
    },
    created () {
        this.setupTransactionsPage();
    }
}
</script>
