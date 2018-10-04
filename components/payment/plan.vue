<template>

  <div class="payment__plans">

    <create-custom-plan v-if="createCustomPlan.open"
                        :paymentData="data"
                        :currentStep="step"
                        :show="createCustomPlan.open"/>

    <div class="row">

      <div class="col-md-12">

        <!--payment__plan-duration-->
        <div class="payment__plans-duration radio-group">

          <!--radio-group__btn-->
          <div class="radio-group__btn"
               v-for="option in paymentData.period.options"
               :key="option.value">

            <input type="radio" :id="option.value" :value="option.value" v-model="paymentData.period.selected">
            <label :for="option.value">{{option.text}}</label>

          </div>
          <!--/radio-group__btn-->

        </div>
        <!--/payment__plan-duration-->

        <div class="row">

          <div v-for="(item, index) in paymentPlans"
               v-bind:key="index"
               class="col-md-4 m--margin-bottom-30">

            <!--payment__plans-item-->
            <div class="payment__plans-item m-portlet">

              <h3>{{item.name}}</h3>

              <p>
                {{item.description}}
              </p>

              <!--payment__plans-price-->
              <div class="payment__plans-price">

                <span>{{item.currency || '$'}}</span>

                <strong :data-price="``+ getCurrentPrice( item )+``"><span>{{getCurrentPrice( item )}}</span></strong>

                <p>per<br/>
                  month</p>

              </div>
              <!--/payment__plans-price-->

              <!--payment__plans-advantages--->
              <ul class="payment__plans-advantages">
                <li v-for="(advantages, index) in item.advantages"
                    v-bind:key="index">
                  <i class="la la-check"></i>
                  <p>{{advantages}}</p>
                </li>
              </ul>
              <!--/payment__plans-advantages--->

              <div class="payment__plans-btns">

                <!--btn-->
                <button type="button" class="btn btn-info"
                        :disabled="isCurrentPlan(item.type)"
                        @click="choosePlan( item )">

                  <span v-if="!isCurrentPlan(item.type)">apply</span>
                  <span v-if="isCurrentPlan(item.type)">Your current plan</span>

                </button>
                <!--/btn-->

              </div>

            </div>
            <!--/payment__plans-item-->

          </div>

          <div class="col-md-4 m--margin-bottom-30">

            <!--payment__plans-item-->
            <div class="payment__plans-item m-portlet">

              <h3>Custom</h3>

              <p>
                In order to obtain a quote, please send us email to <a
                href="mailto:hello@jurnez.com">hello@jurnez.com</a> with the following information:
              </p>

              <!--payment__plans-advantages--->
              <ul class="payment__plans-advantages">
                <li>
                  <i class="la la-check"></i>
                  <p>Company name</p>
                </li>
                <li>
                  <i class="la la-check"></i>
                  <p>Company’s billing address, contact name and email/phone number</p>
                </li>
                <li>
                  <i class="la la-check"></i>
                  <p>Billing option: quarterly or annually</p>
                </li>
                <li>
                  <i class="la la-check"></i>
                  <p>Number of vessels/units under the subscription</p>
                </li>
                <li>
                  <i class="la la-check"></i>
                  <p>Number of travellers per month</p>
                </li>
              </ul>
              <!--/payment__plans-advantages--->

              <div class="payment__plans-btns">
                <button type="button" class="btn btn-info" @click="openCreatePlanModal">Create Custom Plan</button>
              </div>

            </div>
            <!--/payment__plans-item-->

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<!--getPaymentPlans-->

<script>
  import {mapState} from 'vuex'
  import CreateCustomPlan from '../modals/createCustomPlan'

  export default {
    components: {CreateCustomPlan},
    props: ['paymentData', 'step'],
    computed: mapState(['paymentPlans', 'createCustomPlan', 'payment']),
    data() {
      return {
        data: this.paymentData
      }
    },
    methods: {
      isCurrentPlan(plan) {
        let isCurrent = false,
          currentPeriod = this.paymentData.period.selected;

        if (currentPeriod === 12) {
          currentPeriod = 'annual'
        }else if (currentPeriod === 3){
          currentPeriod = 'quarter'
        }

        if (this.payment &&
          plan === this.payment.type &&
          !this.payment.cancelled &&
          this.payment.period === currentPeriod) {

          isCurrent = true
        }
        return isCurrent
      },
      openCreatePlanModal(e) {
        e.preventDefault();

        this.$store.dispatch('createCustomPlanModal', {open: true})
      },
      getCurrentPrice(plan) {
        let currentPrice = plan.priceYear,
          period = this.data.period.selected;

        if (parseFloat(period) === 3) {
          currentPrice = plan.priceQuarter
        }
        return currentPrice
      },
      choosePlan(plan) {

        this.data.plan = {
          name: plan.name,
          currentPrice: this.getCurrentPrice(plan),
          currency: plan.currency,
          type: plan.type
        };

        if (this.paymentData.plan) {
          this.step(1)
        }
      }
    },
    name: 'plan'
  }
</script>
