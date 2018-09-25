<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import {login} from '@/utils/ka'
export default {
  name: 'App',
  created () {
    this.$store.dispatch('getKaUser')
    // login()
  }
}
</script>
