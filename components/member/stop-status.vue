<template>
  <div>
    <span class="row align-items-center no-gutters" v-if="status === 'upcoming'">
      <span class="no-cursor m--margin-right-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
        <i class="m--font-light font-10 la la-arrow-right"></i>
      </span>

      <span class="opacity-6 font-12 m--font-boldest" v-if="!onlyIcon">
        upcoming
      </span>
    </span>
    <span class="row align-items-center no-gutters" v-if="status === 'checkedIn'">
      <span class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
        <i class="m--font-light font-10 la la-check"></i>
      </span>

      <span class="opacity-6 font-12 m--font-boldest" v-if="!onlyIcon">
        Checked In
      </span>
    </span>

    <span class="row align-items-center no-gutters" v-if="status === 'late'">
      <span class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
        <i class="m--font-light font-10 la la-close"></i>
      </span>

      <span class="opacity-6 font-12 m--font-boldest" v-if="!onlyIcon">
        Late
      </span>
    </span>
  </div>
</template>

<script>
  export default {
    props: ['status', 'onlyIcon'],
    name: 'stop-status'
  }
</script>

<style scoped>

</style>
