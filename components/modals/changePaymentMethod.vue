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

    <h4 class="m--font-blue m-form m--margin-top-10 text-center">
      Edit Payment Method
    </h4>

    <payment-card-change v-if="paymentData.method === 'card'"
                         :close="close"/>

    <payment-invoice-change v-if="paymentData.method === 'invoice'"
                            :paymentData="paymentData"
                            :close="close"/>

  </b-modal>

</template>

<script>
  import PaymentCardChange from '../settings/paymentCardChange.vue'
  import PaymentInvoiceChange from '../settings/paymentInvoiceChange'

  export default {
    props: ['show', 'paymentData'],
    components: {
      PaymentCardChange,
      PaymentInvoiceChange
    },
    methods: {
      close () {
        this.$store.dispatch('changePaymentModal', {open: false})
      }
    },
    name: 'change-payment-method'
  }
</script>

<style lang="scss"></style>
