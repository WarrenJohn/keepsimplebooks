<template>
  <div class="text-center">
    <h1>Logo here</h1>
    <b-row>
        <b-col></b-col>
        <b-col>
            <input class="form-control" type="email" name="email" placeholder="Email"
            v-model="email"/>
            <input class="form-control" type="password" name="password" placeholder="Password"
            v-model="password"/>
            <button class="btn btn-success" type="button"
            @click="submitLogin()">Register</button>

            <div v-if="clientResponseClass" class="mt-3">
                <b-alert show :variant="clientResponseClass">
                    {{clientResponse}}
                </b-alert>
            </div>
        </b-col>
        <b-col></b-col>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios'

export default{
    data(){
        return {
            email: '',
            password: '',
            clientResponse: '',
            clientResponseClass: ''
        }
    },
    methods: {
        submitLogin: function(){
            if (email && password){
                axios.post()
            }else if (!email){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Email cannot be blank!';
                setTimeout(() => {this.clientResponseClass = ''; this.clientResponse = ''}, 3000);
            }else if (!password){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Password cannot be blank!';
                setTimeout(() => {this.clientResponseClass = ''; this.clientResponse = ''}, 3000);
            }
        }
    }
}
</script>
