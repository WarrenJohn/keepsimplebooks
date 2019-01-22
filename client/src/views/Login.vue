<template>
  <div class="text-center">
    <h1>This is the Login page</h1>
    <input type="email" name="email" placeholder="Email"
        v-model="email"/>
    <br />
    <input type="password" name="password" placeholder="Password"
        v-model="password"/>
    <br />
    <button>Login</button>
  </div>
</template>
<script>
export default{
    data(){
        return {
            email: '',
            password: ''
        }
    }
}
</script>
