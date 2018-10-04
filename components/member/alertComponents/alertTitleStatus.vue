<template>
  <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
    <span v-if="status.newStatus === 'finished' || status.newStatus === 'arrived'">
      End
    </span>
    <span v-if="status.newStatus === 'inProgress' && status.oldStatus === 'notStarted'">
      Start
    </span>
    <span v-if="status.newStatus === 'late'">
      Delay
    </span>
    <span v-if="status.newStatus === 'cancelled'">
      Cancel
    </span>
    <span v-if="status.newStatus === 'notStarted'">
      Not Started
    </span>
  </div>
</template>

<script>
  export default {
    props: ['status'],
    name: 'alertTitleStatus'
  }
</script>

<style scoped>

</style>
