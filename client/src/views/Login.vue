<template>
    <div class="text-center">
      <b-container fluid class="text-center">
              <b-row class="userinput">
                  <b-col></b-col>
                  <div class="card">
                  <b-col class=" mx-auto p-3">
                      <img class="img-fluid" src="../assets/logo.png" style="width:auto; height: 5rem" />
                      <h1 class="logo">keepsimplebooks</h1>
                      <p class="lead">Login</p>
                      <input class="form-control" type="email" name="email" placeholder="Email"
                      v-model="email"/>
                      <input class="form-control" type="password" name="password" placeholder="Password"
                      v-model="password"/>

                      <div v-if="clientResponseClass" class="mt-3">
                          <b-alert show :variant="clientResponseClass">
                              {{ clientResponse }}
                          </b-alert>
                      </div>
                      <button class="btn btn-success mt-2" type="button"
                      @click="submitLogin()">Login</button>
                  </b-col>
              </div>
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
                axios.post('/API/users/login', {email: this.email, password: this.password})
                    .then(response => {
                        if (response.data.result){
                            this.$store.dispatch('setToken', response.data.token)
                            this.$store.dispatch('setUser', response.data.user)
                            this.$router.push('dashboard');
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
