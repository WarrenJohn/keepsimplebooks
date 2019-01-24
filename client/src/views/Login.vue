<template>
    <div class="text-center">
      <h1 class="p-4">Logo here</h1>
      <b-container fluid class="text-center p-4">
          <b-row class="mb-3">
            <b-col></b-col>
            <b-col class=" mx-auto p-3">
                <input class="form-control" type="email" name="email" placeholder="Email"
                v-model="email"/>
                <input class="form-control" type="password" name="password" placeholder="Password"
                v-model="password"/>

                <div v-if="clientResponseClass" class="mt-3">
                    <b-alert show :variant="clientResponseClass">
                        {{clientResponse}}
                    </b-alert>
                </div>
                <button class="btn btn-success mt-2" type="button"
                @click="submitLogin()">Register</button>
            </b-col>
            <b-col></b-col>
        </b-row>
    </b-container>
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
            if (this.email && this.password){
                axios.post('http://localhost:5000/users', {email: this.email, password: this.password})
                    .then(response => {
                        if (response.data){
                            this.clientResponseClass = 'success text-center';
                            this.clientResponse = 'Logged in!';
                            this.$router.push('dashboard');
                            setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        }else{
                            this.clientResponseClass = 'danger text-center';
                            this.clientResponse = 'Invalid credentials!';
                            setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        }
                    })
                    .catch(() => {
                        this.clientResponseClass = 'danger text-center';
                        this.clientResponse = 'Something went wrong!';
                        setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                    })
            }else if (!this.email){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Email cannot be blank!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            }else if (!this.password){
                this.clientResponseClass = 'warning text-center';
                this.clientResponse = 'Password cannot be blank!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            }
        }
    }
}
</script>
