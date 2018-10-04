<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">

    <div class="m-grid__item m-grid__item--fluid m-wrapper">
      <div class="m-content">

        <div class="row no-gutters">
          <div class="col-md-10 offset-1">

            <h4 class="m--font-dark">
              Settings
            </h4>

            <b-tabs nav-class="m--margin-top-20 nav nav-tabs m-tabs-line m-tabs-line--info"
                    class="without-border">

              <b-tab :title="`<span class='custom-icon info-icon'></span> Information`">
                <settings-info></settings-info>
              </b-tab>

              <b-tab :title="`<span class='custom-icon manage-icon'></span> Manage Crew Managers`" v-if="roles.isAdmin(currentUser)">
                <managers></managers>
              </b-tab>

              <b-tab :title="`<span class='custom-icon payments-icon'></span> Payment`" v-if="roles.isAdmin(currentUser)">
                <settings-payment></settings-payment>
              </b-tab>

            </b-tabs>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import managers from '../../components/settings/managers'
  import settingsInfo from '../../components/settings/info'
  import settingsPayment from '../../components/settings/payment'
  import checkRoles from '../../services/checkRoles'
  import axios from 'axios'
  import { mapState } from 'vuex'

  export default {
    components: {
      settingsInfo,
      settingsPayment,
      managers
    },
    computed: mapState([
      'currentUser'
    ]),
    fetch({store}){
      return axios.all([
        store.dispatch('getNotifPreference'),
        store.dispatch('getManagers'),
        store.dispatch('getTimezoneList'),
        store.dispatch('getCountries'),
        store.dispatch('getPayment')
      ])
    },
    data() {
      return {
        roles: checkRoles
      }
    },
    name: 'settings'
  }
</script>

<style lang="sass">
  @import '../../assets/scss/settings/index'
</style>
