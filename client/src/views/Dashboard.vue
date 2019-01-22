<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
        <b-container class="bv-example-row">
            <b-row>
                <b-col>
                    <h3 class="text-center">Totals</h3>
                    <div v-if="clientResponseClass">
                        <b-alert show :variant="clientResponseClass">
                            {{clientResponse}}
                        </b-alert>
                    </div>
                    <b-row>
                        <table v-if="categories.length > 0">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Amount</th>
                                </tr>
                                <tr v-for="(category, index) in categories" :key="index+'_category'">
                                    <td>{{category.name.toUpperCase()}}</td>
                                    <td  v-if="category.sum < 0" class="lead text-danger">$({{Math.abs(category.sum).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}})</td>
                                    <td v-else class="lead">${{category.sum.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</td>
                                </tr>
                            </thead>
                        </table>
                    </b-row>
                </b-col>
                <b-col class="text-center">
                    <h3>Net Total</h3>
                    <p class="lead text-danger" v-if="total < 0">$({{total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}})</p>
                    <p class="lead" v-else>${{total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</p>
                </b-col>
            </b-row>
            <br>
            <b-row class="text-center">
                <b-col>
                    <b-btn block href="#" v-b-toggle.tagsaccordion variant="info"><h3>Tags</h3></b-btn>
                        <b-collapse id="tagsaccordion" accordion="tags-accordion" role="tabpanel">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col">Transaction Category</th>
                                        <th scope="col">Transaction Description</th>
                                        <th scope="col">Transaction Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tr v-for="(tag, index) in tags" :key="index+'_clienttag'">
                                    <td>
                                        {{tag.category.toUpperCase()}}
                                    </td>
                                    <td v-if="tag.description">
                                        {{tag.description.toUpperCase()}}
                                    </td>
                                    <td v-else>None</td>
                                    <td v-if="tag.amount">
                                        {{tag.amount}}
                                    </td>
                                    <td v-else>None</td>
                                    <td><b-button class="btn-danger btn-sm"
                                        @click="removeTag(tag.id)">remove</b-button></td>
                                    </tr>
                                </table>
                        </b-collapse>
                </b-col>
                <b-col>
                    <b-btn block href="#" v-b-toggle.catsaccordion variant="info"><h3>Categories</h3></b-btn>
                        <b-collapse id="catsaccordion" accordion="cats-accordion" role="tabpanel">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tr v-for="(category, index) in clientCategories" :key="index+'_clientCategories'">
                                    <td>{{category.name.toUpperCase()}}</td>
                                    <td><b-button class="btn-danger btn-sm"
                                        @click="removeCategory(category.id)">remove</b-button></td>
                                    </tr>
                                </table>
                        </b-collapse>
                </b-col>
            </b-row>
        </b-container>
    <ul>
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
            categories: Array(),
            clientCategories: null,
            tags: null,
            info: null,
            total: 0,
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        removeTag: function(id){
            axios.delete(`http://localhost:5000/tags/${id}`)
                .then(response => {
                    if (response.status === 200){
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Tag successfully deleted!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        this.setupDashboard();
                    }

                })
                .catch(() => {
                    this.clientResponseClass = 'danger text-center';
                    this.clientResponse = 'There was an issue!';
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    this.setupDashboard();
                })
        },
        removeCategory: function(id){
            axios.delete(`http://localhost:5000/categories${id}`)
                .then(response => {
                    if (response.status === 200){
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Category successfully deleted!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        this.setupDashboard();
                    }

                })
                .catch(() => {
                    this.clientResponseClass = 'danger text-center';
                    this.clientResponse = 'There was an issue!';
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    this.setupDashboard();
                })
        },
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
        getTags: function(){
            return axios.get('http://localhost:5000/tags')
        },
        getCategories: function(){
            return axios.get('http://localhost:5000/categories')
        },
        setupDashboard: function(){
            axios.all([this.getTransactions(), this.getTags(), this.getCategories()])
                .then(axios.spread((transactions, tags, categories) => {
                    this.clientCategories = categories.data;
                    this.transactions = transactions.data;
                    this.tags = tags.data;
                    this.categories = this.parseTransactions(
                        categories.data.map(category => (
                            {name: category.name, sum: 0, type: ''}
                        )),
                        transactions.data, tags.data);
                    this.categories.forEach(item => {
                        this.total += item.sum;
                    })
                }))
        }
    },

    created () {
        this.setupDashboard()
    }
}
</script>
