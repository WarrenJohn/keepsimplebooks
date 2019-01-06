<template>
  <div class="dashboard">
    <h1>This is the Dashboard</h1>
    <Categories></Categories>
  </div>
</template>

<script>
import Categories from '@/components/Categories.vue'

// import axios from 'axios';

export default {
    name: 'category',
    components: {
      Categories
  }
}
</script>
