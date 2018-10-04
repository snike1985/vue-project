<template>
  <b-modal
    v-model="editAdminUserModal.open"
    id="editUser"
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
      Edit User
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
                    :class="{'has-danger': errors.has('username') && form.submitted}"
                    label="Email:"
                    label-for="email">
        <b-form-input id="email"
                      type="text"
                      v-model="form.fields.username"
                      v-validate="'required|email'"
                      required
                      data-vv-as="Email"
                      name="username"
                      minlength="2"
                      maxlength="140"
                      placeholder="Email"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('username')" class="form-control-feedback">
          {{errors.first('username')}}
        </div>
      </b-form-group>

      <b-form-group label="Role:"
                    class="m-form__group"
                    label-for="Role">
        <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100"
                    id="Role"
                    :text="roles.selected">
          <b-dropdown-item v-for="option in roles.options"
                           v-bind:key="option.val"
                           v-on:click="changeSelectVal(option.val)">
            {{option.label}}
          </b-dropdown-item>
        </b-dropdown>
      </b-form-group>

      <div v-if="form.error" class="text-center">
        <span class="m--font-danger m--font-boldest">{{form.error}}</span>
      </div>

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
    name: 'edit-user',
    props: ['user'],
    computed: mapState([
      'editAdminUserModal',
      'usersList'
    ]),
    data () {
      const user = cloneDeep(this.user)

      return {
        roles: {
          selected: 'Select',
          options: [
            {val: 'ROLE_ADMIN', label: 'Admin'},
            {val: 'ROLE_MANAGER', label: 'Manager'}
          ]
        },
        form: {
          fields: {
            name: user.name,
            username: user.username,
            roles: user.roles,
            // company: user.company.name
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
            this.$store.dispatch('editAdminUser', {form: this.form.fields, id: this.user.id})
              .then((res) => {
                const index = findIndex(this.usersList.items, {id: res.id})
                this.usersList.items[index] = res;
                this.$store.commit('SET_USERS_LIST', this.usersList)
                this.toggleModal()
              })
              .catch((rej) => {
                this.form.error = rej.error.description

                if (rej.error.code === 500) {
                  return this.form.error = 'Server Error'
                }

                this.$store.getters.formValidation(rej.body.form, this.errors)
              })
              .finally(() => this.form.loading = false)
          }
        })
      },
      changeSelectVal (val) {
        const index = findIndex(this.roles.options, {val})
        if (index < 0) return
        this.roles.selected = this.roles.options[index].label
        this.form.fields.roles = [this.roles.options[index].val]
      },
      isAdmin (roles) {
        return roles.some((item) => {
          if (item === 'ROLE_SUPER_ADMIN' || item === 'ROLE_ADMIN') return true
        })
      },
      toggleModal () {
        const data = {
          open: false
        }
        this.$store.commit('SET_EDIT_ADMIN_USER_MODAL', data)
      },

    },
    mounted: function () {
      if (this.isAdmin(this.user.roles)) {
        this.changeSelectVal('ROLE_ADMIN')
      } else {
        this.changeSelectVal('ROLE_MANAGER')
      }
    }
  }
</script>
