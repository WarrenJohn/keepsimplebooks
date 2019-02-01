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
                    <p class="lead text-danger"
                    v-if="total < 0">
                        $({{total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}})
                    </p>
                    <p class="lead"
                    v-else>
                        ${{total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}
                    </p>
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
            axios.delete(`http://localhost:5000/tags/${id}`, {
                headers: {
                    authorization: `Bearer ${this.$store.state.token}`}})
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
            axios.delete(`http://localhost:5000/categories/${id}`, {
                headers: {
                    authorization: `Bearer ${this.$store.state.token}`}})
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
        parseTransactions: function(tags, transactions){
            tags.map(tag => {
                if (tag.description && tag.amount){
                        tag.transactions = transactions.filter(transaction =>{
                            if (transaction.withdrawl){
                                return (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.withdrawl) === Number(tag.amount))
                            }else{
                                return (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.deposit) === Number(tag.amount))
                            }
                        });

                }else if (!tag.description && tag.amount){
                        tag.transactions = transactions.filter(transaction => {
                            if (transaction.withdrawl){
                                return (Number(transaction.withdrawl) === Number(tag.amount))
                            }else{
                                return (Number(transaction.deposit) === Number(tag.amount))
                            }
                        });

                }else if(!tag.amount && tag.description){
                    tag.transactions = transactions.filter(transaction => transaction.description.toUpperCase().includes(tag.description.toUpperCase()))
                }
            }
            );
            return tags;
        },
        parseCategories: function(parsedTags, categories){
            categories.map(category => category.sum = 0)
            categories.map(category => {
                parsedTags.map(tag => {
                    tag.transactions.map(transaction => {
                        if (category.name.toUpperCase() === tag.category.toUpperCase()){
                            if(transaction.withdrawl){
                                category.sum -= Number(transaction.withdrawl)
                            }else if(transaction.deposit){
                                category.sum += Number(transaction.deposit)
                            }
                        }
                    })
                })
            })
            return categories;
        },
        getTransactions: function(){
            return axios.get('http://localhost:5000/transactions', {
                headers: {
                    authorization: `Bearer ${this.$store.state.token}`}})
        },
        getTags: function(){
            return axios.get('http://localhost:5000/tags', {
                headers: {
                    authorization: `Bearer ${this.$store.state.token}`}})
        },
        getCategories: function(){
            return axios.get('http://localhost:5000/categories', {
                headers: {
                    authorization: `Bearer ${this.$store.state.token}`}})
        },
        setupDashboard: function(){
            axios.all([this.getTransactions(), this.getTags(), this.getCategories()])
                .then(axios.spread((transactions, tags, categories) => {
                    this.tags = this.parseTransactions(tags.data, transactions.data)
                    this.categories = this.parseCategories(this.tags, categories.data);
                }))
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login')
                });
        }
    },

    created () {
        this.setupDashboard();
    }
}
</script>
