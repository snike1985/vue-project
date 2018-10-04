<template>
  <div class="row no-gutters align-items-center one-alert" :class="{'unread': !alert.read}">
    <div class="col-auto">
      <div class="icon m--margin-right-20" v-if="alert.data.statusInfo">
        <img v-if="alert.data.statusInfo.newStatus === 'late'" src="/images/icons/alert1.svg" alt="">
        <img v-if="alert.data.statusInfo.newStatus === 'inProgress'"
             src="/images/icons/alert2.svg" alt="">
        <img v-if="alert.data.statusInfo.newStatus === 'finished' || alert.data.statusInfo.newStatus === 'arrived'" src="/images/icons/alert3.svg" alt="">
        <span v-if="alert.data.statusInfo.newStatus === 'cancelled'">
          <i class="font-22 m--font-danger la la-close"></i>
        </span>
        <span v-if="alert.data.statusInfo.newStatus === 'notStarted'">
          <i class="font-22 m--font-warning la la-exclamation-triangle"></i>
        </span>
      </div>

      <div class="icon m--margin-right-20" v-if="alert.type === 'weatherAlert' || alert.type === 'memberAlert'">
        <i class="font-22 m--font-warning la la-exclamation-triangle"></i>
      </div>

      <div class="icon m--margin-right-20"
           v-if="
            alert.type === 'billingPaymentUnsuccessful' ||
            alert.type === 'billingPaymentSuccessful' ||
            alert.type === 'billingPlanExpires' ||
            alert.type === 'billingMembersLimit'
           ">
        <i class="font-22 m--font-grey la la-money"
           :class="{
             'm--font-danger': alert.type === 'billingPaymentUnsuccessful',
             'm--font-warning': alert.type === 'billingMembersLimit' || alert.type === 'billingPlanExpires',
             'm--font-success': alert.type === 'billingPaymentSuccessful'
           }">
        </i>
      </div>
      <div class="icon m--margin-right-20" v-if="alert.type === 'memberCheckInTimeUpcoming'">
        <i class="font-22 m--font-warning la la-clock-o"></i>
      </div>
    </div>
    <div class="col">
      <!--weatherAlert-->
      <div v-if="alert.type === 'weatherAlert'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Weather / Security Alert
        </div>
        <div>
          Weather / Security Alert related to
          <span class="m--font-boldest2">{{alert.data.stop.name}}</span>

          {{alert.data.stop.dateTime * 1000 | date('DD.MM.YYYY', currentUser.timeZone ? currentUser.timeZone.name : null)}} <br>
          received - <a target="_blank" :href="alert.data.alarmLink">See Here</a>
        </div>
      </div>

      <!--crewStatusChange-->
      <div v-if="alert.type === 'crewStatusChange'">

        <alert-title-status :status="alert.data.statusInfo"></alert-title-status>

        <div>
            Crew Change <nuxt-link :to="'/manage-crew-changes/' + alert.crew.id">{{alert.crew.name}}</nuxt-link>

          <alert-status :status="alert.data.statusInfo"></alert-status>

        </div>
      </div>

      <!--crewGroupStatusChange-->
      <div v-else-if="alert.type === 'crewGroupStatusChange'">
        <alert-title-status :status="alert.data.statusInfo"></alert-title-status>
        <div>
          Group <nuxt-link :to="'/manage-crew-changes/' + alert.crew.id +'/group/' + alert.crewGroup.id">{{alert.crewGroup.name}}</nuxt-link>
          <alert-status :status="alert.data.statusInfo"></alert-status>
        </div>
      </div>

      <!--memberStatusChange-->
      <div v-if="alert.type === 'memberStatusChange'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Member Status Change
        </div>
        <div>
          <span><b class="m--font-boldest2">{{alert.data.member.name}}</b></span>&nbsp;
          <span v-if="!groupId">
            from <nuxt-link :to="'/manage-crew-changes/' + alert.crew.id +'/group/' + alert.crewGroup.id">{{alert.crewGroup.name}}</nuxt-link>
          </span>
          <span v-if="alert.data.statusInfo">
            <span v-if="alert.data.statusInfo.newStatus === 'finished' || alert.data.statusInfo.newStatus === 'arrived'">
              has arrived at final destination.
            </span>
            <span v-else-if="alert.data.statusInfo.newStatus === 'late'">
              is late to <span class="m--font-boldest2">{{alert.data.stop.name}}</span>.
            </span>
            <span
              v-else-if="alert.data.statusInfo.newStatus === 'inProgress'">
              has started the trip.
            </span>
            <span v-if="alert.data.statusInfo.newStatus === 'notStarted'">
              not started yet.
            </span>
          </span>
        </div>
      </div>

      <!--memberAlert-->
      <div v-else-if="alert.type === 'memberAlert'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Member Alert
        </div>
        <div>
          <b class="m--font-boldest2">{{alert.data.member.name}}</b> from <nuxt-link :to="'/manage-crew-changes/' + alert.crew.id +'/group/' + alert.crewGroup.id">{{alert.crewGroup.name}}</nuxt-link>
          is asking you to join the chat.
        </div>
      </div>

      <!--billingPaymentUnsuccessful-->
      <div v-else-if="alert.type === 'billingPaymentUnsuccessful'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Payment error
        </div>
        <div>
          Payment due on {{alert.data.payment.createdAt * 1000 | date('HH:mm DD.MM.YYYY ', (currentUser.timeZone ? currentUser.timeZone.name : ''))}} was not processed successfully.
        </div>
      </div>

      <!--billingPaymentSuccessful-->
      <div v-else-if="alert.type === 'billingPaymentSuccessful'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Payment done
        </div>
        <div>
          Payment due on {{alert.data.payment.createdAt * 1000 | date('HH:mm DD.MM.YYYY ', (currentUser.timeZone ? currentUser.timeZone.name : ''))}} was processed successfully.
        </div>
      </div>

      <!--billingPlanExpires-->
      <div v-else-if="alert.type === 'billingPlanExpires'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Subscription payment
        </div>
        <div>
          Payment due on {{alert.data.payment.createdAt * 1000 | date('HH:mm DD.MM.YYYY ', (currentUser.timeZone ? currentUser.timeZone.name : ''))}} was successfully processed.
        </div>
      </div>

      <!--billingPlanExpires-->
      <div v-else-if="alert.type === 'billingMembersLimit'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Limit exceeded
        </div>
        <div>
          Crew members limit of selected Subscription Plan is exceeded.
        </div>
      </div>

      <!--memberCheckInTimeUpcoming-->
      <div v-else-if="alert.type === 'memberCheckInTimeUpcoming'">
        <div class="status m--font-dark m--font-boldest2 m--font-transform-c">
          Member CheckIn Time Upcoming
        </div>
        <div>
          <span><b class="m--font-boldest2">{{alert.data.member.name}}</b></span>&nbsp;
          <span v-if="!groupId">
            from <nuxt-link :to="'/manage-crew-changes/' + alert.crew.id +'/group/' + alert.crewGroup.id">{{alert.crewGroup.name}}</nuxt-link>
          </span>
        </div>
      </div>

    </div>
    <div class="col-auto">
      <div>
        <span class="m--font-grey m--margin-right-20">
          {{alert.updatedAt * 1000 | date('DD.MM.YYYY', (currentUser.timeZone ? currentUser.timeZone.name : ''))}}
        </span>
        <span class="m--font-grey">
          {{alert.updatedAt * 1000 | date('HH:mm', (currentUser.timeZone ? currentUser.timeZone.name : ''))}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import alertStatus from './alertStatus'
  import alertTitleStatus from './alertTitleStatus'

  export default {
    props: ['alert', 'groupId', 'type'],
    name: 'alertContent',
    computed: mapState([
      'currentUser'
    ]),
    components: {
      alertTitleStatus,
      alertStatus
    },
  }
</script>

<style scoped>

</style>
