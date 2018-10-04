<template>

  <!--payment__details-card-->
  <div class="payment__total">

    <dl>
      <dt>Total Billed:</dt>
      <dd><sup>$</sup>{{paymentData.plan.currentPrice*paymentData.period.selected}}</dd>
    </dl>

    <div class="payment__total-note">
      Total Billed due to Plan Switch: <mark>${{paymentData.plan.currentPrice}}</mark>
    </div>

  </div>
  <!--/payment__details-card-->

</template>

<script>

  export default {
    props: ['paymentData'],
    name: 'total'
  }
</script>
