<template>
  <b-modal
    v-model="show"
    id="changePass"
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
      Change Password
    </h4>

    <b-form @submit="changePass" class="m-form m--margin-top-20" novalidate>
      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('oldPassword') && form.submitted}"
                    label="Current Password:"
                    label-for="oldPassword">
        <b-form-input id="oldPassword"
                      type="password"
                      v-model="form.oldPassword"
                      v-validate="'required'"
                      required
                      data-vv-as="Current Password"
                      name="oldPassword"
                      minlength="8"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('oldPassword')" class="form-control-feedback">
          {{errors.first('oldPassword')}}
        </div>
      </b-form-group>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('plainPassword') && form.submitted}"
                    label="New Password:"
                    label-for="plainPassword">
        <b-form-input id="password"
                      type="password"
                      v-model="form.plainPassword"
                      v-validate="'required|min:8|max:64|confirmed:confirmPassword'"
                      required
                      data-vv-as="New Password"
                      name="plainPassword"
                      minlength="8"
                      class="m-input">
        </b-form-input>

        <div v-show="form.submitted && errors.has('plainPassword')" class="form-control-feedback">
          {{errors.first('plainPassword')}}
        </div>
      </b-form-group>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('plainPassword') && form.submitted}"
                    label="Confirm password:"
                    label-for="confirmPassword">
        <b-form-input id="confirmPassword"
                      type="password"
                      v-model="form.confirmPassword"
                      v-validate="'required'"
                      required
                      data-vv-as="Confirm password"
                      name="confirmPassword"
                      minlength="8"
                      maxlength="64"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('plainPassword')" class="form-control-feedback">
          {{errors.first('plainPassword')}}
        </div>
      </b-form-group>

      <button
        class=" m--margin-top-20 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
        v-bind:class="{'m-loader m-loader--light m-loader--right': form.loading}"
        type="submit">
        Save
      </button>
    </b-form>
  </b-modal>
</template>

<script>

  export default {
    props: [
      'show'
    ],
    data () {
      return {
        form: {
          fields: {
            oldPassword: '',
            plainPassword: '',
            confirmPassword: ''
          },
          loading: false,
          error: null,
          submitted: false
        },
      }
    },
    methods: {
      close () {
        const data = {
          open: false
        }
        this.$store.dispatch('changePassModal', data)
      },
      changePass (evt) {
        evt.preventDefault()
        this.form.error = null

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true

          if (result) {

            this.form.loading = true;
            this.$store.dispatch('changePass', this.form)
              .then(() => {
                this.close()
              })
              .catch(rej => {
                this.$store.getters.formValidation(rej.data.body.form, this.errors)
              })
              .finally(() => this.form.loading = false)
          }

        })

      }
    },
    name: 'change-pass'
  }
</script>

<style scoped>

</style>
