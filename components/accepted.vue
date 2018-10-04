<template>
  <div>

    <!--content__form-->
    <b-form class="content__form m-form m-form--state m--padding-top-30"
            @submit="onSubmit"
            novalidate>

      <b-form-group class="m-form__group">

        <b-form-checkbox v-model="form.accepted"
                         id="accepted"
                         class="m-checkbox"
                         :value="true"
                         :unchecked-value="false"
                         @change="changeAccepted">

          I have read and agree to the {{ getAcceptedText() }}
          <span></span>
        </b-form-checkbox>

      </b-form-group>

      <button class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
              type="submit"
              v-bind:class="{'m-loader m-loader--light m-loader--center': isLoading}"
              :disabled="!form.changed">
        OK
      </button>

    </b-form>
    <!--/content__form-->

    <accepted-modal v-if="acceptedModal.open"
                    :show="acceptedModal.open"/>

  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import AcceptedModal from '../components/modals/accepted';

  export default {
    components: {AcceptedModal},
    computed: mapState(['acceptedModal', 'currentUser', 'payment']),
    props: ['type'],
    name: "accepted",
    data() {
      return {
        form: {
          accepted: false,
          changed: false
        },
        isLoading: false
      }
    },
    mounted() {
      this.setModel()
    },
    methods: {
      setModel() {

        switch (this.type) {
          case 'terms':
            this.form.accepted = this.currentUser.acceptTerms;
            break;
          case 'privacy':
            this.form.accepted = this.currentUser.acceptPrivacy;
            break;
          default:
        }
      },
      getAcceptedText() {
        let txt = null;

        switch (this.type) {
          case 'terms':
            txt = 'Terms and Conditions';
            break;
          case 'privacy':
            txt = 'Privacy Policy';
            break;
          default:
            txt = '';
        }

        return txt;
      },
      openAcceptedModal() {
        this.$store.dispatch('acceptedModal', {open: true})
      },
      changeAccepted() {
        this.form.changed = true
      },
      checkNotAccepted() {

        if (this.form.changed && !this.form.accepted) {
          this.openAcceptedModal();
        }
      },
      setRedirect() {

        if (this.form.accepted && !this.currentUser.acceptPrivacy) {
          this.$router.push('privacy');
        } else if (this.form.accepted && !this.currentUser.acceptTerms) {
          this.$router.push('terms');
        } else if (this.currentUser.acceptTerms && this.currentUser.acceptPrivacy && !this.payment) {
          this.$router.push('payment');
        }else if (this.currentUser.acceptTerms && this.currentUser.acceptPrivacy && this.payment) {
          this.$router.push('manage-crew-changes');
        }
      },
      onSubmit(e) {
        e.preventDefault();

        this.isLoading = true;

        let data = {},
          requestType = null;

        switch (this.type) {
          case 'terms':
            data = {
              acceptTerms: this.form.accepted
            };
            requestType = 'acceptedTerms';
            break;
          case 'privacy':
            data = {
              acceptPrivacy: this.form.accepted
            };
            requestType = 'acceptedPrivacy';
            break;
          default:
        }

        this.$store.dispatch(requestType, {data: data}).then(() => {
          this.isLoading = false;
          this.checkNotAccepted();
          this.setRedirect()
        }).catch((rej) => {this.isLoading = false;})
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/content';
</style>
