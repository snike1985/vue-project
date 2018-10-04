<template>
  <b-modal
    v-model="show"
    id="changePayment"
    size="sm"
    :class="'medium-dialog'"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">

    <span class="m--font-grey close-modal-btn" @click="close">
      <i class="la la-close"></i>
    </span>

    <div class="content__accepted-modal">

      <img src="~/assets/images/confirm_image.png" alt="confirm_image.png">

      <h4 class="m--font-blue m-form m--margin-top-10 text-center">
        Thanks
      </h4>

      <p class="m--margin-bottom-30">
        You will be contacted within the next 24 hours
      </p>

    </div>

  </b-modal>

</template>

<script>

  export default {
    props: ['show'],
    methods: {
      close () {
        this.$store.dispatch('acceptedModal', {open: false})
      }
    },
    name: 'accepted-modal'
  }
</script>

<style lang="scss"></style>
