<template>
  <div>
    <div v-if="maxStops" id="stops__wrap">

      <div class="m--margin-top-30 row no-gutters align-items-center">
        <div class="col-auto m--margin-right-30">
          <div class="row no-gutters align-items-center">
            <span class="no-cursor m--margin-right-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
              <i class="m--font-light font-10 la la-arrow-right"></i>
            </span>

            <span class="opacity-6 font-12 m--font-boldest">
              Upcoming
            </span>
          </div>
        </div>
        <div class="col-auto m--margin-right-30">
          <div class="row no-gutters align-items-center">
            <span class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
              <i class="m--font-light font-10 la la-check"></i>
            </span>

            <span class="opacity-6 font-12 m--font-boldest">
              Checked In
            </span>
          </div>
        </div>
        <div class="col-auto">
          <div class="row no-gutters align-items-center">
            <span class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
              <i class="m--font-light font-10 la la-close"></i>
            </span>

            <span class="opacity-6 font-12 m--font-boldest">
              Late
            </span>
          </div>
        </div>
      </div>
      <div class="m--margin-top-30 double-stops-table double-table"
           @scroll="$root.$emit('bv::hide::popover')">

        <b-table
          striped
          :fields="memberTableFields"
          :items="membersList"
          class="m-portlet table stops-table crew-table m-table m-table--head-bg-light">

          <template slot="HEAD_stops" slot-scope="data">
            <div class="title">
              Stops
            </div>
            <table class="stop-details-head">
              <tr>
                <th v-for="index in maxStops" v-bind:key="index">
                  <div class="stop-index">
                    {{index}}
                  </div>
                </th>
              </tr>
            </table>
          </template>

          <template slot="name" slot-scope="data">
          <span class="m--margin-right-10">
            {{data.item.name}}
          </span>
            <span class="btn font-10 m--font-boldest2 btn-blue btn-xs"
                  v-if="data.item.leader">
            Leader
          </span>
          </template>

          <template slot="stops" slot-scope="data">
            <table class="table stops-details-table">
              <tr>
                <td v-for="index in maxStops" v-bind:key="index">
                  <div class="one-stop">
                    <div class="row align-items-top no-gutters" v-if="data.item.stops[index - 1]">
                      <stop-status
                        class="m--margin-top-5"
                        :only-icon="true"
                        :status="data.item.stops[index - 1].status">
                      </stop-status>

                      <div class="col">
                        <span class="stop-name-field m--font-dark">
                          {{data.item.stops[index - 1].name}}
                        </span>

                        <span class="m--font-grey font-13"
                              v-if="!data.item.stops[index - 1].dateTimeCheckIn && (data.item.stops[index - 1].status === 'late' || data.item.stops[index - 1].status === 'upcoming')">
                          {{ data.item.stops[index - 1].dateTime * 1000 | date('DD.MM.YYYY HH:mm', currentUser.timeZone ? currentUser.timeZone.name : data.item.stops[index - 1].dateTimeTimezone.name) }}
                        </span>

                        <span class="m--font-grey font-13" v-if="data.item.stops[index - 1].dateTimeCheckIn">
                          {{ data.item.stops[index - 1].dateTimeCheckIn * 1000 | date('DD.MM.YYYY HH:mm', currentUser.timeZone ? currentUser.timeZone.name : data.item.stops[index - 1].dateTimeTimezone.name) }}
                        </span>

                        <br>

                        <span :id="'detailsPopover' + data.item.stops[index - 1].id"
                              v-if="data.item.stops[index - 1].comment"
                              @click="$event.preventDefault(); $root.$emit('bv::hide::popover')"
                              class="m--font-grey font-13 stops-comment">
                            Comments
                          </span>

                        <b-popover placement="bottom"
                                   :container="'detailsPopoverContainer' + data.item.stops[index - 1].id"
                                   :boundary="'stops__wrap'"
                                   :ref="'detailsPopover' + data.item.stops[index - 1].id"
                                   :target="'detailsPopover' + data.item.stops[index - 1].id">

                          <div class="dark-popover">
                          <span class="m--font-grey close-modal-btn"
                                @click="closePopover(data.item.stops[index - 1].id)">
                            <i class="la font-16 la-close"></i>
                          </span>
                            <div class="m--padding-right-25">
                            <span class="m--font-boldest2">
                            {{data.item.stops[index - 1].name}}
                          </span>
                              <stop-status class="m--margin-top-5"
                                           :status="data.item.stops[index - 1].status"></stop-status>
                            </div>
                            <div class="m--margin-top-15 light-popover only-block">
                              <div class="m--font-grey">
                                Comments:
                              </div>
                              <div>
                                {{data.item.stops[index - 1].comment}}
                              </div>
                            </div>
                          </div>

                        </b-popover>

                      </div>

                    </div>

                  </div>
                </td>
              </tr>
            </table>
          </template>
        </b-table>
      </div>
    </div>

    <div v-else class="m-portlet m--margin-top-30 double-table">
      <no-info></no-info>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import stopStatus from '../../components/member/stop-status'
  import noInfo from '../../components/crewManager/no-info'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    name: 'members-stops',
    computed: mapState([
      'currentUser'
    ]),
    props: ['members'],
    components: {
      stopStatus,
      noInfo
    },
    data() {
      return {
        membersList: cloneDeep(this.members),
        showDetails: false,
        maxStops: 0,
        memberTableFields: {
          name: {
            label: 'Name'
          },
          stops: {
            label: 'stops'
          }
        }
      }
    },
    mounted: function () {
      this.convertFields()
    },
    methods: {
      closePopover(id) {
        const ref = 'detailsPopover' + id;
        this.$refs[ref][0].$emit('close')
      },
      convertFields() {
        this.membersList.forEach((member, index) => {
          this.maxStops = this.maxStops < member.stops.length ? member.stops.length : this.maxStops;
          if (!member.stops.length) {
            delete this.membersList[index];
          }
        })
      }
    }
  }
</script>


<style lang="sass" scoped>
  @import '../../assets/scss/groupId/stops'
</style>
