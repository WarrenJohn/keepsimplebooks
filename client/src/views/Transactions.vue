<template>
    <div id="transactions">
        <b-container fluid>
            <b-row>
                <b-col sm="4">
                    <b-button @click="addTag">Post</b-button>

                    <div v-for="(tag, index) in tags" :key="index+'tags'">
                        <categories v-model="tags[index].category" />
                        <b-form-input type="text"
                            placeholder="Description"
                            v-model="tags[index].description">
                        </b-form-input>
                        <b-form-input type="text"
                            placeholder="Amount"
                            v-model="tags[index].amount">
                        </b-form-input>
                        <b-dropdown-divider></b-dropdown-divider>
                    </div>

                <!-- TESTING ONLY -->
                <h3>Tags</h3>
                <ul>
                    <li v-for="(item, index) in tags" :key="index + '-tagsd'">
                        {{item}}
                    </li>
                </ul>
                <h3>Posted Tags</h3>
                <ul>
                    <li v-for="(item, index) in posted_tags" :key="index + '-tagsd'">
                        {{item}}
                    </li>
                </ul>
                <!-- TESTING ONLY -->
                </b-col>
                <b-col sm="8">
                    <h1>This is the Transactions page</h1>
                    <div class="container">
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
            tags: Array(),
            posted_tags: Array(),
            info: '',
            test: ''
        }
    },
    methods:{
        createTag: function(id){
            this.all_tags.forEach(item => {
                if (item.id === id){
                this.tags.push(item);

                }
            })
        },
        addTag: function(){
            this.tags.map(tag => {
                this.posted_tags.push({category: tag.category, description: tag.description, amount: tag.amount, user: tag.user })
                // this.posted_tags.push([tag.category, tag.description,tag.amount, tag.user])
            });
            this.tags = Array()
            axios
            .post('http://localhost:5000/transactions', {tags: this.posted_tags})
            .then(() => {this.posted_tags = Array()})
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
