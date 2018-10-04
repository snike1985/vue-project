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

        <b-form-group class="m-form__group col-md-12"
                      :class="{'has-danger': errors.has('position') && form.submitted}"
                      label="Position"
                      label-class="form-control-label"
                      label-for="position">

          <b-form-input id="position"
                        type="text"
                        v-model="form.user.position"
                        v-validate="'required|min:3|max:140'"
                        required
                        data-vv-as="Position"
                        name="position"
                        class="m-input"
                        placeholder="Manager">
          </b-form-input>

          <div v-show="errors.has('position') && form.submitted"
               class="form-control-feedback">
            {{errors.first('position')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-12"
                      label="Name of the Company"
                      label-class="form-control-label"
                      label-for="companyName">

          <b-form-input id="companyName"
                        type="text"
                        v-model="form.companyName"
                        v-validate="'required|min:2|max:140'"
                        data-vv-as="Company Name"
                        name="companyName"
                        class="m-input"
                        placeholder="Name of the Company">
          </b-form-input>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('invoiceEmail') && form.submitted}"
                      label="Invoice Email"
                      label-class="form-control-label"
                      label-for="invoiceEmail">

          <b-form-input id="invoiceEmail"
                        type="email"
                        v-validate="'required|email'"
                        v-model="form.invoiceEmail"
                        required
                        data-vv-as="Invoice Email"
                        name="invoiceEmail"
                        class="m-input"
                        placeholder="Email Address">
          </b-form-input>


          <div v-show="errors.has('invoiceEmail') && form.submitted"
               class="form-control-feedback">
            {{errors.first('invoiceEmail')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('phone') && form.submitted}"
                      label="Phone"
                      label-for="phone">

          <the-mask v-model="form.phone"
                    id="phone"
                    data-vv-as="Phone"
                    name="phone"
                    v-validate="'required'"
                    class="m-input form-control"
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

      <!--payment__form-footer-->
      <div class="payment__form-footer">

        <payment-total :paymentData="paymentData"/>


        <button class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
                v-bind:class="{'m-loader m-loader--light m-loader--center': isSending}"
                type="submit">
          Submit
        </button>

      </div>
      <!--/payment__form-footer-->

    </b-form>

  </div>
  <!--/payment__details-card-->

</template>

<script>
  import { mapState } from 'vuex'
  import PaymentTotal from '../payment/total';
  import errorForm from '../Error'

  export default {
    components: {
      PaymentTotal,
      errorForm
    },
    props: ['paymentData', 'nextStep'],
    computed: mapState(['countries', 'currentUser', 'payment']),
    mounted() {
      this.setModel();

      if (!this.payment) {
        this.changeCountry(this.countries[0])
      }
    },
    data () {
      return {
        form: {
          user: {
            forename: '',
            surname: '',
            position: ''
          },
          companyName: '',
          invoiceEmail: '',
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
        isSending: false,
        selectedCountry: null,
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
      setModel () {
        let company = '',
            email = '',
            signUpEmail = this.currentUser.username;

        if (this.currentUser.company) {
          company = this.currentUser.company.name
        }

        if (this.currentUser.contactEmail) {
          email = this.currentUser.contactEmail
        }

        this.form.companyName = company;

        if (this.payment) {

          this.form.user = {
            forename: this.payment.nameFirst,
            surname: this.payment.nameLast,
            position: this.payment.position
          };
          this.form.phone = this.payment.phone;
          this.form.billingAddress1 = this.payment.addressLine1;
          this.form.billingAddress2 = this.payment.addressLine2;
          this.form.invoiceEmail = this.payment.invoiceEmail || email || signUpEmail;
          this.form.city = this.payment.city;
          this.form.county = this.payment.region;
          this.form.postCode = this.payment.postCode;

          this.changeCountry(this.payment.country);

        } else {
          this.form.invoiceEmail = email || signUpEmail
        }
      },
      changeCountry(option) {

        if (option) {
          this.selectedCountry = option.name;
          this.form.country = option.id
        }
      },
      setPayment(method) {

        this.$store.dispatch(method, {data: this.setPaymentData()}).then(()=> {

          this.nextStep(2);
          this.isSending = false;

        }).catch((rej) => {
          this.renderError(rej)
        })

      },
      onSubmit(e) {
        e.preventDefault();
        let method = null;

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if ( result ) {
            this.isSending = true;

            if (this.payment) {
              method = 'switchPayment'
            }else{
              method = 'setPayment'
            }

            this.setPayment(method)
          }
        })
      },
      setPaymentData() {

        const data = {
          type: this.paymentData.plan.type,
          period: this.paymentData.period.selected === 3 ? 'quarter' : 'annual',
          method: this.paymentData.method.selected,
          nameFirst: this.form.user.forename,
          nameLast: this.form.user.surname,
          phone: this.form.phone ? '+' + this.form.phone : '',
          addressLine1: this.form.billingAddress1,
          addressLine2: this.form.billingAddress2,
          city:  this.form.city,
          region: this.form.county,
          postCode: this.form.postCode,
          country: this.form.country,
          position: this.form.user.position,
          invoiceEmail: this.form.invoiceEmail,
        };

        return data
      }
    },
    name: 'invoice'
  }
</script>
