<template>
  <div class="dashboard">
        <b-container class="mt-5">
            <h3
                v-if="total > 0"
                class="text-center pb-5">Net total ${{  netTotal  }}</h3>
            <h3
                v-else
                class="text-danger text-center pb-5">Net total $({{  netTotal  }})</h3>

            <b-row>
                <b-col></b-col>
                <b-col cols="8">
                    <div v-if="clientResponseClass">
                        <b-alert show :variant="clientResponseClass">
                            {{ clientResponse }}
                        </b-alert>
                    </div>
                    <b-row>
                        <table v-if="categories.length > 0 && !hideMain" class="m-auto table hover">
                            <thead>
                                <tr>
                                    <th scope="col" class="sorting"
                                        @click="sortAlpha()">
                                        <i class="fas fa-arrows-alt-v pr-3"></i>
                                        Name
                                    </th>
                                    <th scope="col" class="sorting"
                                        @click="sortNumeric()">
                                        Amount
                                        <i class="fas fa-arrows-alt-v pl-3"></i>
                                    </th>
                                </tr>
                            </thead>
                                <tr v-for="(category, index) in categories" :key="index+'_category'">
                                    <td>{{ category.name.toUpperCase() }}</td>
                                    <td  v-if="category.sum < 0" class="text-danger">$({{ mutateNumber(category.sum) }})</td>
                                    <td v-else class="">${{ mutateNumber(category.sum) }}</td>
                                </tr>
                        </table>
                        <h2 v-else-if="categories.length === 0" class="text-center">Nothing here yet!</h2>
                    </b-row>
                </b-col>
                <b-col class="p-2">
                    <p v-if="!hideMain" @click="hideMain = !hideMain"><i class="far fa-eye-slash"></i></p>
                    <p v-if="hideMain" @click="hideMain = !hideMain"><i class="far fa-eye"></i></p>
                </b-col>
            </b-row>

            <b-row class="text-center pt-5">
                <b-col>
                    <b-btn block href="#" v-b-toggle.tagsaccordion variant="link">
                        <h4>Tags</h4>
                    </b-btn>
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
                    <b-btn block href="#" v-b-toggle.catsaccordion variant="link"><h4>Categories</h4></b-btn>
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

            <b-row class="text-center pt-5">
                <b-col>

                    <div v-if="deleteConfirm.isPossible">
                        <b-btn variant="link" class="text-danger"
                        @click="deleteConfirm.userConfirm = !deleteConfirm.userConfirm">
                        <b>DELETE ALL UPLOADED TRANSACTIONS</b>
                    </b-btn>

                        <div v-if="deleteConfirm.userConfirm">
                            <p class="lead">Are you sure?</p>
                            <b-btn variant="danger"
                            @click="deleteTransactions()">
                            Delete
                        </b-btn>

                        </div>
                    <p>This will not delete any of your tags, or categories. Just the transaction records that were uploaded.</p>
                    </div>

                </b-col>
            </b-row>
        </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import api from '../services/api';

export default{
    data () {
        return {
            hideMain: false,
            transactions: null,
            deleteConfirm: {isPossible: null, userConfirm: false},
            categories: Array(),
            alphaSort: false,
            numericSort: false,
            clientCategories: null,
            tags: null,
            info: null,
            total: 0,
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        deleteTransactions: function(){
            api().delete('transactions/all')
                .then(response => {
                    if (response.status === 200){
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Successfully deleted!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        this.deleteConfirm.userConfirm = false;
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
        mutateNumber: function(num){
            if (num > 0){
                return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return Math.abs(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                    tag.transactions = transactions.filter(transaction => transaction.description.toUpperCase().includes(tag.description.toUpperCase()));
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
        sortAlpha: function(){
            // sorting functionality for the table
            if(this.alphaSort){
                return this.categories.reverse();
            }
            let nameArray;
            let indexArray = Array();
            let newCategories = Array();
            nameArray = this.categories
                .map(category => (category.name))
                .sort();
            // using this type of loop as the break is needed to prevent the array from duplicating itself each time the function is called
            for (let nm of nameArray){
                for (let category of this.categories){
                    if(nm == category.name){
                        indexArray.push(this.categories.indexOf(category));
                        break;
                    }
                }
            }
            indexArray.forEach(index => {
                newCategories.push(this.categories[index]);
            })
            this.numericSort = false;
            this.alphaSort = true;
            this.categories = newCategories;
        },
        sortNumeric: function(){
            // sorting functionality for the table
            if(this.numericSort){
                return this.categories.reverse();
            }
            let amtArray;
            let indexArray = Array();
            let newCategories = Array();

            // name passed in otherwise 2 identical amounts from different categories
            // will cause all of them to have the same name when the index is pushed
            amtArray = this.categories.map(category => ([category.name, category.sum]));

            amtArray.sort((a ,b) => (a[1]-b[1]));
            // using this type of loop as the break is needed to prevent the array from duplicating itself each time the function is called
            for (let item of amtArray){
                for (let category of this.categories){
                    if(item[1] === category.sum && item[0] == category.name){
                        indexArray.push(this.categories.indexOf(category));
                        break;
                    }
                }
            }
            indexArray.forEach(index => {
                newCategories.push(this.categories[index]);
            })
            this.alphaSort = false;
            this.numericSort = true;
            this.categories = newCategories;
        },
        getTransactions: function(){
            return api().get('transactions');
        },
        getTags: function(){
            return api().get('tags');
        },
        getCategories: function(){
            return api().get('categories');
        },
        setupDashboard: function(){
            axios.all([this.getTags(), this.getCategories()])
                .then(axios.spread((tags, categories) => {
                    while (!this.$store.state.transactions){
                        // waiting for decryption
                    }
                    // object is mapped to create a new copy and avoid mutation of state.transactions
                    const transactions = this.$store.state.transactions.map(o => (o))
                    this.deleteConfirm.isPossible = Boolean(transactions.length);
                    this.tags = this.parseTransactions(tags.data, transactions);
                    this.categories = this.sumCategories(this.tags, categories.data);
                    this.clientCategories = categories.data;

                    if (this.categories.length !== 0){
                        this.total = this.categories
                            .map(category => (category.sum))
                            .reduce((acc, cv) => (acc + cv));
                    }
                    // sort table alphabetically to start
                    this.sortAlpha();
                }))
                .catch(() => {
                    this.$store.dispatch('logoutUser');
                    this.$router.push('login');
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
