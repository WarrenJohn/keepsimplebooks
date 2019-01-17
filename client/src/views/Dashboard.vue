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
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h3 class="text-center">Sorted Categories</h3>
                    <p>{{sortedCategories}}</p>
                    <b-row>
                        <b-col v-for="(category, index) in sortedCategories" :key="index+'_scategory'">
                            <h5>{{category}}</h5>
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
        parseTransactions: function(transactions, tags){
            tags.forEach(tag => {
                transactions.forEach(transaction => {
                    // Parsing out all previously tagged transactions
                    if (tag.description && tag.amount){
                        if (!transaction.deposit){
                            if (transaction.description.toLowerCase().includes(tag.description.toLowerCase()) && transaction.withdrawl === tag.amount){
                                this.sortedCategories.push(transactions.indexOf(transaction), 1);
                            }
                        }else{
                            if (transaction.description.toLowerCase().includes(tag.description.toLowerCase()) && transaction.deposit === tag.amount){
                                this.sortedCategories.push(transactions.indexOf(transaction), 1);
                            }
                        }
                    }
                    else if (!tag.amount){
                        if(transaction.description.toLowerCase().includes(tag.description.toLowerCase())){
                            this.sortedCategories.push(transactions.indexOf(transaction), 1);
                        }

                    }
                    else if (!tag.description){
                        if(!transaction.deposit){
                            if(transaction.withdrawl === tag.amount){
                                this.sortedCategories.push(transactions.indexOf(transaction), 1);
                            }
                        }else{
                            if(transaction.deposit === tag.amount){
                                this.sortedCategories.push(transactions.indexOf(transaction), 1);
                            }
                        }
                    }
                })
            })
            // return transactions;
        },
        // sortTransactions: function(transactions){
        //     let unsortedTransactions = transactions;
        //     let sortedDescriptions = Array();
        //     let sortedTransactions = Array();
        //     transactions.forEach(row => {
        //         // Pushing each unique occurance of a description name to the description array
        //         if (sortedDescriptions.indexOf(row.description) === -1){
        //             sortedDescriptions.push(row.description);
        //         }
        //     });
        //     sortedDescriptions.forEach(item => {
        //         sortedTransactions.push({
        //             // This is the main 'transaction' that is used for the table accordion
        //             // all other transactions with the same description (but potentially different amounts)
        //             // are stored in the transactions array in this object
        //             id: '',
        //             name: item,
        //             transactions: Array(),
        //             count: 0
        //             });
        //         });
        //     sortedTransactions.forEach(trans_obj => {
        //         unsortedTransactions.forEach(unsortedTrans_obj => {
        //             // Parsing and organizing all similar transactions into their corresponding transaction array
        //             if (trans_obj.name === unsortedTrans_obj.description){
        //                 trans_obj.transactions.push(unsortedTrans_obj);
        //                 if (!unsortedTrans_obj.deposit){
        //                         this.allTags.push({id: unsortedTrans_obj.id, category: '', description: unsortedTrans_obj.description, amount: unsortedTrans_obj.withdrawl, user: 'warren'});
        //                 }else{
        //                     this.allTags.push({id: unsortedTrans_obj.id, category: '', description: unsortedTrans_obj.description, amount: unsortedTrans_obj.deposit, user: 'warren'});
        //                 }
        //                 trans_obj.id = unsortedTrans_obj.description;
        //             }
        //         });
        //         trans_obj.count = trans_obj.transactions.length;
        //     });
        //     return sortedTransactions;
        // }

        // sortCategories: functions(){
        //     this.transactions.map(row => {
        //         this.tags.map(tag => {
        //
        //         })
        //     })
        // }
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
                this.categories = categories.data;
            }))
            .then(this.parseTransactions(this.transactions, this.tags))
    }
}
</script>
