<template>

  <!--payment__details-card-->
  <div class="payment__details-card">

    <!--payment__details-alert-->
    <div class="payment__details-alert" v-if="error.show">

      <error-form :show="error.show"
                  :error-message="error.message"
                  @closeError="closeError"/>

    </div>
    <!--/payment__details-alert-->

    <b-form class="payment__form m-form m-form--state m--margin-top-30"
            @submit="onSubmit"
            novalidate>

      <div class="row">

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('name') && form.submitted}"
                      label="Forename"
                      label-class="form-control-label"
                      label-for="forename">

          <b-form-input id="forename"
                        type="text"
                        v-model="form.user.forename"
                        v-validate="'required|min:3|max:140'"
                        required
                        data-vv-as="Forename"
                        name="name"
                        class="m-input"
                        placeholder="Forename">
          </b-form-input>

          <div v-show="errors.has('name') && form.submitted"
               class="form-control-feedback">
            {{errors.first('name')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('surname') && form.submitted}"
                      label="Surname"
                      label-class="form-control-label"
                      label-for="surname">

          <b-form-input id="surname"
                        type="text"
                        v-model="form.user.surname"
                        v-validate="'required|min:3|max:140'"
                        required
                        data-vv-as="Surname"
                        name="surname"
                        class="m-input"
                        placeholder="Surname">
          </b-form-input>

          <div v-show="errors.has('surname') && form.submitted"
               class="form-control-feedback">
            {{errors.first('surname')}}
          </div>

        </b-form-group>

      </div>

      <div class="row">

        <b-form-group class="m-form__group col-md-12"
                      label="Name of the Company"
                      label-class="form-control-label"
                      label-for="companyName">

          <b-form-input id="companyName"
                        type="text"
                        v-model="form.companyName"
                        :readonly="companyReadonly"
                        v-validate="'required|min:2|max:140'"
                        data-vv-as="Company Name"
                        name="companyName"
                        class="m-input"
                        placeholder="Name of the Company">
          </b-form-input>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('phone') && form.submitted}"
                      label="Phone"
                      label-for="phone">

          <the-mask v-model="form.phone"
                    id="phone"
                    data-vv-as="Phone"
                    name="phone"
                    class="m-input form-control"
                    v-validate="'required'"
                    placeholder="+XX(XXX)XXX-XX-XX"
                    :mask="['+##(###)###-##-##', '+##(###)##-###']">
          </the-mask>

          <div v-if="errors.has('phone') && form.submitted"
               class="form-control-feedback">
            {{errors.first('phone') || 'Invalid Phone number'}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-12"
                      :class="{'has-danger': errors.has('billingAddress1') && form.submitted}"
                      label="Billing Address 1"
                      label-class="form-control-label"
                      label-for="billingAddress1">

          <b-form-input id="billingAddress1"
                        type="text"
                        v-model="form.billingAddress1"
                        v-validate="'required|min:3|max:140'"
                        required
                        data-vv-as="Billing Address"
                        name="billingAddress1"
                        class="m-input"
                        placeholder="Billing Address 1">
          </b-form-input>

          <div v-show="errors.has('billingAddress1') && form.submitted"
               class="form-control-feedback">
            {{errors.first('billingAddress1')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-12"
                      label="Billing Address 2"
                      label-class="form-control-label"
                      label-for="billingAddress2">

          <b-form-input id="billingAddress2"
                        type="text"
                        v-model="form.billingAddress2"
                        v-validate="'min:3|max:140'"
                        name="billingAddress2"
                        class="m-input"
                        placeholder="Billing Address 2">
          </b-form-input>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('city') && form.submitted}"
                      label="City"
                      label-class="form-control-label"
                      label-for="city">

          <b-form-input id="city"
                        type="text"
                        v-model="form.city"
                        v-validate="'required|min:2|max:140'"
                        required
                        data-vv-as="City"
                        name="city"
                        class="m-input"
                        placeholder="City">
          </b-form-input>

          <div v-show="errors.has('city') && form.submitted"
               class="form-control-feedback">
            {{errors.first('city')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('county') && form.submitted}"
                      label="County"
                      label-class="form-control-label"
                      label-for="county">

          <b-form-input id="county"
                        type="text"
                        v-model="form.county"
                        v-validate="'min:3|max:140'"
                        data-vv-as="County"
                        name="county"
                        class="m-input"
                        placeholder="County">
          </b-form-input>

          <div v-show="errors.has('county') && form.submitted"
               class="form-control-feedback">
            {{errors.first('county')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('postCode') && form.submitted}"
                      label="Postcode"
                      label-class="form-control-label"
                      label-for="postCode">

          <b-form-input id="postCode"
                        type="text"
                        v-model="form.postCode"
                        v-validate="'required|min:3|max:12'"
                        required
                        data-vv-as="Post Code"
                        name="postCode"
                        class="m-input"
                        placeholder="Postcode">
          </b-form-input>

          <div v-show="errors.has('postCode') && form.submitted"
               class="form-control-feedback">
            {{errors.first('postCode')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      label="Country"
                      label-for="country">
          <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100 small-height"
                      id="country"
                      :text="(selectedCountry || countries[0].name)">

            <b-dropdown-item v-for="option in countries"
                             v-bind:key="option.id"
                             v-on:click="changeCountry(option)">
              {{option.name}}
            </b-dropdown-item>

          </b-dropdown>

        </b-form-group>

      </div>

      <div class="row">

        <b-form-group class="m-form__group col-md-12"
                      label="Card Number"
                      label-for="cardNumber">

          <card-number class='stripe-element stripe-card card-number m-input'
                       ref='cardNumber'
                       :stripe='stripeKey'
                       :options='{style: stripeOptions}'
                       @change='cardNumber = $event.complete'/>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      label="Expiration Date"
                      label-for="cardExpiry">

          <card-expiry class='stripe-element card-expiry'
                       ref='cardExpiry'
                       :stripe='stripeKey'
                       :options='{style: stripeOptions}'
                       @change='cardExpiry = $event.complete'/>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      label="CVC Check"
                      label-for="cardCvc">

          <card-cvc class='stripe-element card-cvc'
                    ref='cardCvc'
                    :stripe='stripeKey'
                    :options='{style: stripeOptions}'
                    @change='cardCvc = $event.complete'/>

        </b-form-group>

      </div>

      <!--payment__form-footer-->
      <div class="payment__form-footer">

        <payment-total :paymentData="paymentData"/>

        <button class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
                v-bind:class="{'m-loader m-loader--light m-loader--center': isSending}"
                type="submit">
          submit
        </button>

      </div>
      <!--/payment__form-footer-->

    </b-form>

  </div>
  <!--/payment__details-card-->

</template>

<script>
  import {mapState} from 'vuex'
  import stripeConfig from '../../services/stripe'
  import PaymentTotal from '../payment/total';
  import errorForm from '../Error'
  import {CardNumber, CardExpiry, CardCvc, createToken} from 'vue-stripe-elements'

  export default {
    components: {
      errorForm,
      PaymentTotal,
      CardNumber,
      CardExpiry,
      CardCvc,
      createToken
    },
    props: ['paymentData', 'nextStep'],
    computed: mapState([
      'countries',
      'currentUser',
      'payment'
    ]),
    watch: {
      cardNumber() {
        this.update()
      },
      cardExpiry() {
        this.update()
      },
      cardCvc() {
        this.update()
      }
    },
    mounted() {
      this.setModel();

      if (!this.payment) {
        this.changeCountry(this.countries[0]);
      }
    },
    data() {
      return {
        stripeOptions: {
          base: {
            fontSize: '1rem',
            color: "#575962",
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#848790',
            }
          },
          invalid: {
            color: "#575962",
          }
        },
        stripeKey: stripeConfig.stripeKey,
        form: {
          user: {
            forename: '',
            surname: ''
          },
          companyName: '',
          phone: '',
          billingAddress1: '',
          billingAddress2: '',
          city: '',
          county: '',
          country: '',
          postCode: '',
          submitted: false,
          error: null
        },
        error: {
          show: false,
          message: null
        },
        companyReadonly: false,
        selectedCountry: null,
        complete: false,
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
        isSending: false
      }
    },
    methods: {
      closeError() {
        this.error.show = false;
      },
      renderError(rej) {
        let errorData = rej;

        this.error.show = true;
        this.isSending = false;

        if (errorData.error && errorData.error.message) {
          this.error.message = errorData.error.message;
        } else if (errorData.error) {
          this.error.message = errorData.error.description;
        } else {
          this.error.message = 'Please fill out the billing information'
        }

        if (errorData.error.code === 500) {
          return this.error.message = 'Server Error';
        }

        this.$store.getters.formValidation(rej.body.form, this.errors)
      },
      setModel() {
        let company = '';

        if (this.currentUser.company) {
          company = this.currentUser.company.name
        }

        if (company) {
          this.companyReadonly = true
        }

        this.form.companyName = company;

        if (this.payment) {

          this.form.user = {
            forename: this.payment.nameFirst,
            surname: this.payment.nameLast
          };
          this.form.phone = this.payment.phone;
          this.form.billingAddress1 = this.payment.addressLine1;
          this.form.billingAddress2 = this.payment.addressLine2;
          this.form.city = this.payment.city;
          this.form.county = this.payment.region;
          this.form.postCode = this.payment.postCode;

          this.changeCountry(this.payment.country);
        }
      },
      changeCountry(option) {

        if (option) {
          this.selectedCountry = option.name;
          this.form.country = option.id
        }
      },
      onSubmit(e) {
        e.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if (result) {
            let token = null,
              method = null;

            this.isSending = true;

            createToken().then((data) => {
              token = data.token.id;

              this.isSending = true;

              if (this.payment) {
                method = 'switchPayment'
              }else{
                method = 'setPayment'
              }

              this.setPayment(token, method)

            }).catch((rej) => {
              this.renderError(rej);
            });
          }
        })
      },
      setPayment(token, method) {

        const data = {
          type: this.paymentData.plan.type,
          period: this.paymentData.period.selected === 3 ? 'quarter' : 'annual',
          method: this.paymentData.method.selected,
          nameFirst: this.form.user.forename,
          nameLast: this.form.user.surname,
          phone: this.form.phone ? '+' + this.form.phone : '',
          addressLine1: this.form.billingAddress1,
          addressLine2: this.form.billingAddress2,
          invoiceEmail: this.currentUser.contactEmail,
          city: this.form.city,
          region: this.form.county,
          postCode: this.form.postCode,
          country: this.form.country,
          token: token
        };

        this.$store.dispatch(method, {data: this.setPaymentData(token)}).then((res) => {

          this.nextStep(2);
          this.isSending = false;

        }).catch((rej) => {
          this.renderError(rej);
        })
      },
      switchPlan(token) {
        const data = {
          type: this.paymentData.plan.type,
          period: this.paymentData.period.selected === 3 ? 'quarter' : 'annual',
          method: this.paymentData.method.selected,
          token: token
        };

        this.$store.dispatch('switchPayment', {data: data}).then(()=> {

          this.nextStep(2);
          this.isSending = false;

        }).catch((rej) => {
          this.renderError(rej)
        })
      },
      update() {
        this.complete = this.cardNumber && this.cardExpiry && this.cardCvc;

        if (this.cardNumber) {

          if (!this.cardExpiry) {

            this.$refs.cardExpiry.focus()

          } else if (!this.cardCvc) {

            this.$refs.cardCvc.focus()
          }

        } else if (this.cardExpiry) {

          if (!this.cardCvc) {

            this.$refs.cardCvc.focus()

          } else if (!this.cardNumber) {

            this.$refs.cardNumber.focus()

          }
        }
      },
      setPaymentData(token) {

        const data = {
          type: this.paymentData.plan.type,
          period: this.paymentData.period.selected === 3 ? 'quarter' : 'annual',
          method: this.paymentData.method.selected,
          nameFirst: this.form.user.forename,
          nameLast: this.form.user.surname,
          phone: this.form.phone ? '+' + this.form.phone : '',
          addressLine1: this.form.billingAddress1,
          addressLine2: this.form.billingAddress2,
          invoiceEmail: this.currentUser.contactEmail,
          city: this.form.city,
          region: this.form.county,
          postCode: this.form.postCode,
          country: this.form.country,
          token: token
        };

        return data
      }
    },
    name: 'card'
  }
</script>

<style lang="scss">
  .StripeElement {
    height: 37px;
    background-color: #fff;
    padding: 0.65rem 1.25rem;
    border-radius: 0.25rem;
    border: 1px solid #ebedf2;
    color: #575962;
    font-family: sans-serif, Arial;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  }

  .StripeElement--focus {
    border-color: #00a0ff;
  }

  .StripeElement--invalid {
    border-color: #f4516c;
  }
</style>
