<template>
  <b-modal
    v-model="createMember"
    id="createMember"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    class="no-padding">
    <span class="m--font-grey close-modal-btn" @click="toggleModal">
      <i class="la la-close"></i>
    </span>
    <h4 class="m--font-blue m--font-boldest m-form m--margin-top-10 text-center">
      <span v-if="!editUser">
        Add Crew Member
      </span>
      <span v-else>
        Edit Crew Member
      </span>
    </h4>

    <b-tabs v-model="tabIndex" nav-class="nav nav-tabs m-tabs-line m-tabs-line--info" class="without-border">

      <b-tab :title-link-class="{'complete not-active': tabIndex === 1 && !editUser}"
             title="<span class='m-badge m--margin-right-5'>1</span> Personal Info">

        <b-form @submit="submitPersonalInfo"
                v-if="tabIndex === 0"
                class="m--margin-top-40 m-form m-form--state absolute-error"
                novalidate>
          <div class="row">
            <div class="col-md-4">
              <b-form-group label="Group Name"
                            class="m-form__group"
                            v-if="filterGroups().length"
                            label-for="groupName">
                <b-dropdown class="bootstrap-select small-height m-bootstrap-select m_ w-100"
                            id="groupName"
                            :text="(personalInfo.groups.selected || 'Select')">
                  <b-dropdown-item v-for="option in personalInfo.groups.options"
                                   v-bind:key="option.id"
                                   v-on:click="changeGroup(option)">
                    <span class="text">
                      {{option.name}}
                    </span>
                    <span v-if="option.direction !== 'unspecified'"
                          class="m--margin-left-10 m--font-transform-u no-cursor btn btn-sm font-11 m--font-boldest2 w-45"
                          :class="{
                          'btn-primary': option.direction === 'on',
                          'btn-metal': option.direction === 'off'
                        }">
                      {{option.direction}}
                    </span>
                  </b-dropdown-item>
                </b-dropdown>
              </b-form-group>

              <b-form-group class="m-form__group"
                            :class="{'has-danger': errors.has('name') && personalInfo.submitted}"
                            label="Full Name"
                            label-class="form-control-label"
                            label-for="fullName">
                <b-form-input id="fullName"
                              type="text"
                              v-model="personalInfo.form.name"
                              v-validate="'required|min:2|max:140'"
                              required
                              data-vv-as="Full Name"
                              name="name"
                              class="m-input"
                              placeholder="John Doue">
                </b-form-input>
                <div v-show="errors.has('name') && personalInfo.submitted"
                     class="form-control-feedback">
                  {{errors.first('name')}}
                </div>
              </b-form-group>


              <b-form-group class="m-form__group"
                            :class="{'has-danger': errors.has('position') && personalInfo.submitted}"
                            label="Position"
                            label-for="position">
                <b-form-input id="position"
                              type="text"
                              v-model="personalInfo.form.position"
                              v-validate="'min:2|max:140'"
                              data-vv-as="Position"
                              name="position"
                              class="m-input"
                              placeholder="Position">
                </b-form-input>
                <div v-show="errors.has('position') && personalInfo.submitted"
                     class="form-control-feedback">
                  {{errors.first('position')}}
                </div>
              </b-form-group>


              <b-form-group class="m-form__group"
                            :class="{'has-danger': errors.has('phone') && personalInfo.submitted}"
                            label="Phone"
                            label-for="phone">

                <the-mask v-model="personalInfo.form.phone"
                          id="phone"
                          type="tel"
                          data-vv-as="Phone"
                          name="phone"
                          class="m-input form-control"
                          v-validate="'required'"
                          placeholder="+XX(XXX)XXX-XX-XX"
                          :mask="'+##(###)###-##-########'">
                </the-mask>

                <div v-if="errors.has('phone') && personalInfo.submitted"
                     class="form-control-feedback">
                  {{errors.first('phone') || 'Invalid Phone number'}}
                </div>
              </b-form-group>


              <b-form-group label="Nationality"
                            class="m-form__group"
                            label-for="Nationality">
                <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100"
                            id="Nationality"
                            :text="(personalInfo.nationalityList.selected || 'Select')">
                  <b-dropdown-item v-for="option in personalInfo.nationalityList.options"
                                   v-bind:key="option.id"
                                   v-on:click="changeNationality(option)">
                    {{option.name}}
                  </b-dropdown-item>
                </b-dropdown>
              </b-form-group>

            </div>

            <div class="col-md-4">
              <label>Date of Birth</label>
              <div class="birthday-container row no-gutters justify-content-center m--margin-bottom-15">
                <div class="col-auto m--margin-right-15">
                  <b-form-group :class="{'has-danger': errors.has('birthday') && personalInfo.submitted}"
                                class="m-form__group birthday-day"
                                label-for="birthday">
                    <b-dropdown class=" bootstrap-select m-bootstrap-select m_ w-100 small-height"
                                id="groupName"
                                :text="'' + (birthday.value.day || 'Day')">
                      <b-dropdown-item v-for="(option, index) in birthday.days"
                                       v-bind:key="index"
                                       v-on:click="changeBirthday(option.value, 'day')">
                        {{option.label}}
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-form-group>
                </div>

                <div class="col m--margin-right-15">
                  <b-form-group class="m-form__group birthday-month"
                                :class="{'has-danger': errors.has('birthday') && personalInfo.submitted}"
                                label-for="birthday">
                    <b-dropdown class=" bootstrap-select m-bootstrap-select m_ w-100 small-height"
                                id="groupName"
                                :text="'' + (birthday.value.month || 'Month')">
                      <b-dropdown-item v-for="(option, index) in birthday.months"
                                       v-bind:key="index"
                                       v-on:click="changeBirthday(option, 'month')">
                        {{option}}
                      </b-dropdown-item>
                    </b-dropdown>

                  </b-form-group>
                </div>

                <div class="col-auto">
                  <b-form-group class="m-form__group birthday-year"
                                :class="{'has-danger': errors.has('birthday') && personalInfo.submitted}"
                                label-for="birthday">
                    <b-dropdown class=" bootstrap-select m-bootstrap-select m_ w-100 small-height"
                                id="groupName"
                                :text="'' + (birthday.value.year || 'Year')">
                      <b-dropdown-item v-for="(option, index) in birthday.years"
                                       v-bind:key="index"
                                       v-on:click="changeBirthday(option.value, 'year')">
                        {{option.value}}
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-form-group>
                </div>
              </div>

              <b-form-group class="m-form__group"
                            :class="{'has-danger': errors.has('nearestAirport') && personalInfo.submitted}"
                            label="Nearest Airport to Home"
                            label-for="nearestAirport">
                <b-form-input id="nearestAirport"
                              type="text"
                              v-model="personalInfo.form.nearestAirport"
                              v-validate="'min:2|max:140'"
                              data-vv-as="Nearest Airport to Home"
                              name="nearestAirport"
                              class="m-input"
                              placeholder="Airport Name">
                </b-form-input>
                <div v-show="errors.has('nearestAirport') && personalInfo.submitted"
                     class="form-control-feedback">
                  {{errors.first('nearestAirport')}}
                </div>
              </b-form-group>

              <b-form-group class="m-form__group"
                            :class="{'has-danger': errors.has('agents') && personalInfo.submitted}"
                            label="Agents"
                            label-for="agents">
                <b-form-input id="agents"
                              type="text"
                              v-model="personalInfo.form.agents"
                              v-validate="'min:2|max:140'"
                              data-vv-as="Agents"
                              name="agents"
                              class="m-input"
                              placeholder="Company name">
                </b-form-input>
                <div v-show="errors.has('agents') && personalInfo.submitted"
                     class="form-control-feedback">
                  {{errors.first('agents')}}
                </div>
              </b-form-group>

              <div class="row">
                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                :class="{'has-danger': errors.has('passportNumber') && personalInfo.submitted}"
                                label="Passport Number"
                                label-for="passportNumber">
                    <b-form-input id="passportNumber"
                                  type="text"
                                  v-model="personalInfo.form.passportNumber"
                                  v-validate="'min:2|max:140'"
                                  data-vv-as="Passport Number"
                                  name="passportNumber"
                                  class="m-input"
                                  placeholder="BN123456">
                    </b-form-input>
                    <div v-show="errors.has('passportNumber') && personalInfo.submitted"
                         class="form-control-feedback">
                      {{errors.first('passportNumber')}}
                    </div>
                  </b-form-group>
                </div>

                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                label="Expiry Date"
                                label-for="passportNumberExpiryDate">
                    <input type='text'
                           class="form-control"
                           id="passportNumberExpiryDate"
                           readonly
                           placeholder="dd.mm.yyyy"/>
                  </b-form-group>
                </div>
              </div>

              <div class="row m--margin-top-15">
                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                :class="{'has-danger': errors.has('visa') && personalInfo.submitted}"
                                label="Visa"
                                label-for="visa">
                    <b-form-input id="visa"
                                  type="text"
                                  v-model="personalInfo.form.visa"
                                  v-validate="'min:2|max:140'"
                                  data-vv-as="Visa"
                                  name="visa"
                                  class="m-input"
                                  placeholder="BN123456">
                    </b-form-input>
                    <div v-show="errors.has('visa') && personalInfo.submitted"
                         class="form-control-feedback">
                      {{errors.first('visa')}}
                    </div>
                  </b-form-group>
                </div>

                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                label="Valid to"
                                label-for="visaValidTo">
                    <input type='text' class="form-control" id="visaValidTo" readonly placeholder="dd.mm.yyyy"/>
                  </b-form-group>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="row">
                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                :class="{'has-danger': errors.has('seamanBook') && personalInfo.submitted}"
                                label="Seaman's Book"
                                label-for="seamanBook">
                    <b-form-input id="seamanBook"
                                  type="text"
                                  v-model="personalInfo.form.seamanBook"
                                  v-validate="'min:2|max:140'"
                                  data-vv-as="Seaman's Book"
                                  name="seamanBook"
                                  class="m-input"
                                  placeholder="BN123456">
                    </b-form-input>
                    <div v-show="errors.has('seamanBook') && personalInfo.submitted"
                         class="form-control-feedback">
                      {{errors.first('seamanBook')}}
                    </div>
                  </b-form-group>
                </div>

                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                label="Expiry Date"
                                label-for="seamanBookExpiryDate">
                    <input type='text'
                           class="form-control"
                           id="seamanBookExpiryDate"
                           readonly
                           placeholder="dd.mm.yyyy"/>
                  </b-form-group>
                </div>
              </div>

              <div class="row m--margin-top-15">
                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                :class="{'has-danger': errors.has('flagStateCDC') && personalInfo.submitted}"
                                label="Flag State CDC"
                                label-for="flagStateCDC">
                    <b-form-input id="flagStateCDC"
                                  type="text"
                                  v-model="personalInfo.form.flagStateCDC"
                                  v-validate="'min:2|max:140'"
                                  data-vv-as="Flag State CDC"
                                  name="flagStateCDC"
                                  class="m-input"
                                  placeholder="BN123456">
                    </b-form-input>
                    <div v-show="errors.has('flagStateCDC') && personalInfo.submitted"
                         class="form-control-feedback">
                      {{errors.first('flagStateCDC')}}
                    </div>
                  </b-form-group>
                </div>

                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                label="Expiry Date"
                                label-for="flagStateCDCExpiryDate">
                    <input type='text'
                           class="form-control"
                           id="flagStateCDCExpiryDate"
                           readonly
                           placeholder="dd.mm.yyyy"/>
                  </b-form-group>
                </div>
              </div>

              <div class="row m--margin-top-15">
                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                :class="{'has-danger': errors.has('flagStateCOE') && personalInfo.submitted}"
                                label="Flag State CoE"
                                label-for="flagStateCOE">
                    <b-form-input id="flagStateCOE"
                                  type="text"
                                  v-model="personalInfo.form.flagStateCOE"
                                  v-validate="'min:2|max:140'"
                                  data-vv-as="Flag State CoE"
                                  name="flagStateCOE"
                                  class="m-input"
                                  placeholder="BN123456">
                    </b-form-input>
                    <div v-show="errors.has('flagStateCOE') && personalInfo.submitted"
                         class="form-control-feedback">
                      {{errors.first('flagStateCOE')}}
                    </div>
                  </b-form-group>
                </div>

                <div class="col-md-6">
                  <b-form-group class="m-form__group"
                                label="Expiry Date"
                                label-for="flagStateCOEExpiryDate">
                    <input type='text'
                           class="form-control"
                           id="flagStateCOEExpiryDate"
                           readonly
                           placeholder="dd.mm.yyyy"/>
                  </b-form-group>
                </div>
              </div>
            </div>
          </div>

          <div class="row m--margin-top-25 justify-content-between align-items-center">
            <div class="col-auto">
              <span v-if="editUser"
                    id="deleteMember0"
                    class="m-link m-link--state m-link--danger m--font-boldest2 m--font-transform-u">
                delete member
              </span>
              <b-popover placement="bottom"
                         :show.sync="showDeletePopover"
                         target="deleteMember0">
                <div class="light-popover">
                  <span class="m--font-grey close-modal-btn"
                        @click="showDeletePopover = !showDeletePopover">
                    <i class="la font-16 la-close"></i>
                  </span>
                  <p class="m--font-boldest">
                    Are you sure you want to delete <br>
                    the member
                  </p>
                  <button
                    @click="deleteMember"
                    class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                    Yes, delete member
                  </button>
                </div>
              </b-popover>
            </div>

            <div class="col-auto">
              <button type="submit"
                      v-bind:class="{'m-loader m-loader--light m-loader--right': formLoading}"
                      class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info m-btn--icon m-btn--icon-right">
                <span>
                  <span>Next</span>
                  <i class="la la-arrow-right"></i>
                </span>
              </button>
            </div>
          </div>
        </b-form>
      </b-tab>
      <b-tab @click="changeTab"
             title="<span class='m-badge m--margin-right-5'>2</span> Stops"
             :title-link-class="{'not-active': (tabIndex === 0) && !editUser}">


        <div v-if="tabIndex === 1"
             class="m--margin-top-40 m-form m-form--state absolute-error"
             novalidate>

          <div class="row align-items-end m--margin-top-20" v-if="createdStopsList.length < 8">

            <div class="col">
              <b-form-group class="m-form__group"
                            :class="{'has-danger': (
                                      errors.has('name') ||
                                      errors.has('placeId') ||
                                      errors.has('longitude') ||
                                      errors.has('latitude')) &&
                                      stop.submitted
                                    }"
                            label="Stop Name:"
                            label-class="form-control-label"
                            label-for="name">
                <vue-google-autocomplete
                  id="name"
                  classname="form-control"
                  placeholder="Name"
                  v-on:placechanged="getAddressData"
                >
                </vue-google-autocomplete>
                <div v-show="errors.has('name') && stop.submitted"
                     class="form-control-feedback">
                  {{errors.first('name')}}
                </div>
              </b-form-group>
            </div>

            <div class="col-md-auto">
              <div class="row">
                <div class="col-md-auto">
                  <b-form-group class="date-input m-form__group"
                                :class="{'has-danger': errors.has('dateTime') && stop.submitted}"
                                label="Date"
                                v-if="tabIndex === 1"
                                label-for="dateTime">
                    <input type='text'
                           class="form-control stop-date"
                           id="dateTime"
                           readonly
                           name="name"
                           placeholder="dd.mm.yyyy"/>
                  </b-form-group>
                </div>
                <div class="col-md-auto">
                  <b-form-group class="time-input m-form__group timepicker-content"
                                :class="{'has-danger': errors.has('dateTime') && stop.submitted}"
                                label="Time"
                                v-if="tabIndex === 1"
                                label-for="dateHours">
                    <div class="input-group date stop-time"
                         id="dateHours">
                      <input type="text"
                             :disabled="!stop.form.date"
                             class="form-control"
                             readonly
                             placeholder="hh.mm"/>
                      <span class="input-group-addon timepicker-icon">
                  </span>
                    </div>
                  </b-form-group>
                </div>
              </div>
              <div class="m-form__group has-danger" v-show="errors.has('dateTime') && stop.submitted">
                <div class="form-control-feedback">
                  Please specify valid date and time
                </div>
              </div>


            </div>

            <div class="col">
              <b-form-group class="m-form__group"
                            :class="{'has-danger': errors.has('comment') && stop.submitted}"
                            label="Comment:"
                            label-class="form-control-label"
                            label-for="Comment">
                <b-form-input id="Comment"
                              type="text"
                              v-model="stop.form.comment"
                              v-validate="'min:2|max:400'"
                              data-vv-as="Comment"
                              name="comment"
                              class="m-input"
                              placeholder="Flight number, exact address, name of the person to meet, etc.">
                </b-form-input>
                <div v-show="errors.has('comment') && stop.submitted"
                     class="form-control-feedback">
                  {{errors.first('comment')}}
                </div>
              </b-form-group>

            </div>
            <div class="col-md-auto">
              <button
                type="button"
                @click="addStop()"
                v-if="createdStopsList.length < 8"
                class="add-stop-btn btn btn-dark m-btn m-btn--icon m-btn--icon-only">
                <i class="la la-plus"></i>
              </button>
              <button class="add-stop-btn btn m-btn m-btn--icon m-btn--icon-only opacity-0"
                      disabled
                      v-if="createdStopsList.length > 7">
              </button>
            </div>
          </div>

          <div class="row no-gutters" v-if="createdStopsList.length">
            <div class="col">
              <b-table :fields="stopsFields"
                       :items="createdStopsList"
                       class="stops-list m--margin-top-30 table table-without-head m-table m-table--bg-grey">

                <template slot="index" slot-scope="data">
                  {{data.index + 1}}
                </template>

                <template slot="date" slot-scope="data">
                  {{data.item.dateTime * 1000 | date('DD.MM.YYYY', data.item.dateTimeTimezone.name)}}
                </template>

                <template slot="time" slot-scope="data">
                  {{data.item.dateTime * 1000 | date('HH:mm', data.item.dateTimeTimezone.name)}}
                </template>

                <template slot="comment" slot-scope="data">
                  {{data.item.comment}}
                </template>
                <template slot="remove" slot-scope="data">
                  <button
                    type="button"
                    @click="deleteStop(data.item.id)"
                    class="add-stop-btn btn btn-dark m-btn m-btn--icon m-btn--icon-only">
                    <i class="la la-minus"></i>
                  </button>
                </template>
              </b-table>
            </div>
          </div>

          <div class="m--margin-top-30 row justify-content-between align-items-center ">
            <div class="col-auto">
              <span id="deleteMember1"
                    class="m-link m-link--state m-link--danger m--font-boldest2 m--font-transform-u">
                delete member
              </span>
              <b-popover placement="bottom"
                         :show.sync="showDeletePopover"
                         target="deleteMember1">
                <div class="light-popover">
                  <span class="m--font-grey close-modal-btn"
                        @click="showDeletePopover = !showDeletePopover">
                    <i class="la font-16 la-close"></i>
                  </span>
                  <p class="m--font-boldest">
                    Are you sure you want to delete <br>
                    the member
                  </p>
                  <button
                    @click="deleteMember"
                    class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                    Yes, delete member
                  </button>
                </div>
              </b-popover>
            </div>
            <div class="col-auto">

              <span :disabled="stopsCopied"
                    v-if="createdStopsList.length"
                    v-bind:hidden="editUser && !user.crewGroupId"
                    class="m--margin-right-20 m-link m-link--state m-link--info m-link-loader m--font-transform-u m--font-boldest2"
                    v-bind:class="{'m-loader m-loader--left': isSopy}">

                <span v-if="!stopsCopied && stopsLength !== createdStopsList.length"
                      id="copyItenary">
                  copy itinerary to group
                </span>

                <span v-if="stopsCopied && stopsLength === createdStopsList.length">
                  Copied
                </span>

                <b-popover placement="bottom"
                           :show.sync="showItenaryPopover"
                           target="copyItenary">
                <div class="light-popover">
                  <span class="m--font-grey close-modal-btn"
                        @click="showItenaryPopover = !showItenaryPopover">
                    <i class="la font-16 la-close"></i>
                  </span>
                  <p class="m--font-boldest">
                   Are you sure? This will overwrite all existing Stops of other Group members.
                  </p>
                  <button
                    @click="copyStops"
                    class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-info">
                    Yes, I'm sure
                  </button>
                </div>
              </b-popover>

              </span>

              <button @click="saveAndClose" type="button"
                      class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-outline-info">
                save
              </button>

              <button v-if="!editUser" @click="saveAndAddNew" type="button"
                      class="m--margin-left-15 btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info">
                save & add next
              </button>

            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
  import {mapFields} from 'vee-validate'
  import remove from 'lodash/remove'
  import cloneDeep from 'lodash/cloneDeep'
  import findIndex from 'lodash/findIndex'
  import errorForm from '../Error'
  import {mapState} from 'vuex'
  import moment from 'moment-timezone'
  import VueGoogleAutocomplete from '../../components/autocomplete/autocomplete'

  export default {
    props: [
      'createMember',
      'nationalityList',
      'groups',
      'user',
      'editMember'
    ],
    computed: mapState([
      'timezoneList'
    ], {
      ...mapFields({
        timezoneList: 'timezoneList',
        nameFlags: 'Full Name'
      })
    }),
    components: {
      errorForm,
      VueGoogleAutocomplete
    },
    data() {

      let personalInfoForm = {
        crewGroup: '',
        nationality: '',
        name: '',
        position: '',
        phone: '',
        birthday: '',
        nearestAirport: '',
        agents: '',
        passportNumber: '',
        passportNumberExpiryDate: '',
        visa: '',
        visaValidTo: '',
        seamanBook: '',
        seamanBookExpiryDate: '',
        flagStateCDC: '',
        flagStateCDCExpiryDate: '',
        flagStateCOE: '',
        flagStateCOEExpiryDate: ''
      }
      let emptyStop = {
        id: 0,
        submitted: false,
        formErrors: {},
        form: {
          latitude: '',
          longitude: '',
          name: '',
          placeId: '',
          date: '',
          dateTime: '',
          dateTimeTimezone: {},
          comment: ''
        }
      };
      if (this.user && this.editMember) {
        personalInfoForm = cloneDeep(this.user);
        personalInfoForm.phone.replace('+', '')
      }
      return {
        showDeletePopover: false,
        showItenaryPopover: false,
        birthday: {
          days: [],
          months: [],
          years: [],
          value: {
            day: null,
            month: null,
            year: null
          }
        },
        formLoading: false,
        stopsCopied: false,
        isSopy: false,
        emptyStop: cloneDeep(emptyStop),
        createdStopsList: this.editMember ? this.user.stops : [],
        stopsLength: null,
        stop: cloneDeep(emptyStop),
        emptyPersonalInfo: cloneDeep(personalInfoForm),
        editUser: this.editMember ? this.user : '',
        updateStopDates: null,
        address: '',
        tabIndex: 0,
        stepsTabDisable: true,
        memberId: null,
        stopsFields: ['index', 'name', 'date', 'time', 'comment', 'remove'],
        personalInfo: {
          groups: {
            selected: 'Select',
            options: this.setGroups()
          },
          nationalityList: {
            selected: '',
            options: this.nationalityList
          },
          submitted: false,
          form: cloneDeep(personalInfoForm)
        }
      }
    },
    methods: {
      setGroups() {
        const groups = cloneDeep(this.groups)
        groups.unshift({id: null, name: 'Select'})
        return groups
      },
      toggleModal() {
        let data = {
          edit: this.editMember
        }

        if (this.$route.params.groupId) {
          data.groupPage = this.$route.params.groupId
        }
        this.$store.dispatch('openCreateMember', data)
      },
      copyStops() {
        const data = {
          crewId: this.$route.params.crewId,
          memberId: this.editUser ? this.editUser.id : this.memberId
        };

        this.isSopy = true;
        this.showItenaryPopover = false;

        this.$store.dispatch('copyStops', data)
          .then(() => {
            this.stopsCopied = true;
            this.isSopy = false;
            this.stopsLength = this.createdStopsList.length
          })
      },
      deleteMember() {
        const data = {
          crewId: this.$route.params.crewId,
          memberId: this.editUser ? this.editUser.id : this.memberId
        };
        this.$store.dispatch('deleteMember', data)
          .then(() => {
            this.toggleModal();
          })
      },
      deleteStop(id) {
        const data = {
          memberId: this.editUser ? this.editUser.id : this.memberId,
          stopId: id
        };

        this.$store.dispatch('deleteStop', data).then(res => {
          this.createdStopsList = res.stops;
          this.stopsCopied = false
        })
      },
      filterGroups() {
        remove(this.personalInfo.groups.options, (item) => {
          if (!item.id) {
            return false
          }
          if (this.editUser) {
            if (item.members.length >= 8 && this.user.crewGroupId === item.id) {
              return false
            }
          }
          return item.members.length >= 8
        })

        return this.personalInfo.groups.options
      },
      changeTab() {
        this.updateStopDates()
      },
      getAddressData: function (addressData, placeResultData) {

        const list = this.stop
        list.form.name = placeResultData.name
        list.form.placeId = placeResultData.place_id
        list.form.longitude = addressData.longitude
        list.form.latitude = addressData.latitude
        list.form.timeOffset = placeResultData.utc_offset

        this.errors.remove('name')
        this.errors.remove('longitude')
        this.errors.remove('latitude')
        this.errors.remove('placeId')
      },
      changeNationality(option) {
        this.personalInfo.nationalityList.selected = option.name
        this.personalInfo.form.nationality = option.id
      },
      setDate(id, val) {
        const formatedVal = moment(val).utc().format('X')

        if (id === ('dateTime')) {

          if (this.stop.form.dateTime) {
            this.errors.remove('dateTime')
          }

          this.stop.form.date = val

          if (this.stop.form.dateTime) {
            const oldTime = this.stop.form.dateTime
            const timeHours = moment(oldTime).get('hour')
            const timeMinute = moment(oldTime).get('minute')
            const time = moment(val).set({'hour': timeHours, 'minute': timeMinute}).utcOffset(this.stop.form.timeOffset)

            return this.stop.form.dateTime = time
          }
          return this.stop.form.dateTime = val
        }
        this.personalInfo.form[id] = formatedVal
      },
      setTime(val) {
        this.stop.form.dateTime = val
        this.errors.remove('dateTime')
      },
      resetStopFields() {
        this.stop = cloneDeep(this.emptyStop)

        $('.stop-time input').val('')
        $('.stop-date').val('')
        $('#name').val('')
      },
      addStop() {
        this.stop.submitted = true

        if (!this.stop.form.latitude && !this.stop.form.longitude) {
          return this.errors.add('name', 'The name field is required.', 'server')
        }
        if (!this.stop.form.dateTime) {
          return this.errors.add('dateTime', 'Please specify valid date and time', 'server')
        }

        const id = this.editUser ? this.editUser.id : this.memberId
        const data = cloneDeep(this.stop.form)
        const dateForCheck = moment(data.dateTime).utcOffset(data.timeOffset, true)
        const dateForCheckClone = dateForCheck.clone()

        const timeData = {
          lat: data.latitude,
          lng: data.longitude,
          time: moment(dateForCheckClone).utc().format('X')
        }
        this.$store.dispatch('getTimezone', timeData)
          .then((res) => {
            const date = moment(data.dateTime)
            const timezoneIndex = findIndex(this.timezoneList, {name: res.timeZoneId})

            data.dateTime = date.tz(res.timeZoneId, true).utc().unix()
            data.dateTimeTimezone = this.timezoneList[timezoneIndex].id

            this.$store.dispatch('createStops', {id, data})
              .then((res) => {
                this.resetStopFields();
                this.createdStopsList = res.stops
                this.stopsCopied = false
              })
              .catch((rej) => {

                if (rej.body.form.children) {
                  return this.$store.getters.formValidation(rej.body.form, this.errors)
                }
              })
          })
      },
      saveAndClose() {
        this.saveStop()
      },
      saveAndAddNew() {
        this.saveStop('continue')
      },
      saveStop(type) {

        if (type === 'continue') {

          //reset user
          this.personalInfo.form = cloneDeep(this.emptyPersonalInfo)
          this.createdStopsList = []

          this.personalInfo.groups.selected = 'Select'
          this.personalInfo.nationalityList.selected = 'Select'
          this.personalInfo.form.crewGroup = this.personalInfo.groups.options[0].id
          this.birthday.value = {
            day: null,
            month: null,
            year: null
          };
          return this.tabIndex = 0
        }

        return this.toggleModal(this.editMember)
      },
      changeGroup(option) {
        this.personalInfo.groups.selected = option.name
        this.personalInfo.form.crewGroup = option.id
      },
      submitPersonalInfo(evt) {
        evt.preventDefault()

        this.$validator.validateAll().then((result) => {
          this.personalInfo.submitted = true

          if (result) {
            this.formLoading = true
            let form = cloneDeep(this.personalInfo.form)
            form.phone = '+' + this.personalInfo.form.phone

            const data = {
              crewId: this.$route.params.crewId,
              form: form,
              memberId: this.editUser ? this.editUser.id : null
            }

            this.$store.dispatch('createNewMember', data)
              .then((res) => {
                this.updateStopDates()
                this.$nextTick(() => {
                  this.memberId = res.id
                  this.stepsTabDisable = false
                  this.personalInfo.submitted = false
                  this.tabIndex = 1
                })

              })
              .catch((rej) => {

                this.$store.getters.formValidation(rej.body.form, this.errors)
              })
              .finally(() => this.formLoading = false)
          }
        })
      },
      setMonths() {
        this.birthday.months = moment.months()
      },
      setYears() {
        for (let year = 1900; year < moment().year(); year++) {
          this.birthday.years.unshift({value: year, label: year})
        }
      },
      setMonthDays(month, year) {
        const monthNum = moment().month(month).format('M')
        const daysCount = new Date(year, monthNum, 0).getDate()
        this.birthday.days = []

        // set days
        for (let oneDay = 1; oneDay <= daysCount; oneDay++) {
          this.birthday.days.push({value: oneDay, label: oneDay})
        }

        if (this.birthday.value.day > this.birthday.days.length) { // if select day > than month have
          this.birthday.value.day = null
        }
      },
      changeBirthday(value, name) {
        this.birthday.value[name] = value

        const day = this.birthday.value.day
        const month = this.birthday.value.month
        const year = this.birthday.value.year

        if (name === 'month' || name === 'year') {
          this.setMonthDays(month, year)
        }
        if (day && month && year) {
          this.errors.remove('birthday')
          const monthNum = moment().month(month).format('M')
          return this.personalInfo.form.birthday = +moment([year, monthNum, day]).unix()
        }
        this.errors.add('birthday', 'error', 'server')
      }
    },
    mounted: function () {
      this.setMonths()
      this.setYears()
      const month = this.birthday.months[0]
      const year = this.birthday.years[0].value

      this.setMonthDays(month, year)

      this.$store.dispatch('getTimezoneList')

      if (this.user && this.editMember) {
        if (this.user.birthday) {
          const monthNumber = this.birthday.value.month = moment(this.user.birthday * 1000).get('month')
          this.birthday.value.year = moment(this.user.birthday * 1000).get('year')
          this.birthday.value.month = moment.months(monthNumber)
          this.setMonthDays(this.birthday.value.month, this.birthday.value.year)
          this.birthday.value.day = moment(this.user.birthday * 1000).get('date')
        }

        if (this.user.nationality) {
          this.personalInfo.nationalityList.selected = this.user.nationality.name
          this.personalInfo.form.nationality = this.user.nationality.id
        }
        if (this.user.crewGroupId) {
          const groupIndex = findIndex(this.groups, {id: this.user.crewGroupId})
          this.personalInfo.groups.selected = this.user.crewGroupId ? this.groups[groupIndex].name : ''
          this.personalInfo.form.crewGroup = this.groups[groupIndex].id
        }
      }
      const datepickerElements = $('#passportNumberExpiryDate, #visaValidTo, #seamanBookExpiryDate, #flagStateCDCExpiryDate, #flagStateCOEExpiryDate')

      datepickerElements.datepicker({
        todayHighlight: true,
        templates: {
          leftArrow: '<i class="la la-angle-left"></i>',
          rightArrow: '<i class="la la-angle-right"></i>'
        },
        format: 'dd.mm.yyyy'
      })

      datepickerElements.on('changeDate.daterangepicker', (ev) => {
        $('#' + ev.target.id).datepicker('hide')
        this.setDate(ev.target.id, ev.date)
      })

      this.updateStopDates = () => {
        const dateEl = '.stop-date'
        const timeEl = '.stop-time'

        const updateDate = (ev) => {
          $('#' + ev.target.id).datepicker('hide')
          this.setDate(ev.target.id, ev.date)
        }

        const datepickerInit = () => {
          // DATE

          setTimeout(() => {
            $(dateEl).datepicker({
              todayHighlight: true,
              templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
              },
              format: 'dd.mm.yyyy'
            })
          }, 500)
        }

        const datetimepickerInit = () => {
          setTimeout(() => {
            $(timeEl).datetimepicker({
              format: 'HH:mm',
              ignoreReadonly: true,
              collapse: false,
              icons: {
                up: 'la la-angle-up',
                down: 'la la-angle-down'
              }
            }, 1000)
          })

        }

        datepickerInit()
        datetimepickerInit()

        setTimeout(() => {
          $(dateEl).on('changeDate.daterangepicker', updateDate)

          $(timeEl).on('dp.change', (ev) => {
            const val = $(timeEl).data('DateTimePicker').date()
            const timeHours = moment(val).get('hour')
            const timeMinute = moment(val).get('minute')
            const time = moment(this.stop.form.date).set({'hour': timeHours, 'minute': timeMinute})
            this.setTime(time)
          })
        }, 0)
      }
    },
    name: 'new-member'
  }
</script>
