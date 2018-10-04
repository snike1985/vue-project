<template>

  <b-form @submit="onSubmit" class="m-form m--margin-top-20" novalidate>

    <error-form :show="error.show"
                :error-message="error.message"
                @closeError="closeError"/>

    <div class="row">

      <b-form-group class="m-form__group col-md-12"
                    :class="{'has-danger': errors.has('invoiceEmail') && form.submitted}"
                    label="Invoice Email"
                    label-class="form-control-label"
                    label-for="invoiceEmail">

        <b-form-input id="invoiceEmail"
                      type="email"
                      v-validate="'required|email'"
                      v-model="form.invoiceEmail"
                      required
                      data-vv-as="invoiceEmail"
                      name="invoiceEmail"
                      class="m-input"
                      placeholder="Email Address">
        </b-form-input>


        <div v-show="errors.has('invoiceEmail') && form.submitted"
             class="form-control-feedback">
          {{errors.first('invoiceEmail')}}
        </div>

      </b-form-group>

      <b-form-group class="m-form__group col-md-12"
                    :class="{'has-danger': errors.has('position') && form.submitted}"
                    label="Position"
                    label-class="form-control-label"
                    label-for="position">

        <b-form-input id="position"
                      type="text"
                      v-validate="'required|min:3|max:140'"
                      v-model="form.position"
                      required
                      data-vv-as="position"
                      name="position"
                      class="m-input"
                      placeholder="Your Position">
        </b-form-input>


        <div v-show="errors.has('position') && form.submitted"
             class="form-control-feedback">
          {{errors.first('position')}}
        </div>

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
  import errorForm from '../Error'

  export default {
    props: ['close', 'paymentData'],
    components: {
      errorForm
    },
    data () {
      return {
        form: {
          invoiceEmail: this.paymentData.invoiceEmail || '',
          position: this.paymentData.position || '',
          submitted: false,
          isSending: false
        },
        error: {
          show: false,
          message: null
        }
      }
    },
    methods: {
      onSubmit (e) {
        e.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if ( result ) {
            this.form.isSending = true;

            const data = {
              invoiceEmail: this.form.invoiceEmail,
              position: this.form.position
            };

            this.$store.dispatch('editPaymenInvoice', {data: data}).then(()=> {
              this.form.isSending = false;
              this.close();
            }).catch((rej) => {
              this.renderError(rej);
            });
          }
        });
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
    name: 'payment-invoice-change'
  }
</script>

<style lang="scss"></style>
