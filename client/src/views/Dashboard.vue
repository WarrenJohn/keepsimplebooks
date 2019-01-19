<template>
  <div class="dashboard">
    <h1>This is the Dashboard</h1>
        <b-container class="bv-example-row">
            <b-row>
                <b-col>
                    <h3 class="text-center">Tags</h3>
                    <p>{{tags}}</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h3 class="text-center">Categories</h3>
                    <p>{{categories}}</p>
                    <b-row>
                        <b-col v-for="(category, index) in categories" :key="index+'_category'">
                            <h5>{{category.name}}</h5>
                            <p class="lead">{{category.sum}}</p>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h3 class="text-center">Transactions</h3>
                    <p>{{transactions}}</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h3 class="text-center">Categories</h3>
                </b-col>
            </b-row>
        </b-container>
    <ul>
        <li>Overview of account activity</li>
        <li>View moneyflow in and out</li>
        <li>Add/remove categories and tags</li>
        <li>View money spent/made by category</li>
        <li>Send to accountant function</li>
        <ul>
            <li>Send summary with option to include full breakdown</li>
        </ul>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default{
    data () {
        return {
            transactions: null,
            categories: null,
            sortedCategories: Array(),
            tags: null,
            info: null,
            allTags: Array(),
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        parseTransactions: function(categories, transactions, tags){
            let sortedCategories = Array();
            tags.forEach(tag => {
                transactions.forEach(transaction => {
                    // Parsing out all previously tagged transactions
                    if (tag.description && tag.amount){
                        if (!transaction.deposit){
                            if (transaction.description.toLowerCase().includes(tag.description.toLowerCase()) && transaction.withdrawl === tag.amount){
                                sortedCategories.push(
                                    {category: tag.category, type: 'withdrawl', description: tag.description, amount: Number(transaction.withdrawl)}
                                );

                            }
                        }else{
                            if (transaction.description.toLowerCase().includes(tag.description.toLowerCase()) && transaction.deposit === tag.amount){
                                sortedCategories.push(
                                    {category: tag.category, type: 'deposit', description: tag.description, amount: Number(transaction.deposit)}
                                );
                            }
                        }
                    }
                    else if (!tag.amount){
                        if(transaction.description.toLowerCase().includes(tag.description.toLowerCase())){
                            if (!transaction.deposit){
                                sortedCategories.push(
                                    {category: tag.category, type: 'withdrawl', description: tag.description, amount: Number(transaction.withdrawl)}
                                );
                            }else{
                                sortedCategories.push(
                                    {category: tag.category, type: 'deposit', description: tag.description, amount: Number(transaction.deposit)}
                                );
                            }
                        }

                    }
                    else if (!tag.description){
                        if(!transaction.deposit){
                            if(transaction.withdrawl === tag.amount){
                                sortedCategories.push(
                                    {category: tag.category, type: 'withdrawl', description: transaction.description, amount: Number(transaction.withdrawl)}
                                );
                            }
                        }else{
                            if(transaction.deposit === tag.amount){
                                sortedCategories.push(
                                    {category: tag.category, type: 'deposit', description: tag.description, amount: Number(transaction.deposit)}
                                );
                            }
                        }
                    }
                })
            })
            categories.forEach(category => {
                sortedCategories.forEach(transaction => {
                    if (category.name.includes(transaction.category)){
                        if (transaction.type === 'deposit'){
                            category.sum += transaction.amount;
                        }else{
                            category.sum -= transaction.amount;
                        }
                    }
                });
            });
            return categories;
        },
        getTransactions: function(){
            return axios.get('http://localhost:5000/transactions')
        },
        getCategories: function(){
            return axios.get('http://localhost:5000/categories')
        }
    },

    created () {
        axios.all([this.getTransactions(), this.getCategories()])
            .then(axios.spread((transactions, categories) => {
                this.transactions = transactions.data.transactions;
                this.tags = transactions.data.tags
                // this.categories = categories.data.map(category => (
                //     {name: category.name, sum: null, type: null}
                // ));
                this.categories = this.parseTransactions(
                    categories.data.map(category => (
                        {name: category.name, sum: null, type: null}
                    )),
                    transactions.data.transactions, transactions.data.tags)

            }))
    }
}
</script>
