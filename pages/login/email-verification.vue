<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
    <div class="container">
      <div class="m-portlet m--margin-top-30 m--padding-50">
        <div class="row no-gutters align-items-center justify-content-center">
          <div class="col-md-4">

            <div class="text-center" v-if="emailSent">
              <img src="/images/email-verification.svg" alt="">
              <h3 class="m--margin-top-50 m--font-blue m--font-boldest2">
                Check your email - {{ currentUser.username }}
              </h3>
            </div>

            <div class="text-center" v-if="!emailSent">
              <img src="/images/email-verification.svg" alt="">

              <div class="form-error m--margin-top-50" v-if="formError">
                  <span class="m--margin-right-15 btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill">
                    <i class="la la-close"></i>
                  </span>
                <div class="text ">
                  <div class="m--font-bold">
                    {{formError}}
                  </div>
                </div>
              </div>

              <h3 class="m--margin-top-50 m--font-blue m--font-boldest2">Verify your email</h3>
              <p class="m--font-grey m--margin-top-15">
                  <span>
                    Please check your inbox and follow the link we have sent you
                  </span>
              </p>

              <b-button
                @click="resendCode"
                type="button"
                class="m--margin-top-25 m--font-transform-u m--font-boldest2 btn-info btn-block"
                variant="primary">
                resend verification email
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
		name: "email-verification",
    computed: mapState([
      'currentUser'
    ]),
    data() {
		  return {
        formError: null,
		    showError: false,
        emailSent: false
      }
    },
    methods: {
      resendCode() {
        this.$store.dispatch('resendVerifyEmail', this.currentUser.username)
          .then((res) => {
            this.emailSent = true;
          })
          .catch((reject) => {
            this.showError = true;
            this.formError = reject.error.message;
          })
      }
    },
    head() {
		  return {
		    title: 'Verify email'
      }
    },
	}
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/auth/auth'
</style>
