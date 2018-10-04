<template>
  <div class="row no-gutters no-gutters">
    <b-table hover
             :class="{'col-md-8': activeMemberDetails}"
             :fields="groupsTableFields"
             :items="items"
             @row-clicked="openDetails"
             class="table table-with-shadow crew-table member-group m-table m-table--head-bg-light">

      <template slot="name" slot-scope="data">
        <div
           class="m--font-boldest m--font-dark member-name">
          <span class="row no-gutters align-items-center">
            <span v-if="!data.item.valid"
                  class="no-cursor m--margin-right-10 btn btn-warning btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
              <i class="la m--font-light">!</i>
            </span>
            <span class="m--margin-right-10">
              {{data.item.name}}
            </span>
            <span class="btn font-10 m--font-boldest2 btn-blue btn-xs"
                  v-if="data.item.leader">
              Leader
            </span>
          </span>
        </div>
      </template>

      <template slot="stops" slot-scope="data">
        <div v-if="data.item.stops">
          {{getUpcomingStop(data.item.stops)}}
          <span class="m--font-grey">({{getCheckInStops(data.item.stops)}} of {{data.item.stops.length}})</span>
        </div>
        <div v-else>
          <span class="m--font-grey">
            no stops
          </span>
        </div>

      </template>

      <template slot="status" slot-scope="data">
        <div class="row justify-content-sm-between">
          <div class="member-status">
            <span class="row no-gutters align-items-center" v-if="data.item.status === 'notStarted'">
              <span class="no-cursor m--margin-right-10 btn btn-metal btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-11 la la-pause"></i>
              </span>
               <span>
                  Not Started Yet
               </span>
            </span>

            <span class="row no-gutters align-items-center" v-if="data.item.status === 'late'">
              <span
                class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-11 la la-close"></i>
              </span>
              <span>
               Late
              </span>
            </span>

            <span class="row no-gutters align-items-center" v-if="data.item.status === 'inProgress'">
              <span
                class="no-cursor m--margin-right-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-arrow-right"></i>
              </span>
              <span>
               In Progress
              </span>
            </span>

            <span class="row no-gutters align-items-center" v-if="data.item.status === 'finished'">
              <span
                class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-check"></i>
              </span>
              <span>
               Finished
              </span>
            </span>

            <span class="row no-gutters align-items-center" v-if="data.item.status === 'arrived'">
              <span
                class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-check"></i>
              </span>
              <span>
               Arrived
              </span>
            </span>


          </div>
          <span class="font-16  m--margin-right-20 m--margin-left-10">
            <i v-if="activeMemberDetails && data.item.id === activeMemberDetails.id"
               class="m--font-boldest2 m--font-info la la-angle-left"></i>
            <i v-else class="la la-angle-right m--font-grey"></i>
          </span>
        </div>


      </template>

    </b-table>


    <!--MEMBER DETAILS-->
    <div class="member-details col-md-4 m--font-light"
         v-if="activeMemberDetails">
      <div class="right-details m--padding-30">
        <div class="row no-gutters align-items-top">
          <div class="col">
            <h4 class="font-21 m--font-boldest2 name">
              {{activeMemberDetails.name}}
            </h4>
          </div>

          <button v-if="(crewDetails && (crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'))"
                  :id="'deleteMember' + activeMemberDetails.id + groupId"
                  class="btn btn-dark m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill">
            <i class="la font-16 la-trash-o opacity-6"></i>
          </button>

          <button @click="toggleEditMember($event, true)"
                  v-if="(crewDetails && (crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'))"
                  class="m--margin-left-5 btn btn-dark m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill">
            <i class="la font-16 opacity-6 la-pencil"></i>
          </button>

          <b-popover placement="bottom"
                     :show.sync="showDeletePopover"
                     :target="'deleteMember'+activeMemberDetails.id + groupId">
            <div class="light-popover right-arrow delete-popover">
              <span class="m--font-grey close-modal-btn"
                    @click="showDeletePopover = !showDeletePopover">
                <i class="la font-16 la-close"></i>
              </span>
              <p class="m--font-boldest">
                Are you sure you want to delete <br>
                the member
              </p>
              <button
                @click="deleteMember($event, activeMemberDetails.id)"
                class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                Yes, delete member
              </button>
            </div>
          </b-popover>

        </div>
        <p class="m--font-grey m--font-transform-u">
          <crew-status :incon="false" :status="activeMemberDetails.status" class="text-uppercase"></crew-status>
        </p>
        <div v-if="crewDetails && (crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished')"
             v-bind:hidden="!activeMemberDetails.crewGroupId">
          <button class="w-100 m--margin-bottom-10 btn m--font-transform-u m--font-boldest2 btn-sm btn-info"
                  v-if="!activeMemberDetails.leader"
                  @click="setLeader(activeMemberDetails.id)">
          <span>
            Make group leader
          </span>
          </button>

          <div class="row no-gutters">
            <div class="col">
              <button class="w-100 btn m--font-transform-u m--font-boldest2 btn-sm btn-metal"
                      :disabled="passSent || passError"
                      @click="sendOnePass($event, activeMemberDetails.id)">
                <span v-if="!passSent">
                  Send Password
                </span>
                <span v-if="passSent">
                  Password sent
                </span>
              </button>
              <div v-if="passError" class="m--font-danger font-11 text-center m--margin-top-5">
                The phone number is already in use by another Member
              </div>
            </div>
          </div>
        </div>

        <div class="details font-12 m--margin-top-20">
          <div class="row no-gutters" v-if="activeMemberDetails.crewGroup">
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                Group:
              </p>
            </div>
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                {{activeMemberDetails.crewGroup}}
              </p>
            </div>
          </div>

          <div class="row no-gutters" v-if="activeMemberDetails.agents">
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                Agents:
              </p>
            </div>
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                {{activeMemberDetails.agents}}
              </p>
            </div>
          </div>

          <div class="row no-gutters" v-if="activeMemberDetails.seamanBook">
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                Seaman's Book:
              </p>
            </div>
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                {{activeMemberDetails.seamanBook}}
              </p>
            </div>
          </div>

          <div class="row no-gutters" v-if="activeMemberDetails.passportNumber">
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                Passport Number:
              </p>
            </div>
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                {{activeMemberDetails.passportNumber}}
              </p>
            </div>
          </div>

          <div class="row no-gutters" v-if="activeMemberDetails.phone">
            <div class="col-md-6">
              <p class="m--font-light opacity-6">
                Phone Number:
              </p>
            </div>
            <div class="col-md-6">
              <p class="m--font-light opacity-6" v-if="!createMemberModal.open">
                <the-mask class="hide" :mask="['+##(###)###-##-########']"
                          v-model="activeMemberDetails.phone"
                          :masked="true"/>
                {{activeMemberDetails.phone}}
              </p>
            </div>
          </div>
          <div class="row no-gutters"
               :class="{'m--margin-bottom-15': !showMoreInfo}"
               v-if="needToShowMoreBtn()">
            <div class="col">
              <span v-b-toggle.moreInfo
                    @click="showMoreInfo = !showMoreInfo"
                    class="m--font-info show-more-info">
                <span v-if="!showMoreInfo">
                  Show more information
                </span>
                <span v-else>
                  Hide more information
                </span>
                <span>
                  <i class="la" :class="{'la-angle-down': !showMoreInfo, 'la-angle-up': showMoreInfo}"></i>
                </span>
              </span>
            </div>
          </div>

          <b-collapse id="moreInfo" v-model="showMoreInfo" class="m--margin-top-15 bg-transparent">
            <div class="row no-gutters" v-if="activeMemberDetails.position">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Position
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.position}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.passportNumberExpiryDate">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Passport Expiry Date
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.passportNumberExpiryDate * 1000 | date('DD.MM.YYYY')}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.seamanBookExpiryDate">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Seaman's Book <br>
                  Expiry Date
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.seamanBookExpiryDate * 1000 | date('DD.MM.YYYY')}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.nationality">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Nationality
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.nationality.name}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.birthday">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Date of Birth
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.birthday * 1000 | date('DD.MM.YYYY')}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.nearestAirport">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Nearest Airport <br>
                  to Home
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.nearestAirport}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.flagStateCDC">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Flag State CDC
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.flagStateCDC}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.flagStateCDCExpiryDate">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Flag State <br>
                  CDC Exp. Date
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.flagStateCDCExpiryDate * 1000 | date('DD.MM.YYYY')}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.flagStateCOE">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Flag State CoE
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.flagStateCOE}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.flagStateCOEExpiryDate">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Flag State <br>
                  CoE Exp. Date
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.flagStateCOEExpiryDate * 1000 | date('DD.MM.YYYY')}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.visa">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Visa
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.visa}}
                </p>
              </div>
            </div>

            <div class="row no-gutters" v-if="activeMemberDetails.visaValidTo">
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  Visa Valid To
                </p>
              </div>
              <div class="col-md-6">
                <p class="m--font-light opacity-6">
                  {{activeMemberDetails.visaValidTo * 1000 | date('DD.MM.YYYY')}}
                </p>
              </div>
            </div>
          </b-collapse>

        </div>

        <p class="m--font-light m--font-boldest opacity-6 font-12" v-if="activeMemberDetails.stops.length">
          Stops:
        </p>

        <div class="m--margin-bottom-10"
             v-for="(stop, stopIndex) in activeMemberDetails.stops"
             v-bind:key="stopIndex">
          <div class="row no-gutters">
            <div>
              <span class="m--font-light opacity-6 font-12">{{stopIndex + 1}}</span>
              <span class="m--font-light m--margin-left-5 m--margin-right-5 opacity-6 font-12">
                <i class="la la-compass"></i>
              </span>
            </div>
            <div class="col">
              <div class="row no-gutters align-items-center">
                <span class="font-12">
                  {{ stop.name }}
                </span>

                <span class="btn font-10 no-cursor m--font-boldest2 btn-metal btn-xs m--margin-left-10"
                      v-if="(stopIndex === 0 && group.direction === 'on') || ((stopIndex + 1) === activeMemberDetails.stops.length && group.direction === 'off')">
                  Home
                </span>

                <span class="btn font-10 no-cursor m--font-boldest2 btn-metal btn-xs m--margin-left-10"
                      v-if="(stopIndex === 0 && group.direction === 'off') || ((stopIndex + 1) === activeMemberDetails.stops.length && group.direction === 'on')">
                  Onboard
                </span>
              </div>
              <span v-if="!stop.dateTimeCheckIn && (stop.status === 'late' || stop.status === 'upcoming')">
                Stop Time: {{ stop.dateTime * 1000 | date('DD.MM.YYYY', currentUser.timeZone ? currentUser.timeZone.name : stop.dateTimeTimezone.name) }}; {{ stop.dateTime * 1000 | date('HH:mm', currentUser.timeZone ? currentUser.timeZone.name : stop.dateTimeTimezone.name) }}
              </span>
              <span v-if="stop.dateTimeCheckIn">
                Check-in Time: {{ stop.dateTimeCheckIn * 1000 | date('DD.MM.YYYY', currentUser.timeZone ? currentUser.timeZone.name : stop.dateTimeTimezone.name) }}; {{ stop.dateTimeCheckIn * 1000 | date('HH:mm', currentUser.timeZone ? currentUser.timeZone.name : stop.dateTimeTimezone.name) }}
              </span>

              <div class="m--margin-top-5 m--font-light m--font-transform-u">
                <span class="row align-items-center no-gutters" v-if="stop.status === 'upcoming'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-10 la la-arrow-right"></i>
                  </span>

                  <span class="opacity-6 font-12 m--font-boldest">
                    upcoming
                  </span>
                </span>
                <span class="row align-items-center no-gutters" v-if="stop.status === 'checkedIn'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-10 la la-check"></i>
                  </span>

                  <span class="opacity-6 font-12 m--font-boldest">
                    Checked In
                  </span>
                </span>

                <span class="row align-items-center no-gutters" v-if="stop.status === 'late'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-10 la la-close"></i>
                  </span>

                  <span class="opacity-6 font-12 m--font-boldest">
                    Late
                  </span>
                </span>
              </div>

              <div v-if="stop.comment" class="m--margin-top-5 stops-list-details">
                <span v-b-toggle="'stopComments' + stop.id"
                      class="m--font-light font-12 show-more-info">
                  <span>
                    Comments
                  </span>
                  <span>
                    <i class="la la-angle-down"></i>
                    <i class="la la-angle-up"></i>
                  </span>
                </span>
                <b-collapse class="bg-transparent" :id="'stopComments' + stop.id">
                  {{ stop.comment }}
                </b-collapse>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import findIndex from 'lodash/findIndex'
  import { mapState } from 'vuex'
  import crewStatus from '../status'

  export default {
    props: [
      'activeMemberDetails',
      'items',
      'group',
      'groupId',
      'timezoneList',

    ],
    computed: mapState([
      'crewDetails',
      'currentUser',
      'createMemberModal'
    ]),
    components: {
      crewStatus
    },
    data () {
      return {
        passSent: false,
        passError: null,
        showMoreInfo: false,
        showDeletePopover: false,
        groupsTableFields: {
          name: {
            label: 'Name',
            sortable: true
          },
          stops: {
            label: 'Stops',
            sortable: true
          },
          status: {
            label: 'Status',
            sortable: true
          }
        }
      }
    },
    methods: {
      openDetails(record, index) {

        this.group.members.forEach((member) => {
          member._rowVariant = null
        });

        record._rowVariant = 'success';

        this.$store.dispatch('setActiveMemberDetails', record);

        this.passSent = false;
        this.passError = false;
        this.showMoreInfo = false

      },
      togglePopover () {

      },
      getUpcomingStop (stops) {
        if(!stops.length) return;

        let upcomingStop
        stops.some((stop) => {
          if (stop.status === 'upcoming') {
            return upcomingStop = stop.name
          }
        })
        return upcomingStop ? upcomingStop : stops[stops.length - 1].name;
      },
      getCheckInStops (stops) {
        let count = 0
        stops.forEach((item) => {
          if (item.dateTimeCheckIn) {
            count++
          }
        })
        return count
      },
      needToShowMoreBtn () {
        return (
          this.activeMemberDetails.position ||
          this.activeMemberDetails.passportNumberExpiryDate ||
          this.activeMemberDetails.seamanBookExpiryDate ||
          this.activeMemberDetails.nationality ||
          this.activeMemberDetails.birthday ||
          this.activeMemberDetails.nearestAirport ||
          this.activeMemberDetails.flagStateCDC ||
          this.activeMemberDetails.flagStateCDCExpiryDate ||
          this.activeMemberDetails.flagStateCOE ||
          this.activeMemberDetails.flagStateCOEExpiryDate ||
          this.activeMemberDetails.visa ||
          this.activeMemberDetails.visaValidTo
        )
      },
      toggleEditMember (ev, edit) {

        let data = {
          edit: edit
        };
        if (this.$route.params.groupId) {
          data.groupPage = true
        }
        this.$store.dispatch('openCreateMember', data)
      },
      sendOnePass (ev, id) {
        this.$store.dispatch('sendOnePass', id)
          .then(() => {
            this.passSent = true
          })
          .catch(() => {
            this.passError = true
          })
      },
      setLeader (id) {
        this.$store.dispatch('setLeader', id)
          .then((res) => {
            const memberIndex = findIndex(res.members, {id: id})
            this.$store.commit('SET_ACTIVE_MEMBER', res.members[memberIndex])

            if (this.$route.params.groupId) {
              return this.$store.commit('SET_GROUP_DETAILS', res)
            }

            this.$store.commit('UPDATE_CREW_GROUP', res)
          })
      },
      deleteMember (ev, id) {
        ev.preventDefault()
        this.showDeletePopover = false
        this.$emit('deleteMember', ev, id)
      },
      toggleDeletePopover () {
        if (this.showDeletePopover) {
          this.showDeletePopover = !this.showDeletePopover
        }
      }
    },
    watch: {
      showDeletePopover (val) {

        if (val === true) {
          document.addEventListener('click', this.toggleDeletePopover)
        } else {
          document.removeEventListener('click', this.toggleDeletePopover)
        }
      }
    },
    name: 'member-table-list'
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-details'
</style>
