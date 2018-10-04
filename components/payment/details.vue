<template>

  <div class="row">

    <div class="col-md-8">

      <div class="m-portlet m--padding-40">

        <div class="m--font-transform-u m--font-boldest m--margin-bottom-10">
          Choose payment method
        </div>

        <!--payment__details-->
        <div class="payment__details">

          <!--payment__plan-duration-->
          <div class="payment__details-method radio-group">

            <!--radio-group__btn-->
            <div class="radio-group__btn"
                 v-for="option in payment.method.options"
                 :key="option.value">

              <input type="radio" :id="option.value" :value="option.value" v-model="payment.method.selected">
              <label :for="option.value">{{option.text}}</label>

            </div>
            <!--/radio-group__btn-->

          </div>
          <!--/payment__plan-duration-->

          <!--payment__details-card-->
          <div class="payment__details-card">

            <payment-card v-if="payment.method.selected === 'card'"
                          :nextStep="nextStep"
                          :paymentData="payment"/>
            <payment-invoice v-if="payment.method.selected === 'invoice'"
                             :nextStep="nextStep"
                             :paymentData="payment"/>

          </div>
          <!--/payment__details-card-->

        </div>
        <!--/payment__details-->

      </div>

    </div>

    <div class="col-md-4">

      <!--payment__plan-->
      <div class="m-portlet m--padding-40 payment__plan-info">

        <h3>{{payment.plan.name}} Plan</h3>

        <p>{{payment.period.selected === 3 ? '3 Months' : 'Annual'}} </p>

        <!--payment__plan-info-period-->
        <dl class="payment__plan-info-period">
          <dt>Price per Month</dt>
          <dd>${{payment.plan.currentPrice}}</dd>
        </dl>
        <!--/payment__plan-info-period-->

        <div>
          <button class="btn btn-dark m-btn btn-block m--font-transform-u m--font-boldest2"
                  @click="switchPlan">
            switch plan
          </button>
        </div>

      </div>
      <!--/payment__plan-->

    </div>

  </div>

</template>

<script>
  import PaymentCard from '../payment/card';
  import PaymentInvoice from '../payment/invoice';

  export default {
    components: {
      PaymentCard,
      PaymentInvoice
    },
    props: ['paymentData', 'step'],
    data () {
      return {
        payment: this.paymentData,
      }
    },
    methods: {
      nextStep( step ) {
        this.step( step )
      },
      switchPlan() {
        this.payment.plan = null;
        this.step(0)
      }
    },
    name: 'detail'
  }
</script>
