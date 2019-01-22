<template>
  <div class="text-center">
    <h1>This is the Register page</h1>
    <input type="email" name="email" placeholder="Email"
        v-model="email"/>
    <br />
    <input type="password" name="password" placeholder="Password"
        v-model="password"/>
    <br />
    <input type="password" name="confirmpassword" placeholder="Confirm password"
        v-model="confirmPassword"/>
    <button>Register</button>
  </div>
</template>
<script>
export default{
    data(){
        return {
            email: '',
            password: '',
            confirmPassword: ''
        }
    }
}
</script>
