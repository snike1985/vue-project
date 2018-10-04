<template>
  <div>
    <app-header></app-header>
    <div class="page-wrapper">
      <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">

        <!--SIDEBAR-->
        <div class="m-grid__item m-aside-left vertical-aside row no-gutters m-aside-left--skin-dark ">
          <div class="m--padding-20" v-if="crewDetails">
            <div class="m--margin-bottom-50 crew-name-container">

              <div class="m--font-light font-18 crew-name row align-items-center no-gutters justify-content-center">
                <div class="m--padding-right-20">
                  <nuxt-link class="m-menu__link link-icon" to="/manage-crew-changes">
                    <i class="font-18 la la-angle-left block"></i>
                  </nuxt-link>
                </div>
                <div class="col crew-name-wrapper">
                  <span v-if="!crewDetails.valid"
                        class="no-cursor m--margin-right-10 btn btn-warning btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="la m--font-light">!</i>
                  </span>
                  <span class="crew-name-text">
                    <span class="text">
                      {{crewDetails.name}}
                    </span>
                  </span>
                  <div class="date-change m--font-light font-11 opacity-6">
                    {{crewDetails.updatedAt * 1000 | date('MMM DD YYYY', currentUser.timeZone ?
                    currentUser.timeZone.name : null)}}
                  </div>
                </div>
              </div>
              <button @click="editCrew"
                      v-if="crewDetails && crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'"
                      class="edit-icon-btn btn btn-info m-btn m-btn--icon btn-sm m-btn--icon m-btn--icon-only">
                <i class="la font-16 la-pencil"></i>
              </button>
            </div>
            <div class="m--margin-bottom-10"
                 v-if="crewDetails && crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'">
              <b-dropdown
                id="ddown1"
                variant="info"
                text="Create Crew Change"
                toggle-class="m-btn--icon-left m--font-boldest2 m--font-transform-u"
                class="w-100 m-dropdown m-dropdown--inline m-dropdown--small m-dropdown--arrow create-crew-btn">
                <template slot="button-content">
                  <i class="la la-plus-circle opacity-4"></i>
                  <span>Add Crew</span>
                </template>

                <b-dropdown-item class="m--font-info" @click="toggleCreateMember">Manually</b-dropdown-item>

                <b-dropdown-divider/>


                <b-dropdown-item class="m--font-info with-link">
                  <nuxt-link :to="('/manage-crew-changes/' + crewId + '/import')">
                    Import
                  </nuxt-link>
                </b-dropdown-item>
              </b-dropdown>

              <button
                @click="toggleCreateGroup"
                class="w-100 text-center m-btn--icon m--margin-top-10 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
                type="button">
                <span>
                  <i class="la font-26 la-plus-circle opacity-4"></i>
                  <span>
                    Add group
                  </span>
                  <i class="la la-plus-circle opacity-0"></i>
                </span>
              </button>
            </div>
            <button class=" w-100 btn m--font-transform-u m--font-boldest2 btn-sm btn-metal"
                    @click="openAutoCreateGroup()">
              <span>
                Auto-Create Groups
              </span>
            </button>

            <button class="m--margin-top-10 w-100 btn m--font-transform-u m--font-boldest2 btn-sm btn-metal"
                    @click="openContactInfo()">
              <span>
                Contact Information
              </span>
            </button>
            <div v-if="crewDetails && crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'">
              <button :disabled="passwordsSent || passError"
                      v-if="crewGroupsList && checkMembers()"
                      class="m--margin-top-10 w-100 btn m--font-transform-u m--font-boldest2 btn-sm btn-metal"
                      @click="sendPasswordForAll()">
                <span v-if="!passwordsSent">
                  Send out sms passwords
                </span>
                <span v-if="passwordsSent">
                  Passwords sent
                </span>
              </button>
              <button class="m--margin-top-10 w-100 btn m--font-transform-u m--font-boldest2 btn-sm btn-metal"
                      @click="duplicateCrew()">
                <span>
                  Duplicate crew changes
                </span>
              </button>

              <div v-if="passError" class="m--font-danger font-11 text-center m--margin-top-5">
                Some members already have active accounts
              </div>
            </div>

          </div>
          <div class="col group-list">
            <b-list-group v-if="crewGroupsList && crewGroupsList.items.length">
              <b-list-group-item>
                <nuxt-link class="m--font-light m--margin-bottom-30" :to="(`/manage-crew-changes/${crewId}/manager`)">
                  Crew Managers
                </nuxt-link>
              </b-list-group-item>
              <b-list-group-item>
                <nuxt-link class="m--font-light" :to="('/manage-crew-changes/' + crewId)" exact>
                  All Crew
                </nuxt-link>
              </b-list-group-item>
              <b-list-group-item
                v-for="group in crewGroupsList.items" v-bind:key="group.id">
                <nuxt-link class="m--font-light" :to="('/manage-crew-changes/' + crewId + '/group/' + group.id)">
                  <div class="row no-gutters align-items-center">
                    <div class="col name-wrapper-aside">
                      <div class="row no-gutters align-items-center">
                        <span v-if="!group.valid"
                              class="no-cursor m--margin-right-10 btn btn-warning btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                          <i class="la m--font-light">!</i>
                        </span>
                        <span class="col name">
                          {{group.name}}
                        </span>
                      </div>
                    </div>
                    <div class="col-auto">
                      <div class="row no-gutters align-items-center">
                        <span v-if="group.direction !== 'unspecified'"
                              class="m--font-transform-u no-cursor btn btn-sm font-11 m--font-boldest2 w-45"
                              :class="{
                              'btn-primary': group.direction === 'on',
                              'btn-metal': group.direction === 'off'
                            }">
                          {{group.direction}}
                        </span>

                        <span :id="'datesPopover' + group.id"
                              v-if="group.startDate && group.endDate"
                              @click="$event.preventDefault(); $root.$emit('bv::hide::popover')"
                              :class="{
                                'btn-success': group.status === 'arrived' || group.status === 'finished',
                                'btn-metal': group.status === 'notStarted',
                                'btn-danger': group.status === 'late',
                                'btn-primary': group.status === 'inProgress'
                              }"
                              class="dates-status btn m--margin-left-10 btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">

                          <i v-if="group.status === 'notStarted'" class="m--font-light font-11 la la-pause"></i>
                          <i v-if="group.status === 'late'" class="m--font-light font-11 la la-close"></i>
                          <i v-if="group.status === 'inProgress'" class="m--font-light font-11 la la-arrow-right"></i>
                          <i v-if="group.status === 'arrived' || group.status === 'finished'" class="m--font-light font-11 la la-check"></i>

                        </span>
                        <b-popover placement="bottom"
                                   v-if="group.startDate && group.endDate"
                                   :ref="'datesPopover' + group.id"
                                   :target="'datesPopover' + group.id">
                          <div class="dark-popover font-11 right-arrow-small">
                            <span class="m--font-grey close-modal-btn"
                                  @click="closeDatesPopover(group)">
                              <i class="la font-16 la-close"></i>
                            </span>
                            <div class="m--font-transform-u m--font-boldest2 opacity-6">
                              Departure:
                            </div>
                            <div class="m--margin-top-5 m--font-boldest">
                              {{group.startDate * 1000 | date('DD.MM.YYYY', currentUser.timeZone ?
                              currentUser.timeZone.name : '')}}; {{group.startDate * 1000 | date('HH:mm',
                              currentUser.timeZone ? currentUser.timeZone.name : '')}}
                            </div>

                            <div class="m--margin-top-10 m--font-transform-u m--font-boldest2 opacity-6">
                              Arrival:
                            </div>
                            <div class="m--margin-top-5 m--font-boldest">
                              {{group.endDate * 1000 | date('DD.MM.YYYY',currentUser.timeZone ?
                              currentUser.timeZone.name : '')}}; {{group.endDate * 1000 | date('HH:mm',
                              currentUser.timeZone ? currentUser.timeZone.name : '')}}
                            </div>
                          </div>
                        </b-popover>

                      </div>
                    </div>
                  </div>
                </nuxt-link>

              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
        <nuxt/>

        <!-- the modals -->
        <new-member v-if="createMemberModal.open"
                    :nationalityList="nationalityList"
                    :createMember="createMemberModal.open"
                    :editMember="createMemberModal.edit"
                    :user="createMemberModal.user"
                    :groups="crewGroupsList.items">
        </new-member>
        <new-group v-if="editGroupModalData.open"
                   :createGroup="editGroupModalData.open"
                   :group="editGroupModalData.group"
                   :editGroup="editGroupModalData.edit"
                   @closeCreateGroup="toggleCreateGroup">
        </new-group>
        <auto-create-group v-if="autoCreateGroupModal.open"
                           :crewId="crewId"
                           :show="autoCreateGroupModal.open"/>

        <contacts-info v-if="contactsOpen"
                       :contactsOpen="contactsOpen"
                       :crewId="crewId"
                       @toggleContactInfo="openContactInfo"/>

        <add-crew v-if="newCrewModal.open"
                  :show="newCrewModal.open"
                  :edit="newCrewModal.edit"
                  :crew="newCrewModal.crew">
        </add-crew>

        <copy-crew v-if="copyCrewModal.open"
                   :show="copyCrewModal.open"
                   :crew="copyCrewModal.crew">
        </copy-crew>
      </div>
    </div>
  </div>
</template>
<script>
  import AppHeader from '../components/AppHeader'
  import newMember from '../components/modals/newMember'
  import newGroup from '../components/modals/newGroup'
  import autoCreateGroup from '../components/modals/autoCreateGroup'
  import { mapState } from 'vuex'
  import contactsInfo from '../components/modals/contactsInfo'
  import addCrew from '../components/modals/addCrew'
  import copyCrew from '../components/modals/copyCrew'

  export default {
    computed: mapState([
      'nationalityList',
      'crewGroupsList',
      'crewDetails',
      'newCrewModal',
      'createMemberModal',
      'editGroupModalData',
      'autoCreateGroupModal',
      'currentUser',
      'copyCrewModal'
    ]),
    data () {
      return {
        datesPopover: {
          start: null,
          end: null
        },
        passError: false,
        passwordsSent: false,
        createGroup: false,
        contactsOpen: false,
        crewId: this.$route.params.crewId,
      }
    },
    watch: {
      $route () {
        this.$store.dispatch('setActiveMemberDetails', null);
      }
    },
    methods: {
      fetchData () {

        this.$store.dispatch('getNationalityList')
        this.$store.dispatch('getCrewDetails', this.crewId)
        if (this.$route.params.groupId) {
          this.$store.dispatch('getCrewGroupList', this.crewId)
        }
      },
      checkMembers () {
        let notEmpty

        this.crewGroupsList.items.forEach((group) => {
          if (group.members.length) {
            notEmpty = true
          }
        })
        return notEmpty
      },
      sendPasswordForAll () {
        const data = {
          crewId: this.crewId,
          groupId: this.$route.params.groupId
        }
        this.$store.dispatch('sendPasswordForAll', data)
          .then(() => {
            this.passwordsSent = true
          })
          .catch(() => {
            this.passError = true;
          })
      },
      editCrew () {
        const data = {
          open: true,
          edit: true,
          crew: this.crewDetails
        }
        this.$store.dispatch('createCrewModal', data)
      },
      duplicateCrew () {
        const data = {
          open: true,
          crew: this.crewDetails
        }
        console.log('copy', data.crew);
        this.$store.dispatch('copyCrewModal', data)
      },
      closeDatesPopover (group) {
        const ref = 'datesPopover' + group.id
        this.$refs[ref][0].$emit('close')
      },
      toggleCreateMember () {
        let data = {}
        if (this.$route.params.groupId) {
          data.groupPage = true
        }
        this.$root.$emit('bv::hide::popover')
        this.$store.dispatch('openCreateMember', data)
      },
      toggleCreateGroup () {
        const data = {
          open: true,
          crewId: this.crewId,
          gropId: this.$route.params.groupId
        }
        this.$store.dispatch('editGroupModal', data)
      },
      openContactInfo () {
        this.contactsOpen = !this.contactsOpen
      },
      openAutoCreateGroup () {
        const data = {
          open: true
        }
        this.$store.dispatch('autoCreateGroupModal', data)
      }
    },
    created: function () {
      this.fetchData()
    },
    name: 'crew-details',
    head: {
      bodyAttrs: {
        class: 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile'
      }
    },
    components: {
      contactsInfo,
      autoCreateGroup,
      newMember,
      newGroup,
      addCrew,
      AppHeader,
      copyCrew
    }
  }
</script>

<style lang="sass" scoped>
  @import '../assets/scss/crew/crew-details'
</style>
