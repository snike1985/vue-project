<template>
  <div>
    <div class="text-center" v-if="!showSuccess">
      <h2 class="m--font-blue">
        Forgot Password
      </h2>
      <p class="m--font-grey">
      <span>
        Please enter your email address and you will soon receive an email with further instructions.
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
          User with such email is not found.
        </p>
      </div>
    </div>

    <div v-if="showSuccess">
      <h2 class="m--font-blue text-center">
        Instructions for password recovery sent to your email.
      </h2>
    </div>

    <div v-if="!showSuccess">
      <b-form @submit="onSubmit" class="m-form m--padding-top-20" novalidate>

        <b-form-group class="m-form__group" :class="{'has-danger': errors.has('Email')}">
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

        <b-button type="submit" class="btn-info btn-block m-btn--uppercase m--font-boldest2" variant="primary">Reset password</b-button>
      </b-form>
      <p class="text-center m--padding-top-40">
          <span class="forgot-pass m-link m-link--state m-link--grey"
                v-on:click="back()">Back to Sign In</span>
      </p>
    </div>

  </div>
</template>

<script>
	export default {
		name: "forgot-pass",
    data(){
		  return {
        showSuccess: false,
        serverError: null,
        formSubmitted: false,
		    form: {
		      username: ''
        }
      }
    },
    methods: {
      back () {
        this.$emit('backToSignIn')
      },
      onSubmit(evt){
        evt.preventDefault();
        this.formSubmitted = true;
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.dispatch('forgotPass', this.form).then(()=> {
              this.showSuccess = true;
            }).catch((reject) => {
              this.serverError = reject.error.message
            })
          }
        });
      }
    }
	}
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/auth/auth.scss'
</style>

