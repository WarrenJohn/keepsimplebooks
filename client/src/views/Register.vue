<template>
  <div class="text-center bg-light">
    <b-container fluid class="text-center">
        <b-row class="userinput">
            <b-col></b-col>
            <div class="card">
                <b-col class=" mx-auto p-3">
                    <img class="img-fluid" src="../assets/logo.png" style="width:auto; height: 5rem" />
                    <h1 class="logo">keepsimplebooks</h1>
                    <p class="lead">Register</p>
                    <form>
                        <input class="form-control" type="email" name="email" placeholder="Email" required
                        v-model="email"/>
                        <br />
                        <input class="form-control" type="password" name="password" placeholder="Password" required
                        v-model="password"/>
                        <br />
                        <input class="form-control" type="password" name="confirmpassword" placeholder="Confirm password" required
                        v-model="confirmPassword"
                        @change="pwMatch()"/>

                        <div v-if="clientResponseClass" class="mt-3">
                            <b-alert show :variant="clientResponseClass">
                                {{ clientResponse }}
                            </b-alert>
                        </div>
                        <div v-if="postErrors.length > 0" class="mt-3">
                            <b-alert show variant="danger">
                                <ul>
                                    <li v-for="(error, index) in postErrors" :key="index+'_errors'">
                                        {{ error }}
                                    </li>
                                </ul>
                            </b-alert>
                        </div>

                        <button class="btn btn-success" type="button"
                        @click="registerUser">Register</button>
                    </form>
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
            confirmPassword: '',
            pwResponse: '',
            clientResponse: '',
            clientResponseClass: 'info text-center',
            postErrors: Array()
        }
    },
    methods: {
        pwMatch: function(){
            if (this.password === this.confirmPassword && this.password.length >= 5) {
                return true;
            }

        },
        registerUser: function(){
            if (this.pwMatch() && this.email.length > 3){
                axios.post('/API/users/register', {email: this.email, password: this.password, confirmPassword: this.confirmPassword})
                    .then(response => {
                        if (response.status === 201){
                            this.clientResponseClass = 'success text-center';
                            this.clientResponse = 'Your account has been registered!';
                            setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
                        }
                        else if (response.status === 200){
                            this.postErrors = response.data.errors;
                        }
                    })
                    .catch(() =>{
                        this.postErrors.push('Something went wrong!')
                    });

            }else if(!this.pwMatch()){
                this.clientResponseClass = 'danger text-center';
                this.clientResponse = 'Passwords don\'t match!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            }else{
                this.clientResponseClass = 'danger text-center';
                this.clientResponse = 'Must be a valid email!';
                setTimeout(() => {this.clientResponseClass = null; this.clientResponse = null}, 3000);
            }
        },
    },
    watch: {
        email: function(){
            setTimeout(() => {
                if (this.email.length < 4){
                    // prevent the user from using a@a
                    this.clientResponseClass = 'info text-center';
                    this.clientResponse = 'Must be a valid email!';
                }else if (!this.email.includes('@')) {
                    this.clientResponse = 'Must be a valid email!';
                }else{
                    this.clientResponse = '';
                }
            }, 500);
        },
        password: function(){
            setTimeout(() => {
                if (this.password.length < 5){
                    this.clientResponse = 'Password must be at least 5 characters';
                }else if (this.password === this.confirmPassword && this.password.length >= 5 && this.confirmPassword.length >= 5) {
                    this.clientResponse = 'Passwords match';
                }else{
                    this.clientResponse = 'Passwords do not match!';
                }
            }, 500);
        },
        confirmPassword: function(){
            setTimeout(() => {
                if (this.confirmPassword === this.password && this.password.length >= 5 && this.confirmPassword.length >= 5) {
                    this.clientResponse = 'Passwords match';
                }else{
                    this.clientResponse = 'Passwords do not match!';
                }
            }, 500);
        }
    }

}
</script>
