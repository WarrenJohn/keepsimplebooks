<template>
    <div>
        <b-form-input v-model="categories" type="text" placeholder="Add new expense category"></b-form-input>
        <b-button variant="outline-success"
            size="sm"
            @click="addCategory()">Tag
        </b-button>
        <b-form-select :options="options" class="mb-3" size="sm" />
        {{categories}} |
        <br />
        {{options}}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Categories',
        props: {
            msg: String
        },
    data () {
        return {
            selected: null,
            categories: null,
            test: Array(),
            options: [
                { value: null, text: 'Please select an option' }
            ]
        }
    },
    methods:{
        addCategory: function(){
            axios
                .post('http://localhost:5000/categories', {categories: this.categories, user: 'warren'})
                .then(() => {this.categories = null})
        }
    },

    mounted () {
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
