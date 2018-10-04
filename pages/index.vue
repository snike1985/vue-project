<template>
  <section class="container">
    main page
  </section>
</template>

<script>
  import AppLogo from '~/components/AppLogo.vue'

  export default {
    head() {
      return {
        title: 'Home'
      }
    },
    fetch({redirect}){
      redirect('/manage-crew-changes')
    },
    components: {
      AppLogo
    }
  }
</script>

