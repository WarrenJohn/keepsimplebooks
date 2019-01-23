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
            <button class="btn btn-success" type="button">Register</button>
        </b-col>
        <b-col></b-col>
    </b-row>
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
