<template>
  <div class="auth-wrapper">
    <header class="auth-header">
      <div class="m-stack m-stack--ver m-stack--general">
        <div class="m-stack__item m-stack__item--middle" style="width: 150px;">
          <nuxt-link :to="'/'"><img width="150px" src="/images/logo.svg" alt="logo"></nuxt-link>
        </div>
        <div v-if="!showRestorePass && !showEmailVerify"
             class="m-stack__item m-stack__item--right m-stack__item--middle">
          <div class="row no-gutters justify-content-end align-items-center">
            <div class="text m--font-bold" v-if="isSignUp()">
              Already have an Account?
            </div>
            <div class="text m--font-bold" v-if="isSignIn()">
              Don't have an Account?
            </div>
            <button
              class="btn font-12 m-btn m-btn--custom btn-outline-info m--font-transform-u"
              v-on:click="changeAuthType('signin')"
              v-if="isSignUp()"
              type="button">
              Sign In
            </button>

            <button
              class="btn font-12 m-btn m-btn--custom btn-outline-info m--font-transform-u"
              v-on:click="changeAuthType('signup')"
              v-if="isSignIn()"
              type="button">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="auth-content" v-if="!showEmailVerify">
      <transition name="component-fade" mode="out-in">
        <sign-up v-if="isSignUp()"/>
        <sign-in v-if="isSignIn()"/>
        <restore-pass v-if="showRestorePass"/>
      </transition>
    </div>
    <div class="auth-content" v-if="showEmailVerify">
      <div class="container">
        <div class="row no-gutters justify-content-center">
          <div class="col-md-4">
            <div class="text-center">
              <div v-if="currentUser && currentUser.emailVerified">
                <img src="/images/email-verification.svg" alt="">
                <h2 class="m--font-blue m--padding-top-20">
                  You have successfully verified your email address!
                </h2>

                <div class="row justify-content-center m--padding-top-20">
                  <div class="col-md-8">
                    <nuxt-link class="btn m--font-transform-u m--font-boldest2 btn-info btn-block"
                               :to="'/manage-crew-changes'">
                      Home
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import SignUp from '../../components/auth/signUp'
  import SignIn from '../../components/auth/signIn'
  import RestorePass from '../../components/auth/restorePass'
  import { mapState } from 'vuex'
  import VueCookie from 'vue-cookie'
  import firebase from '~/services/firebase-init'

  export default {
    name: 'login',
    layout: 'auth-layout',
    head () {
      return {
        title: 'Authorization'
      }
    },
    fetch ({store, route, redirect}) {
      const restorePass = route.query['restore-password']

      if (restorePass) {
        return store.dispatch('restorePassVerification', restorePass)
          .catch(() => {
            redirect('/login')
          })
      }

    },
    computed: mapState([
      'currentUser',
      'authToken'
    ]),

    data () {
      return {
        showEmailVerify: this.$route.query['registration'],
        showRestorePass: this.$route.query['restore-password'],
        authType: 'signup'
      }
    },
    mounted: function() {
      const verificationEmail = this.$route.query['registration'];

      if (verificationEmail) {

        this.$store.commit('SET_AUTH_TOKEN', null)
        firebase.auth().signOut()

        return this.$store.dispatch('verifyEmail', verificationEmail)
          .then((res) => {
            this.$store.dispatch('setupUser', res)
          })
          .catch(() => {
            redirect('/login')
          })
      }
    },
    methods: {
      changeAuthType (type) {
        this.authType = type
      },
      isSignUp () {
        return (this.authType === 'signup' && !this.showRestorePass)
      },
      isSignIn () {
        return this.authType === 'signin'
      },
      isForgotPass () {
        return this.authType === 'forgot'
      }
    },
    components: {
      RestorePass,
      SignIn,
      SignUp
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/auth/auth'
</style>
