<template>
  <!--CONTENT-->
  <div class="m-grid__item m-grid__item--fluid m-wrapper">
    <div class="m-content">
      <div class="row">
        <div class="col-md-10 offset-1">

          <h4 class="m--font-dark">
            All Crew
          </h4>

          <b-tabs v-if="crewGroupsList && (crewGroupsList.items.length || crewGroupsList.noGroup.length || findMembers())"
                  v-model="activeTab"
                  nav-class="nav nav-tabs m-tabs-line m-tabs-line--info"
                  class="without-border">

            <b-tab
              :title="`<span class='custom-icon member-icon'></span> Crew Members <span class='m--font-grey'>(` + (membersLength + crewGroupsList.noGroup.length) + `)</span>`">

              <div class="m--margin-top-30">
                <div
                  class="m-accordion m-accordion--default m-accordion--solid m-accordion--section m-accordion--toggle-arrow double-table">

                  <b-card no-body class="m-accordion__item no-padding-card"
                          v-if="crewGroupsList.noGroup.length">
                    <b-card-header header-tag="header" class="m-accordion__item-head" role="tab">
                      <b-btn block v-b-toggle="'ungrouped'"
                             class="text-left m--font-boldest m--font-transform-u m-accordion__item-title">
                        <div class="row no-gutters align-items-center">
                          <div class="col">
                            Ungrouped
                            <span class="m--font-grey">({{crewGroupsList.noGroup.length}})</span>
                          </div>
                          <div>
                            <i class="la la-angle-down"></i>
                          </div>

                        </div>
                      </b-btn>
                    </b-card-header>
                    <b-collapse :id="'ungrouped'"
                                visible
                                @hide="resetMember"
                                accordion="my-accordion"
                                role="tabpanel">
                      <b-card-body>
                        <member-table-list
                          :items="crewGroupsList.noGroup.members = crewGroupsList.noGroup"
                          :group="crewGroupsList.noGroup"
                          :groupId="'ungroupe'"
                          :activeMemberDetails="createMemberModal.user"
                          @deleteMember="deleteMember">
                        </member-table-list>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                  <b-card no-body class="m-accordion__item no-padding-card"
                          v-for="(crewGroup, groupIndex) in crewGroupsList.items"
                          v-if="crewGroup.members.length"
                          v-bind:key="crewGroup.id">
                    <b-card-header header-tag="header" class="m-accordion__item-head" role="tab">
                      <b-btn block v-b-toggle="'accordion'+ groupIndex"
                             class="text-left m--font-boldest m--font-transform-u m-accordion__item-title">
                        <div class="row no-gutters align-items-center">
                          <div class="col">
                            {{crewGroup.name}}
                            <span class="m--font-grey">({{crewGroup.members.length}})</span>
                          </div>
                          <div class="col-auto">
                            <span v-if="crewGroup.startDate && crewGroup.endDate"
                                  :class="{
                                  'btn-success': crewGroup.status === 'arrived' || crewGroup.status === 'finished',
                                  'btn-metal': crewGroup.status === 'notStarted',
                                  'btn-danger': crewGroup.status === 'late',
                                  'btn-primary': crewGroup.status === 'inProgress'
                                }"
                                  class="dates-status btn btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">

                              <i v-if="crewGroup.status === 'notStarted'" class="m--font-light font-11 la la-pause"></i>
                              <i v-if="crewGroup.status === 'late'" class="m--font-light font-11 la la-close"></i>
                              <i v-if="crewGroup.status === 'inProgress'" class="m--font-light font-11 la la-arrow-right"></i>
                              <i v-if="crewGroup.status === 'arrived' || crewGroup.status === 'finished'" class="m--font-light font-11 la la-check"></i>

                            </span>
                          </div>
                          <div>
                              <span v-if="crewGroup.direction !== 'unspecified'" class="btn btn-sm m--margin-left-10"
                                    :class="{
                                    'btn-primary': crewGroup.direction === 'on',
                                    'btn-metal': crewGroup.direction === 'off'
                                  }">
                                {{crewGroup.direction}}
                              </span>
                            <i class="la la-angle-down"></i>
                          </div>

                        </div>
                      </b-btn>
                    </b-card-header>


                    <b-collapse :id="'accordion' + groupIndex"
                                visible
                                @hide="resetMember"
                                accordion="my-accordion"
                                role="tabpanel">
                      <b-card-body>
                        <member-table-list
                          :items="crewGroup.members"
                          :group="crewGroup"
                          :groupId="crewGroup.id"
                          :activeMemberDetails="createMemberModal.user"
                          @deleteMember="deleteMember">
                        </member-table-list>

                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>

              </div>
            </b-tab>

            <b-tab title="<span class='custom-icon map-icon'></span> Map">
              <member-map v-if="(activeTab === 1) && mapStops.length"
                          :stops="mapStops">
              </member-map>
              <div v-else class="m-portlet m--margin-top-30 double-table">
                <no-info></no-info>
              </div>
            </b-tab>

            <b-tab :title="`<span class='custom-icon alerts-icon'><span class='badge badge_message  ${!crewUnreadAlerts || superAdmin? 'hide': ''}'>${crewUnreadAlerts}</span></span> Alerts`">
              <member-alerts v-if="activeTab === 2"></member-alerts>
            </b-tab>

          </b-tabs>

          <div class="m-portlet m--margin-top-30"
               v-if="crewGroupsList && !crewGroupsList.items.length && !crewGroupsList.noGroup.length && !findMembers() && (activeTab === 0)">

            <div class="row">
              <div class="col">
                <no-info :crew-tab="true"></no-info>
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
  import noInfo from '../../../components/crewManager/no-info'
  import newGroup from '../../../components/modals/newGroup'
  import memberTableList from '../../../components/member/tableList'
  import memberMap from '../../../components/member/member-map'
  import memberAlerts from '../../../components/member/alerts'
  import cloneDeep from 'lodash/cloneDeep'
  export default {
    // perimisions <CrewAdmin>, <CrewManager>

    fetch ({store, route}) {
      return store.dispatch('getCrewGroupList', route.params.crewId)
    },
    computed: mapState([
      'nationalityList',
      'crewGroupsList',
      'crewDetails',
      'crewUnreadAlerts',
      'superAdmin',
      'createMemberModal'
    ]),
    watch: {
      crewUnreadAlerts () {
        if (this.activeTab === 4) {
          this.$store.commit('ADD_FIREBASE_ALERTS', {type: 'crew', id: this.crewId})

          const val = {
            crewId: this.$route.params.crewId
          }
          const data = {
            string: $.param(val),
            ...val
          }
          this.$store.dispatch('readAlerts', data)
        }
      }
    },
    data () {
      return {
        activeTab: 0,
        mapStops: [],
        crewId: this.$route.params.crewId,
        membersLength: null
      }
    },
    mounted: function() {
      this.countMembers()
      this.findStops()
    },
    methods: {
      findMembers() {
        return this.crewGroupsList.items.some((group) => {
          if (group.members.length) return true
        })
      },
      findStops () {
        if (!this.crewGroupsList.items) return
        const groupItems = cloneDeep(this.crewGroupsList.items)

        groupItems.some((group) => {
          if (!group.members.length) return
          group.members.forEach((member) => {
            if (!member.stops.length) return
            member.stops.reverse().some((stop) => {

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
        })
      },
      countMembers () {
        this.crewGroupsList.items.forEach((item) => {
          if (item.members) {
            this.membersLength += item.members.length
          }
        })
      },
      deleteMember (ev, id) {
        ev.preventDefault()
        this.$store.dispatch('deleteMember', {crewId: this.crewId, memberId: id})
          .then(() => {
            this.resetMember()
            this.$store.dispatch('getCrewGroupList', this.crewId)
          })
      },
      resetHighlightStatus(member){
        member._rowVariant = null
        if(this.createMemberModal.id === member.id) {return}
      },
      resetMember () {
        if(this.createMemberModal.open) {
          this.crewGroupsList.noGroup.some((member)=> {
            this.resetHighlightStatus(member)
          })
          this.crewGroupsList.items.some((group) => {
            if (!group.members.length) return

            group.members.some((member) => {
              return this.resetHighlightStatus(member);
            })
          })
        }

        this.$store.dispatch('setActiveMemberDetails', null)
      },
    },
    components: {
      noInfo,
      memberAlerts,
      memberTableList,
      newGroup,
      memberMap
    },
    layout: 'crew-details',
    head () {
      return {
        title: (this.crewDetails ? this.crewDetails.name : 'Crew') + ' details'
      }
    },
    name: 'manage-crew-changes-details'
  }
</script>

<style lang="sass" scoped>
  @import '../../../assets/scss/crew/crew-details'
</style>
