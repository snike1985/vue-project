<template>
	<div class="no-info-container text-center">
    <img src="/images/no-info.svg" alt="">
    <h3 class="m--font-blue m--font-boldest2" v-if="!crewTab">No information</h3>
    <div v-else>
      <h3 class="m--font-blue m--font-boldest2">No crew member yet.</h3>
      <br>
      <p>
        Add crew
        <span class="m-link m-link--state m-link--info m--font-boldest2"
              @click="toggleCreateMember">
          Manually
        </span>
        or
        <nuxt-link class="m-link m-link--state m-link--info m--font-boldest2"
                   :to="('/manage-crew-changes/' + crewId + '/import')">
          Import
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
	export default {
	  props: ['crewTab'],
		name: "crew-no-info",
    data () {
      return {
        crewId: this.$route.params.crewId,
      }
    },
    methods: {
      toggleCreateMember () {
        let data = {};
        if (this.$route.params.groupId) {
          data.groupPage = true
        }
        this.$root.$emit('bv::hide::popover');
        this.$store.dispatch('openCreateMember', data)
      }
    }
	}
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/no-info'
</style>
