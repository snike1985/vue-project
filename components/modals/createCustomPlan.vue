<template>
  <b-modal
    v-model="show"
    id="createCustomPlan"
    size="sm"
    :class="'medium-dialog'"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <span class="m--font-grey close-modal-btn" @click="close">
      <i class="la 	la-close"></i>
    </span>

    <h4 class="m--font-blue m-form m--margin-top-10 text-center">
      Create Custom Plan
    </h4>

    <div v-if="form.error" class="text-center">
      <span class="m--font-danger m--font-boldest">{{form.error}}</span>
    </div>

    <b-form @submit="createPlan" class="m-form m--margin-top-20 m--padding-bottom-10" novalidate>

      <error-form :show="error.show"
                  :error-message="error.message"
                  @closeError="closeError"/>

      <div class="row">

        <b-form-group class="m-form__group col-md-12"
                      label="Billing option"
                      label-class="form-control-label"
                      label-for="companyName">

          <b-form-radio-group id="radios2" v-model="form.period.selected" name="billingOption">

            <b-form-radio class="m-radio col-6" value="annual"><span></span>Annually</b-form-radio>
            <b-form-radio class="m-radio col-6" value="3 month"><span></span>Quarterly</b-form-radio>

          </b-form-radio-group>

        </b-form-group>

        <b-form-group class="m-form__group col-md-12"
                      :class="{'has-danger': errors.has('companyName') && form.submitted}"
                      label="Name of the Company"
                      label-class="form-control-label"
                      label-for="companyName">

          <b-form-input id="companyName"
                        type="text"
                        @input="onChange(errors)"
                        v-model="form.companyName"
                        v-validate="'required|min:2|max:140'"
                        data-vv-as="Company Name"
                        name="companyName"
                        class="m-input"
                        required
                        placeholder="Name of the Company">
          </b-form-input>

          <div v-show="errors.has('companyName') && form.submitted"
               class="form-control-feedback">
            {{errors.first('companyName')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('email') && form.submitted}"
                      label="Email"
                      label-class="form-control-label"
                      label-for="email">

          <b-form-input id="email"
                        type="email"
                        @input="onChange(errors)"
                        v-validate="'required|email'"
                        v-model="form.email"
                        required
                        data-vv-as="Email"
                        name="email"
                        class="m-input"
                        placeholder="Email Address">
          </b-form-input>


          <div v-show="errors.has('email') && form.submitted"
               class="form-control-feedback">
            {{errors.first('email')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('phone') && form.submitted}"
                      label="Phone"
                      label-for="phone">

          <the-mask v-model="form.phone"
                    id="phone"
                    @input="onChange(errors)"
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
                      :class="{'has-danger': errors.has('billingAddress') && form.submitted}"
                      label="Company’s billing address"
                      label-class="form-control-label"
                      label-for="billingAddress">

          <b-form-input id="billingAddress"
                        type="text"
                        @input="onChange(errors)"
                        v-model="form.billingAddress"
                        v-validate="'required|min:3|max:140'"
                        required
                        data-vv-as="Billing Address"
                        name="billingAddress"
                        class="m-input"
                        placeholder="Billing Address">
          </b-form-input>

          <div v-show="errors.has('billingAddress') && form.submitted"
               class="form-control-feedback">
            {{errors.first('billingAddress')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('units') && form.submitted}"
                      label="Number of vessels/units under the subscription"
                      label-class="form-control-label"
                      label-for="units">

          <b-form-input id="units"
                        type="number"
                        @input="onChange(errors)"
                        v-model="form.units"
                        v-validate="'required|min:1'"
                        required
                        data-vv-as="Number of Units"
                        name="units"
                        class="m-input"
                        placeholder="Number of vessels/units">
          </b-form-input>

          <div v-show="errors.has('units') && form.submitted"
               class="form-control-feedback">
            {{errors.first('units')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col-md-6"
                      :class="{'has-danger': errors.has('travellers') && form.submitted}"
                      label="Number of travellers per month"
                      label-class="form-control-label"
                      label-for="travellers">

          <b-form-input id="travellers"
                        type="number"
                        @input="onChange(errors)"
                        v-model="form.travellers"
                        v-validate="'required|min:1'"
                        required
                        data-vv-as="Number of Travellers"
                        name="travellers"
                        class="m-input"
                        placeholder="Number of travellers">
          </b-form-input>

          <div v-show="errors.has('travellers') && form.submitted"
               class="form-control-feedback">
            {{errors.first('travellers')}}
          </div>

        </b-form-group>
      </div>

      <button
        class=" m--margin-top-20 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
        v-bind:class="{'m-loader m-loader--light m-loader--right': isSending}"
        type="submit">
        Save
      </button>

    </b-form>

  </b-modal>

</template>

<script>
  import errorForm from '../Error'

  export default {
    components: {errorForm},
    props: [
      'paymentData',
      'currentStep',
      'show'
    ],
    data() {
      return {
        payment: this.paymentData,
        form: {
          companyName: '',
          email: '',
          phone: '',
          billingAddress: '',
          period: {
            selected: 'annual',
            options: [
              {value: 'annual'},
              {value: '3 month'}
            ]
          },
          units: '',
          travellers: '',
          submitted: false,
          error: null
        },
        error: {
          show: false,
          message: null
        },
        isSending: false,
      }
    },
   methods: {
      onChange(errors) {

        if (this.error.show && !errors.items.length) {
          this.error.show = false
        }
      },
      close() {
        const data = {
          open: false
        };
        this.$store.dispatch('createCustomPlanModal', data)
      },
      createPlan(e) {
        e.preventDefault();
        this.form.error = null;

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if (result) {

            this.isSending = true;

            let data = {
              companyName: this.form.companyName,
              email: this.form.email,
              phone: this.form.phone ? '+' + this.form.phone : '',
              billingAddress: this.form.billingAddress,
              period: this.form.period.selected,
              units: this.form.units,
              travellers: this.form.travellers
            };

            this.$store.dispatch('setCustomPlan', {data: data}).then(()=> {
              this.isSending = false;
              this.payment.plan = {type: 'custom'};
              this.close();
              this.currentStep(2)
            }).catch((rej) => {
              this.renderError(rej);
            })
          }
        })
      },
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

        if (errorData.error.code === 500) {
          return this.error.message = 'Server Error';
        }

        this.$store.getters.formValidation(rej.body.form, this.errors)
      }
    },
    name: 'create-custom-plan'
  }
</script>

<style lang="scss" scoped>

  .m-radio {
    margin-bottom: 0
  }

</style>
