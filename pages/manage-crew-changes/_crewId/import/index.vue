<template>
  <!--CONTENT-->
  <div>

    <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">

      <div class="m-content import">

        <div class="row">

          <div class="col-md-10 offset-1 m--margin-bottom-40">

            <!--import__back-->
            <nuxt-link class="import__back link-icon" :to="('/manage-crew-changes/' + crewId + '')">
              <i class="font-21 la la-angle-left"></i>Import Crew Change
            </nuxt-link>
            <!--/import__back-->

          </div>

        </div>

        <!--import__steps-->
        <div class="import__steps">

          <div class="row">

            <div class="col-md-10 offset-1">

              <div class="import__steps-item"
                   @click="nextStep(0)"
                   :class="{'active': step === 0, 'last': step > 0}">
                <i class="la la-check"></i>
                File Upload
              </div>

              <div class="import__steps-item"
                   :class="{'active': step === 1, 'last': step > 1}">
                Field Matching
              </div>

            </div>

          </div>

        </div>
        <!--/import__steps-->

        <div class="row">

          <div class="col-md-10 offset-1">

            <div class="m-portlet m--padding-40">

              <div class="row">

                <div class="col-md-12">

                  <upload v-if="step === 0"
                          :id="crewId"
                          :step="nextStep"/>

                  <file-matching v-if="step === 1"
                                 :step="nextStep"
                                 :matchingObj="matchingObj"
                                 :id="crewId"/>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import upload from '../../../../components/import/upload'
  import fileMatching from '../../../../components/import/field-matching'

  export default {
    name: 'crew-import',
    layout: 'default',
    components: {upload, fileMatching},
    computed: mapState(['matchingObj']),
    data() {
      return {
        step: 0,
        crewId: this.$route.params.crewId,
      }
    },
    methods: {
      nextStep( step ) {
        this.step = step
      }
    },
    head() {
      return {
        title: 'Import Crew'
      }
    },
  }
</script>

<style lang="scss">
  @import '../../../../assets/scss/import/index';
</style>
