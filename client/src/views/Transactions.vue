<template>
    <div id="transactions">
        <b-container fluid>
            <!-- {{info}} -->
            <b-row class="m-3">
                <b-col sm="4" class="p-5">
                    <div style="position:fixed; width:25%">
                        <div>
                            <!-- Categories -->
                            <b-btn v-b-toggle.collapse1 size="sm" variant="link sm">Add expense category</b-btn>
                            <b-collapse id=collapse1 class="mt-2">
                                <div class="input-group">
                                <input
                                    v-model="tag.category"
                                    class="form-control" type="text" placeholder="New expense category" />
                                <b-button variant="success"
                                    size="sm"
                                    @click="validateCategory()">+
                                </b-button>
                                </div>
                            </b-collapse>
                            <select
                            v-model="tag.category"
                            class="form-control" name="categories">
                                <option disabled selected value>Please select an option</option>

                                <option
                                v-for="(option, index) in categoryOptions"
                                :value="option.text"
                                :selected="option.selected"
                                :key="index+'-category'">
                                    {{option.text}}
                                </option>
                            </select>

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
                                Label all transactions that contain the text <b>'{{  tag.description.toUpperCase()  }}'</b> and the exact amount of <b>'{{  tag.amount  }}'</b> as
                                <b>'{{  tag.category.toUpperCase()  }}'</b>.
                            </p>
                            <p v-else-if="!tag.description && tag.amount && tag.category">
                                Label all transactions with the exact amount of <b>'{{  tag.amount  }}'</b> as <b>'{{  tag.category.toUpperCase()  }}'</b>.
                            </p>
                            <p v-else-if="!tag.amount && tag.description && tag.category">
                                Label all transactions that contain the text <b>'{{  tag.description.toUpperCase()  }}'</b> as <b>'{{  tag.category.toUpperCase()  }}'</b>.
                            </p>
                            <p v-else></p>
                            <b-button block variant="success" @click="validateTag">Add this tag</b-button>
                            <div v-if="clientResponseClass">
                                <b-alert show :variant="clientResponseClass">
                                    {{ clientResponse }}
                                </b-alert>
                            </div>
                        </div>
                    </div>

                </b-col>
                <b-col sm="8">
                    <p class="p-5 text-center">
                        Select the transaction you'd like to tag but hitting the 'tag' button. Give it a category and specify
                        whether you'd like to track this transaction by the description, price, or both.
                        <br> <br>
                        Double click the remove button, to delete that transaction. You can remove all transactions in the dashboard.
                    </p>
                    <div class="container">
                        <!-- Transactions -->
                        <table class="table table-hover table-sm" style="table-layout:fixed">
                            <thead>
                                <tr class="d-flex">
                                    <th scope="col" class="col-10"
                                        @click="sortAlpha()">
                                        <i class="fas fa-arrows-alt-v pr-3"></i>
                                        Description
                                    </th>
                                    <th scope="col" class="col-1"
                                        @click="sortNumeric()">
                                        #<i class="fas fa-arrows-alt-v pl-3"></i>
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(line, index) in info" :key="index+'_transactions'" class="d-flex">
                                    <th scope="row" class="col-10">
                                        <b-btn block href="#" variant="link">{{ line.name }}</b-btn>
                                            <table class="table table-hover table-sm">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Description</th>
                                                        <th scope="col">Amount</th>
                                                        <th scope="col"></th>
                                                        <th scope="col"></th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(row, index) in line.transactions" :key="index + '-table'">
                                                        <td scope="row" style="font-weight:normal">{{ row.date }}</td>
                                                        <td style="font-weight:normal" >{{  row.description  }}</td>

                                                        <td style="font-weight:normal" class="text-danger"
                                                            v-if="row.withdrawl > 0">
                                                            $({{  row.withdrawl  }})
                                                        </td>

                                                        <td style="font-weight:normal"
                                                            v-else>
                                                            ${{  row.deposit  }}
                                                        </td>

                                                        <td>
                                                            <b-button variant="outline-success"
                                                                size="sm"
                                                                @click="createTag(row.id)">Tag
                                                            </b-button>
                                                        </td>
                                                        <td>
                                                            <b-button variant="outline-danger"
                                                                size="sm"
                                                                @dblclick="deleteOneTransaction(row.id)">Remove
                                                            </b-button>
                                                        </td>
                                                        <!-- </td> -->
                                                    </tr>
                                                </tbody>
                                            </table>
                                    </th>
                                    <td class="col-1">{{  line.count  }}</td>
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

export default{
    name: 'transactions',
    components: {
    },
    data () {
        return {
            categoryOptions: null,
            categorySelected: '',
            allTags: Array(),
            userTags: Array(),
            categories: null,
            tag: { category: '', description: '', amount: '', user: '' },
            info: null,
            alphaSort: false,
            numericSort: false,
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        validateCategory: function(){
            const categoryLen = this.tag.category.length;
            for (let i = 0; i < categoryLen; i++){
                if (this.tag.category[i] !== " "){
                    return this.addCategory();
                }
            }
            this.clientResponseClass = "warning text-center";
            this.clientResponse = "Category cannot be blank!";
            setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
        },
        addCategory: function(){
            api()
                .post('categories', {category: this.tag.category.toUpperCase()})
                .then(response => {
                    if(response.data.created){
                        // referencing the response from findOrCreate method of sequelize
                        this.clientResponseClass = "success text-center";
                        this.clientResponse = "Category successfully added!";
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    }else{
                        this.clientResponseClass = "warning text-center";
                        this.clientResponse = "Category already exists!";
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    }
                })
                .then(() => {
                    api()
                        .get('categories')
                        .then(response => {
                            this.categoryOptions = response.data.map(object => {
                                if (object.name === this.tag.category.toUpperCase()){
                                    // auto select category that was just added
                                    this.tag.category = object.name.toUpperCase();
                                }
                                return {value: object.name, text: object.name.toUpperCase(), selected: false}
                            }
                            );
                        });
                })
                .catch(() => {
                    this.clientResponseClass = "danger text-center";
                    this.clientResponse = "Something went wrong!";
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                })
            },
        deleteOneTransaction: function(id){
            this.$store.dispatch('deleteOneTransaction', id);
            api.deleteTransaction(id)
                .then(response => {
                    if (response.status === 200){
                        this.clientResponseClass = 'success text-center';
                        this.clientResponse = 'Successfully deleted!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        this.numericSort = false;
                        this.alphaSort = false;
                        this.setupTransactionsPage();
                    }
                })
                .catch(() => {
                    this.clientResponseClass = 'danger text-center';
                    this.clientResponse = 'There was an issue!';
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    this.setupTransactionsPage();
                })
        },
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
        validateTag: async function(){
            // get categories before validation
            let categories = await api.getRoute('categories')
            categories = categories.data.map(category => (category.name))
            const userCategoryExists = categories.indexOf(this.tag.category.toUpperCase());
            // validate user created tag
            if (!this.tag.category){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Category is required!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                return;
            }
            if (userCategoryExists === -1){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Category must be added first!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                return;
            }
            if (!this.tag.description && !this.tag.amount){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Description or Amount are required!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
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
                    this.numericSort = false;
                    this.alphaSort = false;
                    this.setupTransactionsPage();
                })
                .catch(() => {
                    this.clientResponseClass = 'warning text-center';
                    this.clientResponse = 'An error occured!';
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                })
        },
        filterTags: function(transactions, tags){
            // Parsing out all previously tagged transactions
            let tagged= Array();
            tags.forEach(tag => {
                if (tag.description && tag.amount){
                        tagged.push(...transactions.filter(transaction =>
                                (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.withdrawl) === Number(tag.amount))
                                ||
                                (transaction.description.toUpperCase().includes(tag.description.toUpperCase()) && Number(transaction.deposit) === Number(tag.amount))
                        ));
                }if (!tag.description && tag.amount){ // were previously an else if
                        tagged.push(...transactions.filter(transaction =>
                                (Number(transaction.withdrawl) === Number(tag.amount))
                                ||
                                (Number(transaction.deposit) === Number(tag.amount))
                        ));
                }if(!tag.amount && tag.description){ // were previously an else if
                    tagged.push(...transactions.filter(transaction => transaction.description.toUpperCase().includes(tag.description.toUpperCase())))
                }
            });

            tagged.forEach(tag => {
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
                    // This is the main 'transaction' that is used for the table
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
                                this.allTags.push(
                                    {
                                        id: unsortedTrans_obj.id,
                                        category: '',
                                        description: unsortedTrans_obj.description,
                                        amount: unsortedTrans_obj.withdrawl,
                                        user: this.$store.state.user.email
                                    }
                                );
                        }else{
                            this.allTags.push(
                                {
                                    id: unsortedTrans_obj.id,
                                    category: '', description:
                                    unsortedTrans_obj.description,
                                    amount: unsortedTrans_obj.deposit,
                                    user: this.$store.state.user.email
                                }
                            );
                        }
                        trans_obj.id = unsortedTrans_obj.description;
                    }
                });
                trans_obj.count = trans_obj.transactions.length;
            });
            return sortedTransactions;
        },
        sortAlpha: function(){
            // sorting functionality for the table
            if(this.alphaSort){
                return this.info.reverse()
            }
            let nameArray;
            let indexArray = Array();
            let newTransactions = Array();
            nameArray = this.info
                .map(line => (line.name))
                .sort()
            // using this type of loop as the break is needed to prevent the array from duplicating itself each time the function is called
            for (let nm of nameArray){
                for (let line of this.info){
                    if(nm == line.name){
                        indexArray.push(this.info.indexOf(line));
                        break;
                    }
                }
            }
            indexArray.forEach(index => {
                newTransactions.push(this.info[index])
            })
            this.numericSort = false;
            this.alphaSort = true;
            this.info = newTransactions;
        },
        sortNumeric: function(){
            // sorting functionality for the table
            if(this.numericSort){
                return this.info.reverse()
            }
            let cntArray;
            let indexArray = Array()
            let newTransactions = Array();

            // name passed in otherwise 2 identical amounts from different categories
            // will cause all of them to have the same name when the index is pushed
            cntArray = this.info.map(line => ([line.name, line.count]))
            cntArray.sort((a ,b) => (b[1]-a[1]))
            // using this type of loop as the break is needed to prevent the array from duplicating itself each time the function is called
            for (let item of cntArray){
                for (let line of this.info){
                    if(item[1] === line.count && item[0] == line.name){
                        indexArray.push(this.info.indexOf(line))
                        break;
                    }
                }
            }
            indexArray.forEach(index => {
                newTransactions.push(this.info[index])
            })
            this.alphaSort = false;
            this.numericSort = true;
            this.info = newTransactions;
        },
        getCategories: function(){
            return api.getRoute('categories');
        },
        getTags: function(){
            return api.getRoute('tags');
        },
        setupTransactionsPage: function(){
            axios.all([this.getTags(), this.getCategories()])
                .then(axios.spread((tags, categories) => {
                    let parsedTransactions;
                    let transactions;
                    if(this.$store.state.transactions.length){
                        // object is mapped to create a new copy and avoid mutation of state.transactions
                        transactions = this.$store.state.transactions.map(o => (o));
                    }
                    this.categoryOptions = categories.data.map(object => ({value: object.name, text: object.name.toUpperCase()}))
                    this.userTags = tags.data;
                    parsedTransactions = this.filterTags(transactions, tags.data);
                    this.info = this.sortTransactions(parsedTransactions);
                    // sort table numerically descending to start
                    this.sortNumeric()
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
