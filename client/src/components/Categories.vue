<template>
    <div class="container">
        <div>
            <b-form-input v-model="categories" type="text" placeholder="Add new expense category"></b-form-input>
            <b-button variant="outline-success"
                size="sm"
                @click="addCategory()">+
            </b-button>
        </div>
        <b-form-select :options="options" class="mb-3" size="sm" />
        <br />
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
            options: Array()
        }
    },
    methods:{
        addCategory: function(){
            axios
                .post('http://localhost:5000/categories', {categories: this.categories, user: 'warren'})
                .then(response => {
                    this.test = response
                })
                .then(() => {
                    axios
                        .get('http://localhost:5000/categories')
                        .then(response => {
                            this.options = response.data.map(object => ({value: object.name, text: object.name.toUpperCase()}))
                        });
                })
                .catch(err => {
                    this.test = err.message;
                })
            }
        },

    created () {
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
