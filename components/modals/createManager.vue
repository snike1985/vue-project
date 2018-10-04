<template>
  <b-modal
    v-model="show"
    id="createManager"
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
      Add Crew Manager
    </h4>

    <b-form @submit="createManager" class="m-form m--margin-top-20" novalidate>
      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('name') && form.submitted}"
                    label="Name:"
                    label-for="name">
        <b-form-input id="name"
                      type="text"
                      v-model="form.fields.name"
                      v-validate="'required|min:2|max:140'"
                      required
                      data-vv-as="Name"
                      name="name"
                      minlength="2"
                      placeholder="John Doue"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('name')" class="form-control-feedback">
          {{errors.first('name')}}
        </div>
      </b-form-group>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('username') && form.submitted}"
                    label="Email:"
                    label-for="username">
        <b-form-input id="username"
                      type="text"
                      v-model="form.fields.username"
                      v-validate="'required|email'"
                      required
                      data-vv-as="Email"
                      name="username"
                      placeholder="example@example.com"
                      class="m-input">
        </b-form-input>

        <div v-show="form.submitted && errors.has('username')" class="form-control-feedback">
          {{errors.first('username')}}
        </div>
      </b-form-group>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('phone') && form.submitted}"
                    label="Phone"
                    label-for="managerPhone">

        <the-mask v-model="form.fields.phone"
                  id="managerPhone"
                  data-vv-as="Phone"
                  name="phone"
                  class="m-input form-control"
                  v-validate="'required'"
                  placeholder="+XX(XXX)XXX-XX-XX"
                  :mask="['+##(###)###-##-########']">
        </the-mask>

        <div v-if="errors.has('phone') && form.submitted"
             class="form-control-feedback">
          {{errors.first('phone') || 'Invalid Phone number'}}
        </div>
      </b-form-group>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('plainPassword') && form.submitted}"
                    label="Password:"
                    label-for="plainPassword">
        <b-form-input id="plainPassword"
                      type="password"
                      v-model="form.fields.plainPassword"
                      v-validate="'required|min:8|max:64'"
                      required
                      data-vv-as="Password"
                      name="plainPassword"
                      minlength="8"
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
        Add
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
            name: '',
            username: '',
            phone: '',
            plainPassword: ''
          },
          error: null,
          loading: false,
          submitted: false
        },
      }
    },
    methods: {
      close () {
        const data = {
          open: false
        }
        this.$store.dispatch('createManagerModal', data)
      },
      createManager (evt) {
        evt.preventDefault()
        this.$validator.validateAll().then((result) => {
          this.form.submitted = true
          this.form.error = null
          if (result) {
            const managerForm = this.form.fields
            managerForm.phone = this.form.fields.phone ? '+' + this.form.fields.phone : ''
            this.form.loading = true;

            this.$store.dispatch('createManager', this.form.fields)
              .then(() => {
                this.$store.dispatch('getManagers').then(() => {
                  this.close()
                })
              })
              .catch(rej => {
                this.form.error = rej.error.description

                if (rej.error.code === 500) {
                  return this.form.error = 'Server Error'
                }

                this.$store.getters.formValidation(rej.body.form, this.errors)
              })
              .finally(() => this.form.loading = false)
          }
        })

      }
    },
    name: 'create-manager'
  }
</script>

<style scoped>

</style>
