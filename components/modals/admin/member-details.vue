<template>
  <b-modal
    v-model="memberDetailsModal.open"
    id="editCompany"
    size="sm"
    :class="'medium-dialog'"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <span class="m--font-grey close-modal-btn" @click="toggleModal">
      <i class="la la-close"></i>
    </span>

    <h4 class="m--font-blue m-form m--margin-top-10 text-center m--font-boldest2">
      <span>
        {{user.name}}
      </span>
    </h4>

    <b-popover placement="bottom"
               :show.sync="showDeletePopover"
               target="deleteMember">
      <div class="light-popover delete-popover">
        <span class="m--font-grey close-modal-btn"
              @click="showDeletePopover = !showDeletePopover">
          <i class="la font-16 la-close"></i>
        </span>
        <p class="m--font-boldest">
          Are you sure you want to delete <br>
          the member
        </p>
        <button
          @click="deleteMember($event)"
          class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
          Yes, delete member
        </button>
      </div>
    </b-popover>
    <div class="row justify-content-between align-items-center m--margin-top-25">
      <div class="col-auto">
        <span class="m--font-boldest2">
          ID:
        </span>
        {{user.id}}
      </div>
      <div class="col-auto">
        <div class="row">
          <div class="col-auto m--font-boldest2">
            Group Leader:
          </div>
          {{user.leader ? 'Yes' : 'No'}}
        </div>
      </div>
      <div class="col-auto">

        <div class="row no-gutters align-items-center">
          <div class="col-auto">
            <span class="m--font-boldest2">Status: </span>
          </div>
          <div class="col">
            <span class="row no-gutters align-items-center" v-if="user.status === 'notStarted'">
              <span
                class="col-auto no-cursor m--margin-right-10 m--margin-left-10 btn btn-metal btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-11 la la-pause"></i>
              </span>
              <span class="col-auto">Not Started</span>
            </span>

            <span class="row no-gutters align-items-center" v-if="user.status === 'late'">
              <span
                class="col-auto no-cursor m--margin-right-10 m--margin-left-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-11 la la-close"></i>
              </span>
              <span class="col-auto">Late</span>
            </span>

            <span class="row no-gutters align-items-center" v-if="user.status === 'arrived'">
              <span
                class="col-auto no-cursor m--margin-right-10 m--margin-left-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-check"></i>
              </span>
              <span class="col-auto">
               Arrived
              </span>
            </span>

            <span class="row no-gutters align-items-center" v-if="user.status === 'finished'">
              <span
                class="col-auto no-cursor m--margin-right-10 m--margin-left-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-11 la la-check"></i>
              </span>
              <span class="col-auto">Finished</span>
            </span>

            <span class="row no-gutters align-items-center" v-if="user.status === 'inProgress'">
              <span
                class="col-auto no-cursor m--margin-right-10 m--margin-left-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                <i class="m--font-light font-10 la la-arrow-right"></i>
              </span>
              <span class="col-auto">In Progress</span>
            </span>
          </div>
        </div>



      </div>
    </div>

    <div class="row justify-content-between m--margin-top-20 details-head">
      <div class="col-auto">
        <span id="deleteMember"
              class="font-11 m-link m-link--state m-link--danger m--font-boldest2 m--font-transform-u">
          delete member
        </span>
      </div>

      <div class="col-auto">
        <a class="font-11 m-link m-link--state m-link--info m--font-boldest2 m--font-transform-u"
           :href="'/manage-crew-changes?name=' + user.crew.name"
           target="_blank">
          View Crew Changes
        </a>

      </div>

      <div class="col-auto" v-if="user.crewGroup">
        <a class="font-11 m-link m-link--state m-link--info m--font-boldest2 m--font-transform-u"
           :href="'/admin/manage-group-trips?name=' + user.crewGroup.name"
           target="_blank">
          View Groups
        </a>
      </div>

    </div>

    <div class="row m--margin-top-25 details-description">
      <div class="col-6">
        <div class="one-line">
          <span class="m--font-metal m--font-boldest font-12 label">
            Current Crew Change
          </span>
          <p class="font-14 m--margin-top-5 m--font-boldest2">
            {{user.crew.name}}
          </p>
        </div>
        <div class="one-line">
          <span class="m--font-metal m--font-boldest font-12 label">
            Current Agent
          </span>
          <p class="font-14 m--margin-top-5 m--font-boldest2">
            <processingEmptyVal class="m--font-dark" :val="user.agents"></processingEmptyVal>
          </p>
        </div>
        <div class="one-line">
          <span class="m--font-metal m--font-boldest font-12 label">
            Current Group
          </span>
          <p class="font-14 m--margin-top-5 m--font-boldest2">
            <processingEmptyVal class="m--font-dark" :val="user.crewGroup.name"></processingEmptyVal>
          </p>
        </div>

      </div>
      <div class="col-6">
        <div class="one-line">
          <span class="m--font-metal m--font-boldest font-12 label">
            Current Company
          </span>
          <p class="font-14 m--margin-top-5 m--font-boldest2">
            <processingEmptyVal class="m--font-dark" :val="user.crew.company ? user.crew.company.name : ''"></processingEmptyVal>
          </p>
        </div>

        <div class="one-line">
          <span class="m--font-metal m--font-boldest font-12 label">
            Passport Number
          </span>
          <p class="font-14 m--margin-top-5 m--font-boldest2">
            <processingEmptyVal class="m--font-dark" :val="user.passportNumber"></processingEmptyVal>
          </p>
        </div>

        <div class="one-line">
          <span class="m--font-metal m--font-boldest font-12 label">
            Seaman’s Book
          </span>
          <p class="font-14 m--font-dark m--margin-top-5 m--font-boldest2">
            <processingEmptyVal class="m--font-dark" :val="user.seamanBook"></processingEmptyVal>
          </p>
        </div>

      </div>

    </div>

    <div class="row no-gutters justify-content-between">

      <div class="col-auto" v-if="user.crew.company">
        <button
          class=" m--margin-top-20 font-12 btn m-btn m--font-transform-u m--font-boldest2 btn-outline-success"
          @click="loginCompany"
          type="button">
          Login as Company
        </button>
      </div>
      <div class="col-auto">
        <button
          class=" m--margin-top-20 font-12 btn m-btn m--font-transform-u m--font-boldest2 btn-outline-dark"
          @click="sendPass"
          :disabled="passSent || passError"
          v-bind:class="{'m-loader m-loader--light m-loader--right': passLoading}"
          type="button">
          <span v-if="!passSent">
            Send Password
          </span>
          <span v-if="passSent">
            Password sent
          </span>
        </button>
      </div>
    </div>
    <div v-if="passError" class="m--font-danger font-11 text-center m--margin-top-5">
      The phone number is already in use by another Member
    </div>


  </b-modal>
</template>

<script>
  import { mapState } from 'vuex'
  import processingEmptyVal from '../../processingEmptyVal'
  import VueCookie from 'vue-cookie'

  export default {
    name: 'edit-company',
    props: ['user'],
    computed: mapState([
      'memberDetailsModal'
    ]),
    data () {
      return {
        passLoading: false,
        showDeletePopover: false,
        passSent: false,
        passError: false
      }
    },
    mounted: function () {

    },
    components: {
      processingEmptyVal
    },
    methods: {
      loginCompany () {
        this.$store.dispatch('getUserAdminId', this.user.crew.company.id)
          .then((res) => {
            VueCookie.set('auth_token', res.apiKey)
            this.$store.commit('SET_AUTH_TOKEN', res.apiKey)

            this.$store.dispatch('getUser')
              .then(() => {
                this.toggleModal()
                this.$router.push({name: 'manage-crew-changes'})
              })

          })
      },
      deleteMember () {
        this.$store.dispatch('deleteMember', {crewId: this.user.crew.id, memberId: this.user.id})
          .then(() => {
            this.$root.$emit('bv::hide::popover')
            this.toggleModal()
          })
      },
      sendPass () {
        this.passLoading = true
        this.$store.dispatch('sendOnePass', this.user.id)
          .then(() => {
            this.passSent = true
          })
          .catch(() => {
            this.passError = true
          })
          .finally(() => this.passLoading = false)
      },
      toggleModal () {
        const data = {
          open: false
        }
        this.$store.commit('SET_MEMBER_DETAILS_MODAL', data)
      },

    }
  }
</script>
<style lang="sass" scoped>
  @import '../../../assets/scss/admin/member-details'
</style>
