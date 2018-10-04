<template>
  <div>
    <!-- the modal -->
    <change-pass v-if="changePass.open"
                 :show="changePass.open"/>

    <b-form @submit="onSubmit"
            v-if="currentUser"
            class="m-form m-form--state m--margin-top-30"
            novalidate>
      <div class="row">

        <div class="col-md-8"
             :class="{
             'col-md-12': !roles.isAdmin(currentUser)}">

          <div class="m-portlet m--padding-40">
            <div class="m--font-transform-u m--font-boldest m--margin-bottom-10">
              Personal Info
            </div>
            <div class="row">
              <div class="col-md-6">

                <b-form-group class="m-form__group"
                              :class="{'has-danger': errors.has('name') && infoForm.submitted}"
                              label="Full Name"
                              label-class="form-control-label"
                              label-for="fullName">
                  <b-form-input id="fullName"
                                type="text"
                                v-model="infoForm.form.user.name"
                                v-validate="'required|min:2|max:140'"
                                required
                                data-vv-as="Full Name"
                                name="name"
                                class="m-input"
                                placeholder="Full Name">
                  </b-form-input>
                  <div v-show="errors.has('name') && infoForm.submitted"
                       class="form-control-feedback">
                    {{errors.first('name')}}
                  </div>
                </b-form-group>

                <b-form-group class="m-form__group"
                              :class="{'has-danger': errors.has('phone') && infoForm.submitted}"
                              label="Phone"
                              label-for="phone">

                  <the-mask v-model="infoForm.form.user.phone"
                            id="phone"
                            data-vv-as="Phone"
                            name="phone"
                            v-validate="'min:10'"
                            class="m-input form-control"
                            placeholder="+XX(XXX)XXX-XX-XX"
                            :mask="['+##(###)###-##-########']">
                  </the-mask>

                  <div v-if="errors.has('phone') && infoForm.submitted"
                       class="form-control-feedback">
                    {{errors.first('phone') || 'Invalid Phone number'}}
                  </div>
                </b-form-group>

                <b-form-group class="m-form__group"
                              :class="{'has-danger': errors.has('contactEmail') && infoForm.submitted}"
                              label="Email"
                              label-for="contactEmail">
                  <b-form-input id="contactEmail"
                                type="email"
                                v-validate="'email'"
                                v-model="infoForm.form.user.contactEmail"
                                required
                                data-vv-as="Email"
                                name="contactEmail"
                                class="m-input"
                                placeholder="Email Address">
                  </b-form-input>
                  <div v-show="infoForm.submitted && errors.has('contactEmail')"
                       class="form-control-feedback">
                    {{errors.first('contactEmail')}}
                  </div>
                </b-form-group>

              </div>
              <div class="col-md-6">
                <b-form-group label="Time Zone"
                              class="m-form__group"
                              label-for="groupName">
                  <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100 small-height"
                              id="groupName"
                              :text="(dateTimezoneList.selected || 'Select Timezone')">
                    <b-dropdown-item v-for="option in timezoneList"
                                     v-bind:key="option.id"
                                     v-on:click="changeTimezone(option)">
                      {{option.name}}
                    </b-dropdown-item>
                  </b-dropdown>
                </b-form-group>

                <button type="button"
                        @click="changePassModal"
                        class="m--margin-top-30 btn m-btn btn-block m--font-transform-u m--font-boldest2 m--font-light btn-dark">
                  Change Password
                </button>
              </div>
            </div>
          </div>

        </div>

        <div class="col-md-4"
             v-if="roles.isAdmin(currentUser)">

          <div class="m-portlet m--padding-40">
            <div class="m--font-transform-u m--font-boldest m--margin-bottom-10">
              Company Info
            </div>

            <b-form-group class="m-form__group"
                          :class="{'has-danger': errors.has('companyName') && infoForm.submitted}"
                          label="Company Name"
                          label-class="form-control-label"
                          label-for="companyName">
              <b-form-input id="companyName"
                            type="text"
                            v-model="infoForm.form.company.name"
                            v-validate="'required|min:2|max:140'"
                            required
                            data-vv-as="Company Name"
                            name="companyName"
                            class="m-input"
                            placeholder="Company Name">
              </b-form-input>
              <div v-show="errors.has('companyName') && infoForm.submitted"
                   class="form-control-feedback">
                {{errors.first('companyName')}}
              </div>
            </b-form-group>
            <b-form-group class="m-form__group"
                          :class="{'has-danger': errors.has('companyPhone') && infoForm.submitted}"
                          label="Phone"
                          label-for="companyPhone">

              <the-mask v-model="infoForm.form.company.phone"
                        id="companyPhone"
                        data-vv-as="Phone"
                        name="companyPhone"
                        class="m-input form-control"
                        v-validate="'required'"
                        placeholder="+XX(XXX)XXX-XX-XX"
                        :mask="['+##(###)###-##-########']">
              </the-mask>
              <div v-if="errors.has('companyPhone') && infoForm.submitted"
                   class="form-control-feedback">
                {{errors.first('companyPhone') || 'Invalid Phone number'}}
              </div>
            </b-form-group>

            <b-form-group class="m-form__group"
                          :class="{'has-danger': errors.has('companyEmail') && infoForm.submitted}"
                          label="Email"
                          label-for="companyEmail">
              <b-form-input id="companyEmail"
                            type="email"
                            v-validate="'email'"
                            v-model="infoForm.form.company.email"
                            required
                            data-vv-as="Email"
                            name="companyEmail"
                            class="m-input"
                            placeholder="Email Address">
              </b-form-input>
              <div v-show="infoForm.submitted && errors.has('companyEmail')"
                   class="form-control-feedback">
                {{errors.first('companyEmail')}}
              </div>
            </b-form-group>

          </div>

        </div>

      </div>

      <div class="notification-settings dark-title-table m--margin-bottom-30">
        <div class="row align-items-center">
          <div class="col">
            <div class="w-100 m-brand m-brand--skin-dark m--font-light m--font-transform-u m--font-boldest">
              <span class="title m--padding-left-10">
                notification preference
              </span>
            </div>
          </div>
        </div>
        <div class="m-portlet m--margin-bottom">
          <b-table bordered
                   :fields="tableFields"
                   :items="notificationsItems"
                   class="notification-settings-table table center-lines table-with-shadow crew-table member-group m-table m-table--head-bg-light">

            <template slot="name" slot-scope="data">
              <div class="m--font-boldest">
                <span v-if="superAdmin">
                  {{notificationAdminNames[data.item.name]}}
                </span>
                <span v-else>
                  {{notificationNames[data.item.name]}}
                </span>
              </div>
            </template>

            <template slot="sms" slot-scope="data">
              <b-form-checkbox v-if="data.item.name === 'chat'"
                               class="m-checkbox disabled"
                               value="false"
                               disabled>
                <span></span>
              </b-form-checkbox>
              <b-form-checkbox v-model="data.item.sms"
                               v-else
                               class="m-checkbox"
                               value="true"
                               unchecked-value="false">
                <span></span>
              </b-form-checkbox>
            </template>

            <template slot="email" slot-scope="data">
              <b-form-checkbox v-model="data.item.email"
                               class="m-checkbox"
                               value="true"
                               unchecked-value="false">
                <span></span>
              </b-form-checkbox>
            </template>

            <template slot="website" slot-scope="data">
              <b-form-checkbox v-model="data.item.website"
                               class="m-checkbox"
                               value="true"
                               :disabled="!superAdmin"
                               unchecked-value="false">
                <span></span>
              </b-form-checkbox>
            </template>
          </b-table>
        </div>

      </div>

      <div class="row justify-content-end align-items-center">
        <div class="col-auto">
          <span v-if="formSaved" class="m--font-info m--font-transform-u m--font-boldest2">
            Saved
          </span>
        </div>
        <div class="col-auto">
          <button type="submit"
                  class="m--margin-left-15 btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info">
            <span>
              save changes
            </span>
          </button>
        </div>
      </div>
    </b-form>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import map from 'lodash/map'
  import ChangePass from '../modals/changePass'
  import axios from 'axios'
  import findIndex from 'lodash/findIndex'
  import cloneDeep from 'lodash/cloneDeep'
  import checkRoles from '../../services/checkRoles'

  export default {
    components: {
      ChangePass
    },
    computed: mapState([
      'timezoneList',
      'currentUser',
      'changePass',
      'notificationPref',
      'superAdmin'
    ]),
    data() {
      return {
        roles: checkRoles,
        formSaved: false,
        notificationAdminNames: {
          billing: 'Payment'
        },
        notificationNames: {
          chat: 'Group chat',
          member: 'Member Status Changed',
          memberAlert: 'Alert Manager to chat',
          crewChangeGroup: 'Group Status Changed',
          crewChange: 'Crew Change Status Change',
          billing: 'Payment',
          weatherAlert: 'Weather and Security Alerts'
        },
        notificationsItems: [],
        tableFields: {
          name: {
            label: 'Event groups'
          },
          sms: {
            label: 'sms'
          },
          email: {
            label: 'email'
          },
          website: {
            label: 'website'
          }
        },
        companyErrors: {},
        infoForm: {
          alert: {
            show: false,
            message: null
          },
          form: {
            user: {
              name: '',
              phone: '',
              contactEmail: '',
              timeZone: ''
            },
            company: {
              name: '',
              email: '',
              phone: ''
            }
          },
          submitted: false
        },
        dateTimezoneList: {
          selected: '',
          options: this.timezoneList
        }
      }
    },
    methods: {
      changeTimezone(option) {
        this.dateTimezoneList.selected = option.name
        this.infoForm.form.user.timeZone = option.id
      },
      onSubmit(ev) {
        ev.preventDefault()

        this.$validator.validateAll().then((result) => {
          this.infoForm.submitted = true;
          if (result) {
            const submitUser = () => {
              const userForm = this.infoForm.form.user
              userForm.phone = this.infoForm.form.user.phone ? '+' + this.infoForm.form.user.phone : ''

              return this.$store.dispatch('setUserInfo', userForm)
                .catch((rej) => {
                  this.$store.getters.formValidation(rej.data.body.form, this.errors)
                  throw rej
                })
            }

            const submitCompany = () => {
              const companyForm = this.infoForm.form.company
              companyForm.phone = '+' + this.infoForm.form.company.phone

              return this.$store.dispatch('setCompanyInfo', companyForm)
                .catch((rej) => {
                  this.$store.getters.formValidation(rej.data.body.form, this.errors, 'company')
                  throw rej
                })
            }

            const submitNotifications = () => {
              this.notificationsItems.forEach((item) => {
                this.notificationPref[item.name] = item
              })

              return this.$store.dispatch('setNotificationsInfo', this.notificationPref)
            }

            let requests = [
              submitUser(),
              submitNotifications()
            ]

            if(!this.superAdmin) {
              requests.push(submitCompany())
            }

            axios.all(requests).then(() => {

              this.formSaved = true
              setTimeout(() => {
                this.formSaved = false
              }, 2000)
            })
          }
        })

      },
      changePassModal(ev) {
        ev.preventDefault()

        const data = {
          open: true
        }
        this.$store.dispatch('changePassModal', data)
      }
    },
    mounted: function () {
      const user = cloneDeep(this.currentUser)
      const timeZoneIndex = user.timeZone && user.timeZone.id ? findIndex(this.timezoneList, {id: user.timeZone.id}) : false

      this.infoForm.form.company = user.company
      this.infoForm.form.user.name = user.name
      this.infoForm.form.user.phone = user.phone
      this.infoForm.form.user.contactEmail = user.contactEmail
      this.infoForm.form.user.timeZone = user.timeZone && user.timeZone.id ? user.timeZone.id : null
      this.dateTimezoneList.selected = user.timeZone && user.timeZone.id ? this.timezoneList[timeZoneIndex].name : ''


      if(this.superAdmin) {
        map(this.notificationPref, (val, index) => {
          if(index === 'billing') {
            val.name = index
            this.notificationsItems.push(val)
          }
        })
      } else {
        map(this.notificationPref, (val, index) => {
          val.name = index
          this.notificationsItems.push(val)
        })
      }

    },
    head() {
      return {
        title: 'Information - Settings'
      }
    },
    name: 'info'
  }
</script>

<style lang="sass">
  @import '../../assets/scss/settings/info'
</style>
