<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">

    <div class="m-grid__item m-grid__item--fluid m-wrapper notification-page">
      <div class="m-content">

        <div class="row no-gutters">
          <div class="col-md-10 offset-1" v-if="alertsList && alertsList.items.length">
            <h4 class="m--font-dark">
              Notifications <span class="m--font-grey">({{alertsList.items.length}})</span>
            </h4>

            <div class="notifications-list m--margin-top-30">
              <transition-group name="list">
                <div
                  class="one-notification"
                  v-for="(item, index) in alertsList.items"
                  v-bind:key="index">
                  <div class="m-portlet">
                    <alert-content :alert="item"></alert-content>
                  </div>
                </div>
              </transition-group>
            </div>
            <div class="text-center" v-if="alertsList.recordsLeft">
              <button
                @click="loadMore"
                class="manage-crew-btn btn m-btn m-btn--wide m--font-transform-u m--font-boldest2 btn-outline-info">
                Load more
              </button>
            </div>
          </div>
          <div class="col-md-10 offset-1" v-else>
            <div class="m-portlet m--margin-top-30">
              <no-info></no-info>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import noInfo from '../components/crewManager/no-info'
  import alertContent from '../components/member/alertComponents/alertContent'
  import last from 'lodash/last'

  export default {
    fetch ({store}) {
      return store.dispatch('getAlertsList')
    },
    data () {
      return {}
    },
    watch: {
      individualUnreadAlerts () {
        const data = {
          string: null,
          crewId: null,
          crewGroupId: null
        };

        this.$store.commit('ADD_FIREBASE_ALERTS', {type: 'individual'});
        this.$store.dispatch('readAlerts', data)
      }
    },
    mounted: function() {
      this.setReadAlerst();
      if (!this.alertsList) {
        this.$store.dispatch('getAlertsList')
      }
    },
    destroyed: function () {
      this.$store.commit('RESET_ALERTS_LIST');
    },
    methods: {
      setReadAlerst () {
        const data = {
          string: null,
          crewId: null,
          crewGroupId: null
        };

        this.$store.dispatch('readAlerts', data)
      },
      loadMore (ev) {
        ev.preventDefault();
        const data = {
          fromTime: last(this.alertsList.items).createdAt,
        };

        this.$store.dispatch('getAlertsList', $.param(data))
      }
    },
    components: {
      noInfo,
      alertContent
    },
    computed: mapState([
      'alertsList',
      'individualUnreadAlerts'
    ]),
    name: 'notifications'
  }
</script>

<style lang="scss">
  @import '../assets/scss/crew/alerts.scss';
  @import '../assets/scss/notifications/notifications.scss';
</style>
