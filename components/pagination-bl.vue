<template>
  <div class="col">
    <div class="row no-gutters align-items-center justify-content-end">
      <div>
        <span class="m--font-grey">
          {{total}} results
        </span>
      </div>
      <b-pagination-nav
        class="m--margin-left-30"
        v-if="listLength && total > 25"
        :link-gen="linkGen"
        :base-url="link"
        :use-router="true"
        :number-of-pages="Math.ceil(total / prePage)"
        v-model="model"/>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'link',
      'listLength',
      'total',
      'prePage',
      'model'
    ],
    methods: {
      linkGen (pageNum) {
        return '?page=' + pageNum
      }
    },
    name: 'pagination-bl'
  }
</script>

<style scoped>

</style>
