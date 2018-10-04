<template>
  <b-modal
    v-model="editAdminMemberModal.open"
    id="editCompany"
    size="sm"
    :class="'medium-dialog'"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <span class="m--font-grey close-modal-btn" @click="toggleModal">
      <i class="la la-close"></i>
    </span>

    <h4 class="m--font-blue m-form m--margin-top-10 text-center">
      Edit Crew Member
    </h4>

    <b-form @submit="editUser" class="m-form m--margin-top-20" novalidate>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('name') && form.submitted}"
                    label="Name:"
                    label-for="name">
        <b-form-input id="name"
                      type="text"
                      v-model="form.fields.name"
                      v-validate="'required|min:2|max:140'"
                      data-vv-as="Name"
                      name="name"
                      minlength="2"
                      maxlength="140"
                      placeholder="John Doue"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('name')" class="form-control-feedback">
          {{errors.first('name')}}
        </div>
      </b-form-group>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('phone') && form.submitted}"
                    label="Phone"
                    label-for="phone">

        <the-mask v-model="form.fields.phone"
                  id="phone"
                  type="tel"
                  data-vv-as="Phone"
                  name="phone"
                  class="m-input form-control"
                  v-validate="'required'"
                  placeholder="+XX(XXX)XXX-XX-XX"
                  :mask="'+##(###)###-##-########'">
        </the-mask>

        <div v-if="errors.has('phone') && form.submitted"
             class="form-control-feedback">
          {{errors.first('phone') || 'Invalid Phone number'}}
        </div>
      </b-form-group>

      <div class="row ">
        <div class="col-md-6">
          <button
            class=" m--margin-top-15 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
            v-bind:class="{'m-loader m-loader--light m-loader--right': form.loading}"
            type="submit">
            save
          </button>
        </div>
        <div class="col-md-6">
          <button
            @click="toggleModal"
            class=" m--margin-top-15 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-dark"
            type="button">
            cancel
          </button>
        </div>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  import { mapState } from 'vuex'
  import findIndex from 'lodash/findIndex'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    name: 'edit-company',
    props: ['user'],
    computed: mapState([
      'editAdminMemberModal',
      'membersList'
    ]),
    data () {
      const user = cloneDeep(this.user)

      return {
        form: {
          fields: {
            name: user.name,
            phone: user.phone
          },
          loading: false,
          error: null,
          submitted: false
        }
      }
    },
    methods: {
      editUser (evt) {
        evt.preventDefault()

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true
          this.form.error = false

          if (result) {
            this.form.loading = true
            const form = cloneDeep(this.form.fields);
            form.phone = '+' + form.phone
            this.$store.dispatch('createNewMember',
              {
                form: form,
                crewId: this.user.crew.id,
                memberId: this.user.id
              })
              .then((res) => {
                const index = findIndex(this.membersList.items, {id: res.id})
                this.membersList.items[index] = {
                  ...this.membersList.items[index],
                  ...res
                };
                this.$store.commit('SET_MEMBERS_LIST', this.membersList)
                this.toggleModal()
              })
              .catch((rej) => {

                if (rej.error.code === 500) {
                  return this.form.error = 'Server Error'
                }

                this.$store.getters.formValidation(rej.body.form, this.errors)
              })
              .finally(() => this.form.loading = false)
          }
        })
      },
      toggleModal () {
        const data = {
          open: false
        }
        this.$store.commit('SET_EDIT_ADMIN_MEMBER_MODAL', data)
      },

    }
  }
</script>
