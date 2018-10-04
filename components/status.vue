<template>
  <span v-if="status === 'notStarted'">
    Not Started
  </span>

  <span v-else-if="status === 'late'">
    Late
  </span>

  <span v-else-if="status === 'inProgress'">
    In Progress
  </span>

  <span v-else-if="status === 'finished'">
    Finished
  </span>

  <span v-else-if="status === 'arrived'">
    Arrived
  </span>

</template>

<script>
  export default {
    props: ['icons', 'status'],
    name: 'crew-status'
  }
</script>

<style scoped>

</style>
