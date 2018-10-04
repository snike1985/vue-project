<template>
  <span>
    {{total}} result{{total > 1 ? 's': ''}}
  </span>
</template>

<script>
  export default {
    props: ['total'],
    name: 'table-result'
  }
</script>

<style scoped>

</style>
