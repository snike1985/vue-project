<template>

  <div class="container">
    <div class="row no-gutters justify-content-center">
      <div class="col-md-4" v-if="!forgotPass">
        <div class="text-center">
          <h2 class="m--font-blue">
            Sign In
          </h2>
          <p class="m--font-grey">
            <span>
              Welcome! Please log in using your email and password.
            </span>
          </p>
        </div>

        <div class="form-error" v-if="serverError">
          <span class="icon">
            <img src="~/assets/images/signIn-error.svg" alt="">
          </span>
          <div class="text ">
            <p class="m--font-danger m--font-boldest">
              User not found
            </p>
            <p class="m--font-bold">
              {{serverError}}
            </p>
          </div>
        </div>

        <b-form @submit="onSubmit" class="m-form m--padding-top-20" novalidate>

          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('Email') && formSubmitted}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="email"
                            type="email"
                            v-validate="'required|email'"
                            v-model="form.username"
                            required
                            name="Email"
                            class="m-input"
                            placeholder="Email Address">
              </b-form-input>
              <span class="m-input-icon__icon m-input-icon__icon--left">
                <span>
                  <i class="flaticon-paper-plane"></i>
                </span>
              </span>
            </div>
            <div v-show="formSubmitted && errors.has('Email')" class="form-control-feedback">
              {{errors.first('Email')}}
            </div>
          </b-form-group>

          <b-form-group class="m-form__group" :class="{'has-danger': errors.has('Password') && formSubmitted}">
            <div class="m-input-icon m-input-icon--left">
              <b-form-input id="password"
                            type="password"
                            v-model="form.plainPassword"
                            v-validate="'required|min:8|max:64'"
                            required
                            name="Password"
                            class="m-input"
                            placeholder="Password">
              </b-form-input>
              <span class="m-input-icon__icon m-input-icon__icon--left">
                <span>
                  <i class="flaticon-lock-1"></i>
                </span>
              </span>
            </div>
            <div v-show="formSubmitted && errors.has('Password')" class="form-control-feedback">
              {{errors.first('Password')}}
            </div>
          </b-form-group>

          <b-button type="submit"
                    v-bind:class="{'m-loader m-loader--light m-loader--right': formLoading}"
                    class="m--font-transform-u m--font-boldest2 btn-info btn-block"
                    variant="primary">
            Login
          </b-button>
        </b-form>

        <p class="text-center m--padding-top-40">
          <span class="forgot-pass m-link m-link--state m-link--grey"
                v-on:click="forgotPass = true">Forgot Password?</span>
        </p>
      </div>

      <div class="col-md-4" v-else>
        <forgot-pass @backToSignIn="backToSignIn"></forgot-pass>
      </div>
    </div>
  </div>
</template>

<script>
  import ForgotPass from './forgot'

  export default {
    name: 'sing-in',
    components: {
      ForgotPass
    },
    data () {
      return {
        serverError: '',
        formSubmitted: false,
        forgotPass: false,
        formLoading: false,
        form: {
          username: '',
          plainPassword: ''
        }
      }
    },
    methods: {
      backToSignIn () {
        this.forgotPass = false
      },
      onSubmit (evt) {
        evt.preventDefault()

        this.formSubmitted = true

        this.$validator.validateAll()
          .then((result) => {

            if (result) {
              this.formLoading = true

              this.$store.dispatch('signIn', this.form)
                .catch((reject) => {
                  this.serverError = reject.error.message
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

