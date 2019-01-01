<template>
  <div class="history">
    <h1>This is the History page</h1>
    <div class="container">
        <ol>
            <li style="list-style-type:none;" v-for="line in info.data" v-bind:key="line.id">{{line}}</li>
        </ol>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default{
    data () {
        return {
            info: null
            }
        },
    methods:{},

    mounted () {
      axios
        .get('http://localhost:5000/transactions')
        .then(response => (this.info = response))
    }
}
</script>
