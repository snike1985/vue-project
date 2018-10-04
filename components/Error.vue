<template>
  <b-alert variant="danger"
           dismissible
           class="m-alert m-alert--icon alert"
           :class="{'absolute': absolute}"
           @dismissed="close"
           :show="show">
    <div class="m-alert__icon">
      <i class="la la-warning"></i>
    </div>
    <div class="m-alert__text m--font-boldest2">
      {{errorMessage}}
    </div>
  </b-alert>
</template>

<script>
	export default {
	  props: ['show', 'errorMessage', 'absolute'],
    methods:{
	    close() {
        this.$emit('closeError');
      }
    },
		name: "errorForm"
	}
</script>

<style scoped>

</style>
