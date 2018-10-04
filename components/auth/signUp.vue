<template>

  <div class="container">
    <div class="row no-gutters justify-content-center">
      <div class="col-md-4">
        <div class="text-center">
          <h2 class="m--font-blue">
            Sign Up
          </h2>
          <p class="m--font-grey">
            <span>
              Register for Jurnez - a secure platform to keep track of the marine crew's journey and communicate with your people while they are travelling around the world.
            </span>
          </p>
        </div>

        <div class="form-error" v-if="formError">
          <span class="icon">
            <img src="~/assets/images/signIn-error.svg" alt="">
          </span>
          <div class="text ">
            <p class="m--font-bold">
              {{formError}}
            </p>
          </div>
        </div>

        <b-form @submit="onSubmit" class="m-form m--padding-top-20" novalidate>
          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('companyName') && formSubmitted}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="companyName"
                            type="text"
                            v-model="form.companyName"
                            v-validate="'required|min:3|max:140'"
                            required
                            data-vv-as="Company Name"
                            name="companyName"
                            class="m-input"
                            placeholder="Company Name">
              </b-form-input>
              <span class="m-input-icon__icon m-input-icon__icon--left">
                <span>
                  <i class="flaticon-suitcase"></i>
                </span>
              </span>
            </div>
            <div v-show="formSubmitted && errors.has('companyName')" class="form-control-feedback">
              {{errors.first('companyName')}}
            </div>

          </b-form-group>

          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('username') && formSubmitted}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="email"
                            type="email"
                            v-validate="'required|email'"
                            v-model="form.username"
                            required
                            data-vv-as="Email"
                            name="username"
                            class="m-input"
                            placeholder="Email Address">
              </b-form-input>
              <span class="m-input-icon__icon m-input-icon__icon--left">
                <span>
                  <i class="flaticon-paper-plane"></i>
                </span>
              </span>
            </div>
            <div v-show="formSubmitted && errors.has('username')" class="form-control-feedback">
              {{errors.first('username')}}
            </div>
          </b-form-group>

          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('plainPassword') && formSubmitted}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="password"
                            type="password"
                            v-model="form.plainPassword"
                            v-validate="'required|min:8|max:64|confirmed:confirmPassword'"
                            required
                            data-vv-as="Password"
                            name="plainPassword"
                            class="m-input"
                            placeholder="Password">
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

          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('plainPassword') && formSubmitted}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="confirmPassword"
                            type="password"
                            v-model="form.confirmPassword"
                            v-validate="'required|min:8|max:64'"
                            required
                            data-vv-as="Confirm password"
                            name="confirmPassword"
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


          <b-button type="submit"
                    class="btn-info m--font-transform-u m--font-boldest2 btn-block m--font-transform-u"
                    v-bind:class="{'m-loader m-loader--light m-loader--right': formLoading}"
                    variant="primary">
            Sign Up
          </b-button>
        </b-form>

        <p class="text-center m--padding-top-20">
          <span class="m--font-grey">
            By signing up, I agree with
            <a href="/terms" class="m-link m-link--state m-link--primary" target="_blank">Terms And Conditions</a> <br>
            and <a href="/privacy" class="m-link m-link--state m-link--primary" target="_blank">Privacy Policy</a>
          </span>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'sign-up',
    data () {
      return {
        formSubmitted: false,
        formLoading: false,
        formError: null,
        form: {
          companyName: '',
          username: '',
          plainPassword: '',
          confirmPassword: ''
        }
      }
    },
    methods: {
      onSubmit (evt) {
        evt.preventDefault()
        this.formSubmitted = true
        this.formError = null
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              this.formLoading = true

              this.$store.dispatch('signUp', this.form)
                .then(() => {
                  window.location = '/'
                })
                .catch((reject) => {
                  if (reject.body.form) {
                    return this.$store.getters.formValidation(reject.body.form, this.errors)
                  }
                  this.formError = reject.error.description
                })
                .finally(() => {
                  this.formLoading = false
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
