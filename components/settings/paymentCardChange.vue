<template>

  <b-form @submit="onSubmit" class="m-form m--margin-top-20" novalidate>

    <error-form :show="error.show"
                :error-message="error.message"
                @closeError="closeError"/>

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

      <div class="col-md-12 m--margin-bottom-15">
        <b-button type="submit"
                  v-bind:class="{'m-loader m-loader--light m-loader--right': form.isSending}"
                  class="m--font-transform-u m--font-boldest2 btn-info btn-block"
                  variant="primary">
          SAVE
        </b-button>

      </div>
    </div>

  </b-form>

</template>

<script>
  import { CardNumber, CardExpiry, CardCvc, createToken } from 'vue-stripe-elements'
  import stripeConfig from '../../services/stripe'
  import errorForm from '../Error'

  export default {
    props: ['close'],
    components: {
      CardNumber,
      CardExpiry,
      CardCvc,
      createToken,
      errorForm
    },
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
    data () {
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
          cardNumber: false,
          cardExpiry: false,
          cardCvc: false,
          isSending: false
        },
        error: {
          show: false,
          message: null
        }
      }
    },
    methods: {
      editPaymentCard( token ) {

        this.$store.dispatch('editPaymentCard', {token: token}).then(()=> {
          this.form.isSending = false;
          this.close();
        }).catch((rej) => {
          this.renderError(rej);
        });
      },
      onSubmit (e) {
        e.preventDefault();

        this.form.isSending = true;

        createToken().then( (data) => {
          this.editPaymentCard(data.token.id);
        }).catch(() => {
          this.form.isSending = false;
        });
      },
      update () {
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
      renderError(rej) {
        let errorData = rej;

        this.error.show = true;
        this.form.isSending = false;

        if (errorData.body.message) {
          this.error.message = errorData.body.message;
        } else {
          this.error.message = errorData.error.description;
        }

        if (errorData.error.code === 500) {
          return this.error.message = 'Server Error';
        }

        this.$store.getters.formValidation(rej.body.form, this.errors)
      },
      closeError() {
        this.error.show = false;
      },
    },
    name: 'payment-card-change'
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
