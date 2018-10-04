<template>
  <div>
    <app-header></app-header>
    <div class="page-wrapper">
      <nuxt/>
    </div>
  </div>
</template>
<script>
  import AppHeader from '../components/AppHeader'

  export default {
    head: {
      bodyAttrs: {
        class: 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile'
      }
    },
    components: {
      AppHeader
    }
  }
</script>

<style lang="sass" scoped>

</style>
