<template>
  <div class="m-portlet m--margin-top-30">
    <div class="alerts-content" v-if="alertsList && alertsList.items.length">
      <b-list-group>
        <b-list-group-item v-for="(alertInfo, index) in alertsList.items" v-bind:key="index">
          <alert-content :groupId="groupId" :alert="alertInfo"></alert-content>
        </b-list-group-item>
      </b-list-group>

      <div class="row no-gutters justify-content-center m--padding-top-30 m--padding-bottom-30"
           v-if="alertsList.recordsLeft">
        <div class="col-auto">
          <button
            @click="loadMore"
            class="btn m-btn m-btn--wide m--font-transform-u m--font-boldest2 btn-outline-info"
            type="button">
            Load more
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <no-info></no-info>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import noInfo from '../../components/crewManager/no-info'
  import alertContent from './alertComponents/alertContent'
  import last from 'lodash/last'

  export default {
    mounted: function () {
      this.$store.commit('RESET_ALERTS_LIST');
      this.getAlerts()
        .then(() => {
          this.setReadAlerst()
        })
    },
    data () {
      let requestData = {
        crewId: this.$route.params.crewId
      };
      if (this.$route.params.groupId) {
        requestData.crewGroupId = this.$route.params.groupId
      }

      return {
        requestData: requestData,
        groupId: this.$route.params.groupId
      }
    },

    methods: {
      loadMore () {
        this.requestData.fromTime = last(this.alertsList.items).createdAt
        this.$store.dispatch('getAlertsList', $.param(this.requestData))
      },
      setReadAlerst () {
        let val = {}

        if(this.$route.params.crewId) {
          val.crewId = this.$route.params.crewId
        }
        if(this.$route.params.groupId) {
          val.crewGroupId = this.$route.params.groupId
        }
        const data = {
          string: $.param(val),
          ...val
        }
        this.$store.dispatch('readAlerts', data)
      },
      getAlerts () {
        return this.$store.dispatch('getAlertsList', $.param(this.requestData))
      }
    },
    beforeDestroy: function () {
      this.$store.commit('RESET_ALERTS_LIST')
    },
    components: {
      noInfo,
      alertContent
    },
    computed: mapState([
      'alertsList'
    ]),
    name: 'alerts'
  }
</script>

<style lang="scss">
  @import '../../assets/scss/crew/alerts.scss';
</style>

