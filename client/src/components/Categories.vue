<template>
    <div class="container">
        <span>
            <b-form-input v-model="categories" type="text" placeholder="Add new expense category"></b-form-input>
            <b-button variant="outline-success"
                size="sm"
                @click="addCategory1()">+
            </b-button>
        </span>
        <b-form-select :options="options" class="mb-3" size="sm" />
        {{test}}
        {{categories}} |
        <br />
        {{options}}
    </div>
</template>

<script>
import axios from 'axios';
// https://youtu.be/X-JZ-QPApUs?list=PLillGF-RfqbYSx-Ab1xWVanGKtowTsnNm&t=465 For how to update reactively
export default {
    name: 'Categories',
        props: {
            msg: String
        },
    data () {
        return {
            selected: null,
            test: '',
            categories: null,
            options: Array()
        }
    },
    methods:{
        async addCategory2(){
            // const cats = await axios.get('http://localhost:5000/categories')
            await axios
                .post('http://localhost:5000/categories', {categories: this.categories, user: 'warren'})
                // .then(() => {
                //     this.categories = null;
                //     this.options = Array();
                // })
            // this.options = cats.data.map(object => ({value: object.name, text: object.name.toUpperCase()}))
            // this.options = await this.getCategories()

            // await this.options.push(cats.data.map(object => ({value: object.name, text: object.name.toUpperCase()}) ))
                // .then(response => {
                //     response.data.forEach(object => {
                //         this.options.push({value: object.name, text: object.name.toUpperCase()});
                //     })
                // });
            },
        addCategory1: function(){
            axios
                .post('http://localhost:5000/categories', {categories: this.categories, user: 'warren'})
                .then(() => {
                    this.categories = null;
                    this.options = Array();
                })
                .then(response => {
                    console.log(response)
                    this.test = response
                })
                .then(() => {
                    axios
                        .get('http://localhost:5000/categories')
                        .then(response => {
                            response.data.forEach(object => {
                                this.options.push({value: object.name, text: object.name.toUpperCase()});
                            })
                        });
                })
                .catch(err => {
                    this.test = err.message;
                })
            },
            async addCategory(){
                await this.postCategory();
                this.options = await this.getCategories()
                // this.categories = null;
            },
            postCategory: function(){
                return axios
                    .post('http://localhost:5000/categories', {categories: this.categories, user: 'warren'})
                    .then(response => {
                        // this.options.push(response)
                        // this.test = response;
                        console.log(response)
                    })
            },
            async getCategories(){

                        const res = await axios.get('http://localhost:5000/categories');
                        const data = res.data;
                        return data.map(object => ({value: object.name, text: object.name.toUpperCase()}))

            }
        },

    created () {
        // this.getCategories();
        axios
            .get('http://localhost:5000/categories')
            .then(response => {
                response.data.forEach(object => {
                    this.options.push({value: object.name, text: object.name.toUpperCase()});
                })
            });
    }
}
</script>
