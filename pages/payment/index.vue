<template>

  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">

    <div class="m-grid__item m-grid__item--fluid m-wrapper">

      <div class="m-content payment">

        <div v-if="step !== 2" class="payment__steps">

          <div class="payment__steps-wrap row">

            <div class="col-md-12  no-gutters">

              <div class="payment__steps-item"
                   :class="{'active': step === 0}">
                Choose Plan
              </div>

              <div class="payment__steps-item"
                   :class="{'active': step === 1}">
                Payment
              </div>

              <div class="payment__steps-item"
                   :class="{'active': step === 2}">
                Confirmation
              </div>

            </div>

          </div>

        </div>

        <div class="payment__wrap">

          <div class="row">

            <div class="col-md-12">

              <h4 class="payment__title m--font-dark"  v-if="step !== 2">
                {{titles[step].title}}
              </h4>

            </div>

          </div>

          <payment-plan v-if="step === 0"
                        :step="nextStep"
                        :paymentData="paymentData"/>

          <payment-detail v-if="step === 1"
                           :step="nextStep"
                           :paymentData="paymentData"/>

          <payment-confirm v-if="step === 2"
                           :paymentData="paymentData"/>

        </div>

      </div>

    </div>

  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  import paymentDetail from '../../components/payment/details'
  import paymentPlan from '../../components/payment/plan'
  import paymentConfirm from '../../components/payment/confirm'

  export default {
    components: {
      paymentDetail,
      paymentPlan,
      paymentConfirm
    },
    computed: mapState(['payment']),
    fetch({store}){
      return axios.all(
        [
          store.dispatch('getCountries'),
          store.dispatch('getPaymentPlans')
        ]
      )
    },
    data () {
      return {
        step: 0,
        titles: [
          {
            title: 'Choose Your Plan'
          },
          {
            title: 'Payment Details'
          },
          {
            title: false
          }
        ],
        paymentData: {
          period: {
            selected: 12,
            options: [
              { text: '3 Months', value: 3 },
              { text: 'Annual', value: 12 }
            ],
          },
          method: {
            selected: 'card',
            options: [
              {text: 'Credit Card', value: 'card'},
              {text: 'Request an Invoice', value: 'invoice'},
            ]
          },
          plan: {}
        }
      }
    },
    methods: {
      nextStep( step ) {
        this.step = step
      }
    },
    name: 'payment'
  }
</script>

<style lang="sass">
  @import '../../assets/scss/payment/index'
</style>
