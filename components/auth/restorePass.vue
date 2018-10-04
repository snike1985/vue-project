<template>
  <div class="container">
    <div class="row no-gutters justify-content-center">
      <div class="col-md-4">
        <div class="text-center">
          <h2 class="m--font-blue">
            Restore Password
          </h2>
          <p class="m--font-grey">
            <span>
              Please enter and confirm new password and press continue button.
            </span>
          </p>
        </div>

        <div class="form-error" v-if="formError">
          <span class="m--margin-right-15 btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill">
            <i class="la la-close"></i>
          </span>
          <div class="text ">
            <p class="m--font-bold">
              {{formError}}
            </p>
          </div>
        </div>

        <b-form @submit="onSubmit" class="m-form m--padding-top-20" novalidate>
          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('plainPassword')}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="password"
                            type="password"
                            v-model="form.plainPassword"
                            v-validate="'required|min:8|max:64|confirmed:confirmPassword'"
                            required
                            data-vv-as="Password"
                            name="plainPassword"
                            minlength="8"
                            maxlength="64"
                            class="m-input"
                            placeholder="New Password">
              </b-form-input>
              <span class="m-input-icon__icon m-input-icon__icon--left">
                <span>
                  <i class="flaticon-lock-1"></i>
                </span>
              </span>
            </div>

            <div v-show="formSubmitted && errors.has('plainPassword')" class="form-control-feedback">
              {{errors.first('plainPassword')}}
            </div>
          </b-form-group>

          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('plainPassword')}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="confirmPassword"
                            type="password"
                            v-model="form.confirmPassword"
                            v-validate="'required'"
                            required
                            data-vv-as="Confirm password"
                            name="confirmPassword"
                            minlength="8"
                            maxlength="64"
                            class="m-input"
                            placeholder="Confirm Password">
              </b-form-input>
              <span class="m-input-icon__icon m-input-icon__icon--left">
                <span>
                  <i class="flaticon-lock-1"></i>
                </span>
              </span>
            </div>
            <div v-show="formSubmitted && errors.has('plainPassword')" class="form-control-feedback">
              {{errors.first('plainPassword')}}
            </div>
          </b-form-group>
          <b-button type="submit" class="m--font-transform-u m--font-boldest2 btn-info btn-block" variant="primary">
            Continue
          </b-button>
        </b-form>

      </div>
    </div>
  </div>
</template>

<script>
  import compact from 'lodash/compact'
  export default {
    name: "restore-pass",
    data () {
      return {
        formError: null,
        formSubmitted: false,
        form: {
          plainPassword: '',
          confirmPassword: ''
        }
      }
    },
    methods: {
      onSubmit (evt) {
        evt.preventDefault();
        this.formSubmitted = true;
        this.formError = null;
        this.$validator.validateAll()
          .then((result) => {
            if ( result ) {
              this.$store.dispatch('changePassword', this.form.plainPassword)
                .then((res) => {
                  this.$router.push('manage-crew-changes')
                })
                .catch((reject)=> {
                  if(reject.body.form && compact(reject.body.form).length) {
                    return this.$store.getters.formValidation(reject.body.form, this.errors);
                  }

                  this.formError = reject.error.message;
                })
            }
          })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/auth/auth.scss'
</style>
