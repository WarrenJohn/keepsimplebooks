<template>
  <div class="transactions">
    <h1>This is the Transactions page</h1>
    <div class="container">
        <ul>
            <li style="list-style-type:none;" v-for="line in info.data" v-bind:key="line.id">{{line}}</li>
        </ul>
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
  mounted () {
    axios
      .get('http://localhost:5000/transactions')
      .then(response => (this.info = response))
  }
}
</script>
