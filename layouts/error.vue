<template>
  <div class="page-wrapper">
    <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
      <div class="container text-center">
        <img class="m--margin-top-50" src="/images/icons/404.svg" alt="">
        <h1 class="m--font-blue m--margin-top-30 m--font-boldest2" v-if="error.statusCode === 404">404. Page not found</h1>
        <h1 class="m--font-blue m--margin-top-30 m--font-boldest2" v-else>An error occurred {{error.statusCode}}</h1>
        <nuxt-link to="/">Home page</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error']
  }
</script>
