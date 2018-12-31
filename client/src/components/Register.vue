<template>
    <div>
        <h1>Register</h1>
        <input
        v-model="email"
        type="email"
        name="email"
        placeholder="email" />
        <br>
        <input
        v-model="password"
        type="password"
        name="password"
        placeholder="password" />
        <br>
        <button>Register</button>
        <br>
        {{ email }}
        <br>
        {{ password }}
    </div>
</template>
<script>
export default {
    data(){
        return {
            email: '',
            password: ''}
    }
}
</script>
