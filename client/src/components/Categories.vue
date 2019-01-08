<template>
    <div>
        <p :class="clientResponseClass">
            {{clientResponse}}
        </p>
        <div class="input-group">
            <b-form-input v-model="categories" type="text" placeholder="Add new expense category"></b-form-input>
            <b-button variant="outline-success"
                size="sm"
                @click="addCategory()">+
            </b-button>
        </div>
        <b-form-select :options="options" class="mb-3" size="sm" />
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
            options: Array(),
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        addCategory: function(){
            axios
                .post('http://localhost:5000/categories', {categories: this.categories, user: 'warren'})
                .then(response => {
                    if(response.data.created){
                        this.clientResponseClass = "text-success text-center"
                        this.clientResponse = "Category successfully added!"
                    }else{
                        this.clientResponseClass = "text-danger text-center"
                        this.clientResponse = "Category already exists!"
                    }
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
