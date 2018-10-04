<template>
  <!--CONTENT-->
  <div class="m-grid__item m-grid__item--fluid m-wrapper">
    <div class="m-content group-details-page">
      <div class="row">
        <div class="col-md-10 offset-1">
          <h4 class="m--font-dark group-name" :class="{'popover-opened': showDeleteGroupPopover}">
            <span class="name">{{crewGroup.name}}</span>
            <div class="m--block-inline"
                 v-if="crewDetails && crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'">
              <button id="deleteGroup"
                      class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="la font-16 la-trash-o"></i>
              </button>
              <button @click="editGroup"
                      class="edit-icon-btn btn btn-info m-btn m-btn--icon btn-sm m-btn--icon m-btn--icon-only">
                <i class="la font-16 la-pencil"></i>
              </button>
              <b-popover placement="bottom"
                         :class="'remove-popover'"
                         :show.sync="showDeleteGroupPopover"
                         target="deleteGroup">
                <div class="light-popover">
                  <span class="m--font-grey close-modal-btn"
                        @click="showDeleteGroupPopover = !showDeleteGroupPopover">
                    <i class="la font-16 la-close"></i>
                  </span>
                  <p class="m--font-boldest">
                    Are you sure you want to delete <br>
                    the group
                  </p>
                  <button
                    @click="deleteGroup"
                    class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                    Yes, delete group
                  </button>
                </div>
              </b-popover>
            </div>

          </h4>
          <div class="m--margin-bottom-10 no-cursor row no-gutters align-items-center">
            <div class="row no-gutters align-items-center" v-if="crewGroup.status === 'notStarted'">
              <span class="m--margin-right-5 btn btn-metal btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-pause"></i>
              </span>

              <span class="font-12">
                Not started
              </span>
            </div>

            <div class="row no-gutters align-items-center" v-if="crewGroup.status === 'finished'">
              <span class="m--margin-right-5 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-check"></i>
              </span>

              <span class="font-12">
                Finished
              </span>
            </div>

            <div class="row no-gutters align-items-center" v-if="crewGroup.status === 'late'">
              <span class="m--margin-right-5 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-close"></i>
              </span>

              <span class="font-12">
                Late
              </span>
            </div>

            <div class="row no-gutters align-items-center" v-if="crewGroup.status === 'inProgress'">
              <span class="m--margin-right-5 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-arrow-right"></i>
              </span>

              <span class="font-12">
                In progress
              </span>
            </div>
            ;
            <span class="m--font-transform-c m--margin-left-10 font-12" v-if="crewGroup.direction !== 'unspecified'">
              {{crewGroup.direction}}
            </span>
          </div>

          <b-tabs v-if="crewGroup.members && crewGroup.members.length"
                  v-model="activeTab"
                  nav-class="nav nav-tabs m-tabs-line m-tabs-line--info"
                  class="without-border">

            <b-tab
              :title="`<span class='custom-icon member-icon'></span> Crew Members <span class='m--font-grey'>(` + crewGroup.members.length + `)</span>`">
              <div class="m-portlet m--margin-top-30 double-table">
                <member-table-list
                  :items="crewGroup.members"
                  :group="crewGroup"
                  :groupId="crewGroup.id"
                  :activeMemberDetails="createMemberModal.user"
                  @openMemberDetails="openMemberDetails"
                  @deleteMember="deleteMember"
                  @toggleCreateModal="toggleCreateMember">
                </member-table-list>
              </div>
            </b-tab>

            <b-tab title="<span class='custom-icon stop-icon'></span> Stops">
              <members-stops v-if="(activeTab === 1)" :members="crewGroup.members"/>
            </b-tab>

            <b-tab title="<span class='custom-icon map-icon'></span> Map">
              <member-map v-if="(activeTab === 2) && crewGroup.members && mapStops.length"
                          :stops="mapStops">
              </member-map>
              <div v-else class="m-portlet m--margin-top-30 double-table">
                <no-info></no-info>
              </div>
            </b-tab>

            <b-tab :title="`<span class='custom-icon chat-icon'><span class='badge badge_message ${!unreadMessages || activeTab === 3 ? 'hide': ''}'>${unreadMessages}</span></span> Chat`">

              <members-chat
                v-if="crewGroup.members || crewGroup.members.length"
                :groupId="crewGroup.id"
                :active="activeTab === 3"/>

            </b-tab>

            <b-tab
              :title="`<span class='custom-icon alerts-icon'><span class='badge badge_message ${!crewGroupUnreadAlerts ? 'hide': ''}'>${crewGroupUnreadAlerts}</span></span> Alerts`">
              <member-alerts v-if="activeTab === 4"></member-alerts>
            </b-tab>

          </b-tabs>

          <div class="m-portlet m--margin-top-30" v-if="!crewGroup.members || !crewGroup.members.length">
            <div class="row">
              <div class="col">
                <no-info></no-info>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import noInfo from '../../../../components/crewManager/no-info'
  import memberTableList from '../../../../components/member/tableList'
  import membersStops from '../../../../components/member/stops'
  import membersChat from '../../../../components/member/chat'
  import memberMap from '../../../../components/member/member-map'
  import memberAlerts from '../../../../components/member/alerts'
  import findIndex from 'lodash/findIndex'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    name: 'crew-group',
    layout: 'crew-details',
    computed: mapState([
      'crewGroup',
      'crewDetails',
      'createMemberModal',
      'crewGroupUnreadAlerts',
      'unreadMessages'
    ]),
    fetch ({store, route}) {
      const data = {
        crewId: route.params.crewId,
        groupId: route.params.groupId
      }

      return store.dispatch('getGroupDetails', data)
    },
    watch: {
      activeTab (val) {
        this.setActive(val);
        this.checkBadge()
      },
      crewGroupUnreadAlerts () {

        if (this.activeTab === 4) {
          this.$store.commit('ADD_FIREBASE_ALERTS', {type: 'crewGroup', id: this.groupId})
          const val = {
            crewId: this.crewId,
            crewGroupId: this.groupId
          };
          const data = {
            string: $.param(val),
            ...val
          };
          this.$store.dispatch('readAlerts', data)
        }
      },
      unreadMessages() {

        this.checkBadge()
      }
    },
    created: function () {
      this.findStops()

      if (this.$route.query && this.$route.query.tab) {
        const index = findIndex(this.tabs, {name: this.$route.query.tab})
        return this.setActive(this.tabs[index].id)
      }

      this.setActive(this.tabs[0].id)
    },
    beforeUpdate () {
      this.checkBadge()
    },
    mounted: function () {
      this.badge = document.getElementsByClassName('badge_message')
      this.checkBadge()
    },
    data () {
      return {
        mapStops: [],
        passSent: false,
        crewId: this.$route.params.crewId,
        groupId: this.$route.params.groupId,
        group: this.crewGroup,
        showDeleteGroupPopover: false,
        tabs: [
          {
            name: 'members',
            id: 0
          },
          {
            name: 'stops',
            id: 1
          },
          {
            name: 'map',
            id: 2
          },
          {
            name: 'chat',
            id: 3
          },
          {
            name: 'alerts',
            id: 4
          }
        ],
        activeTab: 0,
        badge: null,
        count: 0
      }
    },
    methods: {
      findStops () {
        if (!this.crewGroup.members) return

        this.crewGroup.members.forEach((member) => {
          if (!member.stops.length) return
          // member.stops.reverse()
          const stops = cloneDeep(member.stops)
          stops.reverse().some((stop) => {

            if (stop.dateTimeCheckIn) {
              stop.location = {
                lat: stop.latitude,
                lng: stop.longitude
              }

              stop.memberName = member.name
              return this.mapStops.push(stop)
            }
          })
        })
      },
      setActive (id) {
        this.activeTab = id
        const index = findIndex(this.tabs, {id: id})
        this.$router.push({query: {tab: this.tabs[index].name}})
      },
      deleteGroup () {
        const data = {
          crewId: this.crewId,
          groupId: this.groupId
        }
        this.$store.dispatch('deleteGroup', data).then(() => {
          this.$router.push({name: 'manage-crew-changes-crewId', params: {crewId: this.$route.params.crewId}})
        })
      },
      openMemberDetails (ev, memberIndex, group) {
        ev.preventDefault()
        this.$store.dispatch('setActiveMemberDetails', group.members[memberIndex])
        this.passSent = false
      },
      deleteMember (ev, id) {
        ev.preventDefault()
        this.$store.dispatch('deleteMember', {crewId: this.crewId, memberId: id}).then((res) => {
          this.resetMember()
          const data = {
            crewId: this.$route.params.crewId,
            groupId: this.$route.params.groupId
          }
          this.$store.dispatch('getGroupDetails', data)
        })
      },
      toggleCreateMember (ev, edit) {
        this.$store.dispatch('openCreateMember', edit)
      },
      resetMember () {
        this.$store.dispatch('setActiveMemberDetails', null)
      },
      editGroup () {
        const data = {
          edit: true,
          open: true,
          group: this.crewGroup,
          gropId: this.groupId,
          crewId: this.crewId
        };

        this.$store.dispatch('editGroupModal', data)
      },
      checkBadge () {
        return this.unreadMessages
      }
    },
    head () {
      return {
        title: 'Group details'
      }
    },
    components: {
      noInfo,
      membersStops,
      memberTableList,
      membersChat,
      memberMap,
      memberAlerts
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../assets/scss/crew/crew-details';
</style>
