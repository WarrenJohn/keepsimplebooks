<template>
  <div class="dashboard">
        <b-container class="mt-5">
            <p
                v-if="total > 0"
                class="text-center">Net total ${{  netTotal  }}</p>
            <p
                v-else
                class="text-danger text-center">Net total $({{  netTotal  }})</p>
            <b-row>
                <b-col></b-col>
                <b-col cols="8">
                    <h3 class="text-center">Totals</h3>
                    <div v-if="clientResponseClass">
                        <b-alert show :variant="clientResponseClass">
                            {{ clientResponse }}
                        </b-alert>
                    </div>
                    <b-row>
                        <table v-if="categories.length > 0" class="m-auto">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Amount</th>
                                </tr>
                            </thead>
                                <tr v-for="(category, index) in categories" :key="index+'_category'">
                                    <td>{{ category.name.toUpperCase() }}</td>
                                    <td  v-if="category.sum < 0" class="lead text-danger">$({{ mutateNumber(category.sum) }})</td>
                                    <td v-else class="lead">${{ mutateNumber(category.sum) }}</td>
                                </tr>
                        </table>
                        <h2 v-else class="text-center">Nothing here yet!</h2>
                    </b-row>
                </b-col>
                <b-col></b-col>
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
                                        {{ tag.category.toUpperCase() }}
                                    </td>
                                    <td v-if="tag.description">
                                        {{ tag.description.toUpperCase() }}
                                    </td>
                                    <td v-else>None</td>
                                    <td v-if="tag.amount">
                                        {{ tag.amount }}
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
                                    <td>{{ category.name.toUpperCase() }}</td>
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
import api from '../services/api';

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
        mutateNumber: function(num){
            if (num > 0){
                return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            return Math.abs(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        removeTag: function(id){
            api().delete(`tags/${id}`)
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
            api().delete(`categories/${id}`)
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
            tags.forEach(tag => {
                if (tag.description && tag.amount){
                        tag.transactions = transactions.filter(transaction =>
                            (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.withdrawl) === Number(tag.amount))
                            ||
                            (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.deposit) === Number(tag.amount))
                        );

                }if (!tag.description && tag.amount){
                        tag.transactions = transactions.filter(transaction =>
                            (Number(transaction.withdrawl) === Number(tag.amount))
                            ||
                            (Number(transaction.deposit) === Number(tag.amount))
                        );

                }if(!tag.amount && tag.description){
                    tag.transactions = transactions.filter(transaction => transaction.description.toUpperCase().includes(tag.description.toUpperCase()))
                }
            }
            );
            return tags;
        },
        sumCategories: function(parsedTags, categories){
            categories.map(category => category.sum = 0)
            categories.forEach(category => {
                parsedTags.forEach(tag => {
                    tag.transactions.forEach(transaction => {
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
            return api().get('transactions')
        },
        getTags: function(){
            return api().get('tags')
        },
        getCategories: function(){
            return api().get('categories')
        },
        setupDashboard: function(){
            axios.all([this.getTransactions(), this.getTags(), this.getCategories()])
                .then(axios.spread((transactions, tags, categories) => {
                    this.tags = this.parseTransactions(tags.data, transactions.data);
                    this.categories = this.sumCategories(this.tags, categories.data);
                    this.clientCategories = categories.data
                    this.total = this.categories
                        .map(category => (category.sum))
                        .reduce((acc, cv) => (acc + cv))
                }))
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login')
                });
        }
    },
    computed:{
        netTotal: function(){
            // make the number look presentable
            return Math.abs(this.total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },

    mounted () {
        this.setupDashboard();
    }
}
</script>
