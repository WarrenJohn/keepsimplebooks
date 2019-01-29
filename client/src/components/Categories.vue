<template>
    <div>
        <div v-if="clientResponseClass">
            <b-alert show :variant="clientResponseClass">
                {{clientResponse}}
            </b-alert>
        </div>
        <div v-else>
        </div>
            <b-btn v-b-toggle.collapse1 size="sm" variant="link sm">Add expense category</b-btn>
            <b-collapse id=collapse1 class="mt-2">
                <div class="input-group">
                <input
                    :value="selected"
                    @input="$emit('input', $event.target.value)"
                    class="form-control" type="text" placeholder="New expense category" ref="categoryinput" />
                <b-button variant="success"
                    size="sm"
                    @click="addCategory()">+
                </b-button>
                </div>
            </b-collapse>
        <select
        :value="selected"
        @input="$emit('input', $event.target.value)"
        class="form-control" name="categories" ref="categoryoptions">
            <option disabled selected value>Please select an option</option>

            <option
            v-for="(option, index) in options"
            :value="option.text"
            :selected="option.selected"
            :key="index+'-category'">
                {{option.text}}
            </option>
        </select>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Categories',
        props: {
            selected: String
        },
    data () {
        return {
            options: Array(),
            clientResponse: null,
            clientResponseClass: null
        }
    },
    methods:{
        addCategory: function(){
            let category = this.$refs.categoryinput.value
            axios
                .post('http://localhost:5000/categories', {category, user: 'warren',
                                                            headers: {authorization: `Bearer ${this.$store.state.token}`}})
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
                    axios
                        .get('http://localhost:5000/categories', {headers: {authorization: `Bearer ${this.$store.state.token}`}})
                        .then(response => {
                            this.options = response.data.map(object => {
                                if (object.name === category){
                                    return {value: object.name, text: object.name.toUpperCase(), selected: true}
                                }else{
                                    return {value: object.name, text: object.name.toUpperCase(), selected: false}
                                }
                            }
                            );
                        });
                })
                .catch(() => {
                    this.clientResponseClass = "danger text-center";
                    this.clientResponse = "Something went wrong!";
                    setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                })
            }
        },

    created () {
        axios
            .get('http://localhost:5000/categories', {headers: {authorization: `Bearer ${this.$store.state.token}`}})
            .then(response => {
                response.data.forEach(object => {
                    this.options.push({value: object.name, text: object.name.toUpperCase()});
                })
            })
            .catch(() => {
                this.clientResponseClass = "danger text-center";
                this.clientResponse = 'Something went wrong!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            });
    }
}
</script>
