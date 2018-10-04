<template>
  <div>

    <change-payment-method v-if="changePayment.open"
                           :show="changePayment.open"
                           :paymentData="payment"/>

    <!--settings-payment-->
    <div class="row settings-payment">

      <!--settings-payment__plan-->
      <div class="col-md-3 settings-payment__plan">

        <div class="m-portlet m--padding-40">

          <!--settings-payment-plan-->
          <div class="settings-payment__plan-head">

            <dl>
              <dt class="settings-payment__plan-title">
                Your plan
              </dt>
              <dd>
                {{payment.type}} Plan
              </dd>
            </dl>

            <div class="settings-payment__plan-duration">{{payment.period}}</div>

          </div>
          <!--/settings-payment-plan-->

          <!--settings-payment-plan__info-->
          <div class="settings-payment__plan-info">

            <div v-if="!payment.cancelled" class="settings-payment__plan-title">Next Payment Date</div>
            <div v-if="payment.cancelled" class="settings-payment__plan-title">EXPIRES</div>

            <time v-if="payment.validTill">{{payment.validTill * 1000 | date('DD.MM.YYYY')}}</time>
            <time v-if="!payment.validTill">Awaiting Approval</time>

            <div class="m--margin-top-15"
                 v-if="payment.overdue">

              <div class="settings-payment__plan-title">Cost</div>
              <time>${{payment.price}}</time>

            </div>

            <a class="btn-cancel" href="#"
               v-if="!payment.cancelled && payment.validTill"
               id="cancel"
               @click="togglePopover">
              Cancel subscription
            </a>

            <b-popover placement="bottom"
                       :show.sync="popover"
                       target="cancel">

              <div class="light-popover center-arrow">
                  <span class="m--font-grey close-modal-btn"
                        @click="togglePopover">
                    <i class="la font-16 la-close"></i>
                  </span>
                <p class="m--font-boldest">
                  Are you sure you want to cancel <br>
                  subscription
                </p>
                <button
                  @click="cancelSubscription"
                  class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                  Yes, cancel subscription
                </button>
              </div>

            </b-popover>

            <div class="settings-payment__plan-btns">
              <nuxt-link
                to="/payment" class="">

                <span v-if="!payment.cancelled" class="btn btn-dark m-btn btn-block m--font-transform-u m--font-boldest2 m--margin-top-20">
                  switch plan
                </span>

                <span v-if="payment.cancelled && checkDate()" class="btn btn-dark m-btn btn-block m--font-transform-u m--font-boldest2 m--margin-top-20">
                  SUBSCRIBE
                </span>

              </nuxt-link>
            </div>

            <span v-if="paymentCanceled" class="settings-payment__plan-msg m--font-info m--font-transform-u m--font-boldest2">
              Your subscription was successfully cancelled
            </span>

          </div>
          <!--/settings-payment-plan__info-->

        </div>

      </div>
      <!--/settings-payment__plan-->

      <div class="col-md-9">

        <div class="m-portlet  m--padding-40">

          <div class="m--font-transform-u m--font-boldest m--margin-bottom-10">
            Payment Information
          </div>

          <!--settings-payment__form-->
          <b-form class="settings-payment__form m-form m-form--state m--margin-top-30"
                  @submit="onSubmit"
                  novalidate>

            <error-form :show="error.show"
                        :error-message="error.message"
                        @closeError="closeError"/>

            <div class="row">

              <div class="col-md-4">

                <b-form-group class="m-form__group"
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

                <b-form-group class="m-form__group"
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

                <b-form-group class="m-form__group"
                              label="Name of the Company"
                              label-class="form-control-label"
                              label-for="companyName">

                  <b-form-input id="companyName"
                                type="text"
                                v-model="form.companyName"
                                v-validate="'required|min:2|max:140'"
                                data-vv-as="companyName"
                                name="companyName"
                                class="m-input"
                                placeholder="Name of the Company">
                  </b-form-input>

                </b-form-group>

                <b-form-group class="m-form__group"
                              :class="{'has-danger': errors.has('phone') && form.submitted}"
                              label="Phone"
                              label-for="phone">

                  <the-mask v-model="form.phone"
                            id="phone"
                            data-vv-as="Phone"
                            name="phone"
                            class="m-input form-control"
                            placeholder="+XX(XXX)XXX-XX-XX"
                            v-validate="'required'"
                            :mask="['+##(###)###-##-##', '+##(###)##-###']">
                  </the-mask>

                  <div v-if="errors.has('phone') && form.submitted"
                       class="form-control-feedback">
                    {{errors.first('phone') || 'Invalid Phone number'}}
                  </div>

                </b-form-group>

              </div>

              <div class="col-md-4">

                <b-form-group v-if="Object.keys(payment).length !== 0"
                              class="m-form__group"
                              label="Payment Method"
                              label-class="form-control-label"
                              label-for="paymentMethod">

                  <div class="settings-payment__methods">

                    <div v-if="payment.method === 'card'">
                      Credit Card
                    </div>

                    <div v-if="payment.method === 'invoice'">
                      Invoice
                    </div>

                    <button class="btn btn-dark m-btn btn-block m--font-transform-u m--font-boldest2"
                            @click="changePaymentModal">
                      Edit
                    </button>

                  </div>

                </b-form-group>

                <b-form-group class="m-form__group"
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

                <b-form-group class="m-form__group"
                              label="Billing Address 2"
                              label-class="form-control-label"
                              label-for="billingAddress2">

                  <b-form-input id="billingAddress2"
                                type="text"
                                v-model="form.billingAddress2"
                                v-validate="'min:3|max:140'"
                                data-vv-as="billingAddress2"
                                name="billingAddress2"
                                class="m-input"
                                placeholder="Billing Address 2">
                  </b-form-input>

                </b-form-group>

                <b-form-group class="m-form__group"
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

              </div>

              <div class="col-md-4">

                <b-form-group class="m-form__group"
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

                <b-form-group class="m-form__group"
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

                <b-form-group class="m-form__group"
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

            </div>

            <div class="settings-payment__form-btns row justify-content-end align-items-center">

              <div class="col-auto">

                <span v-if="formSaved" class="m--font-info m--font-transform-u m--font-boldest2">
                  Saved
                </span>

              </div>

              <div class="col-auto">

                <button class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
                        v-bind:class="{'m-loader m-loader--light m-loader--center': isSending}"
                        type="submit">
                  Save Changes
                </button>

              </div>

            </div>

          </b-form>
          <!--/settings-payment__form-->

        </div>

      </div>

    </div>
    <!--/settings-payment-->
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import ChangePaymentMethod from '../modals/changePaymentMethod.vue'
  import errorForm from '../Error'

  export default {
    components: {
      ChangePaymentMethod,
      errorForm
    },
    computed: mapState([
      'payment',
      'currentUser',
      'countries',
      'changePayment'
    ]),
    data() {
      return {
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
          county: null,
          country: '',
          postCode: '',
          submitted: false
        },
        error: {
          show: false,
          message: null
        },
        popover: false,
        formSaved: false,
        paymentCanceled: false,
        isSending: false,
        selectedCountry: null,
      }
    },
    mounted: function () {

      if (this.countries && !this.payment.country) {
        this.changeCountry( this.countries[0] );
      } else if (this.countries && this.payment.country) {
        this.setCountry(this.payment.country)
      }
      this.setModel();
    },
    methods: {
      togglePopover (e) {
        e.preventDefault();
        this.popover = !this.popover;
      },
      checkDate() {
        let validTill = this.payment.validTill*1000,
          curDate = Date.now();

        return validTill<=curDate
      },
      cancelSubscription() {

        this.popover = false;

        this.$store.dispatch('deletePayment').then((res)=> {

          this.paymentCanceled = true;

          setTimeout(() => {
            this.paymentCanceled = false
          }, 2000)
        }).catch((rej) => {})
      },
      setModel () {

        this.form.user.forename = this.payment.nameFirst;
        this.form.user.surname = this.payment.nameLast;
        this.form.companyName = this.setCompanyModel();
        this.form.billingAddress1 = this.payment.addressLine1;
        this.form.billingAddress2 = this.payment.addressLine2;
        this.form.city = this.payment.city;
        this.form.county = this.payment.region;
        this.form.postCode = this.payment.postCode;
        this.form.phone = this.payment.phone;
        this.form.invoiceEmail = this.payment.invoiceEmail;
      },
      setCompanyModel () {
        let company = '';

        if (this.currentUser.company) {
          company = this.currentUser.company.name
        }
        return company;
      },
      onSubmit(e) {
        e.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if (result) {
            this.isSending = true;

            let data = {
              nameFirst: this.form.user.forename,
              nameLast: this.form.user.surname,
              phone: this.form.phone ? '+' + this.form.phone : '',
              addressLine1: this.form.billingAddress1,
              addressLine2: this.form.billingAddress2,
              invoiceEmail: this.form.invoiceEmail,
              city:  this.form.city,
              region: this.form.county,
              postCode: this.form.postCode,
              country: this.form.country
            };

            this.$store.dispatch('editPayment', {data: data}).then(()=> {
              this.isSending = false;
              this.formSaved = true;

              setTimeout(() => {
                this.formSaved = false
              }, 2000)
            }).catch((rej) => {
              this.renderError(rej);
            })
          }
        })
      },
      setCountry(country) {
        this.selectedCountry = country.name;
        this.form.country = country.id
      },
      changeCountry(option) {

        if (option) {
          this.selectedCountry = option.name;
          this.form.country = option.id
        }
      },
      changePaymentModal (e) {
        e.preventDefault();
        this.$store.dispatch('changePaymentModal', {open: true});
      },
      renderError(rej) {
        let errorData = rej;

        this.error.show = true;
        this.isSending = false;

        if (errorData.error.message) {
          this.error.message = errorData.error.message;
        } else {
          this.error.message = errorData.error.description;
        }

        if (errorData.error.code === 500) {
          return this.error.message = 'Server Error';
        }

        this.$store.getters.formValidation(errorData.form, this.errors)
      },
      closeError() {
        this.error.show = false;
      },
    },
    head() {
      return {
        title: 'Payment - Settings'
      }
    },
    name: 'payment'
  }
</script>

<style lang="scss">
  @import '../../assets/scss/settings/payment';
</style>
