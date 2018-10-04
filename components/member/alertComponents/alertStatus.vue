<template>
  <span>
    <span v-if="status.newStatus === 'finished'">
      is completed‌.
    </span>
    <span
      v-else-if="status.newStatus === 'inProgress'">
      has started.
    </span>
    <span v-else-if="status.newStatus === 'late' && status.oldStatus !== 'notStarted'">
      is late.
    </span>
    <span v-else-if="status.newStatus === 'late' && status.oldStatus === 'notStarted'">
      has not started the trip on time.
    </span>
    <span v-if="status.newStatus === 'cancelled'">
      is cancelled.
    </span>
    <span v-if="status.newStatus === 'notStarted'">
      not started.
    </span>
  </span>
</template>

<script>
  export default {
    props: ['status'],
    name: 'alertStatus'
  }
</script>
