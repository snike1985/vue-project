<template>

  <!--payment__details-card-->
  <div class="payment__confirm">

    <!--payment__confirm-image-->
    <div class="payment__confirm-image">
      <img src="~/assets/images/confirm_image.png" alt="confirm_image.png">
    </div>
    <!--/payment__confirm-image-->

    <!--payment__confirm-title-->
    <h2 class="payment__confirm-title">Great!</h2>
    <!--/payment__confirm-title-->

    <p v-if="data.method.selected === 'invoice' && data.plan.type !== 'custom'">
      Your request is being processed. You will receive the invoice within 24 hours.
    </p>

    <p v-if="data.method.selected === 'card' && data.plan.type !== 'custom'">
      The payment was successful.
    </p>

    <p v-if="data.plan.type === 'custom'">
      Thank you for the request. Our manager will contact you shortly.
    </p>

    <nuxt-link
      to="/manage-crew-changes"
      class="btn btn-info">
      Go To Dashboard
    </nuxt-link>

  </div>
  <!--/payment__details-card-->

</template>

<script>

  export default {
    props: [
      'paymentData'
    ],
    data() {
      return {
        data: this.paymentData
      }
    },
    methods: {},
    name: 'confirm'
  }
</script>
