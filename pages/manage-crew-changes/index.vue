<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
    <error-form
      :show="errorShow"
      :errorMessage="errorMessage"
      :absolute="true"
      @closeError="closeError"/>
    <div class="container m--padding-top-30">
      <div class="row justify-content-between align-items-center">
        <div class="col-md-3">
          <h4 class="m--font-dark">
            Manage Crew Change
          </h4>
        </div>

        <div class="col-md-4 text-right">

          <div class="m--block-inline">
            <button class="btn btn-info create-crew-btn m-btn--icon-left m--font-boldest2 m--font-transform-u"
                    @click="openCreateCrew">
              <i class="la la-plus-circle opacity-4"></i>
              <span>Create Crew Change</span>
            </button>
          </div>

        </div>
      </div>
      <div class="m-portlet m--margin-top-30" v-if="!crewList.items.length && !formString">
        <div class="row">
          <div class="col">
            <no-info></no-info>
          </div>
        </div>
      </div>

      <div v-if="crewList.items.length || formString" class="m-portlet m--margin-top-30">
        <div class="m-portlet__body">
          <b-form class="m-form" novalidate>
            <div class="row" :class="{'align-items-end': superAdmin}">
              <div class="col">
                <div class="row">
                  <div :class="superAdmin ? 'col-auto max-w-300': 'col'">

                    <div class="">
                      <b-form-group class="m-form__group">
                        <b-form-input id="name"
                                      type="text"
                                      v-model="form.name"
                                      required
                                      name="name"
                                      class="m-input"
                                      placeholder="Name">
                        </b-form-input>
                      </b-form-group>
                    </div>

                    <div class="m--margin-top-15" v-if="superAdmin">
                      <div class="row">
                        <div class="col-6">
                          <b-form-group class="m-form__group"
                                        label="# People From:"
                                        label-for="fromPeople">
                            <the-mask id="fromPeople"
                                      type="text"
                                      v-model="form.fromPeople"
                                      required
                                      name="fromPeople"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="From">
                            </the-mask>
                          </b-form-group>
                        </div>

                        <div class="col-6">
                          <b-form-group class="m-form__group"
                                        label="# People To:"
                                        label-for="toPeople">
                            <the-mask id="toPeople"
                                      type="text"
                                      v-model="form.toPeople"
                                      required
                                      name="toPeople"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="To">
                            </the-mask>
                          </b-form-group>
                        </div>
                      </div>
                    </div>


                  </div>

                  <div :class="superAdmin ? 'col-auto max-w-300': 'col'">
                    <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100" id="status"
                                :text="'Status:  ' + select.selected">
                      <b-dropdown-item v-for="option in select.options" v-bind:key="option.val"
                                       v-on:click="changeStatusFilter(option.id)">{{option.label}}
                      </b-dropdown-item>
                    </b-dropdown>

                    <div class="m--margin-top-15" v-if="superAdmin">
                      <div class="row">
                        <div class="col-6">
                          <b-form-group class="m-form__group"
                                        label="# Groups From:"
                                        label-for="fromGroup">
                            <the-mask id="fromGroup"
                                      type="text"
                                      v-model="form.fromGroups"
                                      required
                                      name="fromGroup"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="From">
                            </the-mask>
                          </b-form-group>
                        </div>

                        <div class="col-6">
                          <b-form-group class="m-form__group"
                                        label="# Groups To:"
                                        label-for="toGroup">
                            <the-mask id="toGroup"
                                      type="text"
                                      v-model="form.toGroups"
                                      required
                                      name="toGroup"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="To">
                            </the-mask>
                          </b-form-group>
                        </div>
                      </div>
                    </div>


                  </div>

                  <div class="col">
                    <div class="">
                      <div class="datepicker-container">
                        <div class="input-wrapp">
                          <input type='text'
                                 class="form-control pull-right"
                                 id="m_daterangepicker_1"
                                 value=""
                                 readonly
                                 placeholder="dd.mm.yyyy">
                        </div>
                      </div>
                      <div class="clearfix"></div>
                    </div>

                    <div class="m--margin-top-15" v-if="superAdmin">
                      <b-form-group class="m-form__group"
                                    label="Company Name:"
                                    label-for="company">
                        <b-form-input id="company"
                                      type="text"
                                      v-model="form.company"
                                      required
                                      name="company"
                                      class="m-input"
                                      placeholder="Company Name">
                        </b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-btn">
                <button
                  @click="searchCrew"
                  class="btn m-btn m--font-transform-u m--font-boldest2 btn-info"
                  type="button">
                  SEARCH
                </button>
              </div>
              <div class="col-btn">
                <button
                  @click="resetSearch"
                  class="btn m-btn m--font-transform-u m--font-boldest2 btn-dark m--font-light"
                  type="button">
                  RESET
                </button>
              </div>
            </div>
          </b-form>
        </div>
      </div>

      <div v-if="crewList.items.length || formString" class="m-datatable m-datatable--default">
        <div class="row align-items-center">
          <div class="col">
            <button
              @click="exportCrew()"
              class="btn m-btn m--font-transform-u m--font-boldest2 btn-outline-info m--font-dark m-btn--icon m-btn--icon-left">
              <span>
                <i class="la la-download"></i>
                <span>
                  Export Shown Crew Changes
                </span>
              </span>
            </button>
          </div>
          <div class="col">
            <div class="row no-gutters align-items-center justify-content-end">
              <div>
                <table-result class="m--font-grey" :total="crewList.total"></table-result>
              </div>

              <b-pagination-nav
                class="m--margin-left-30"
                v-if="crewList.items.length && crewList.total > 25"
                :link-gen="linkGen"
                base-url="/manage-crew-changes"
                :use-router="true"
                :number-of-pages="Math.ceil(crewList.total / crewList.perPage)"
                v-model="crewList.page"/>

            </div>
          </div>

        </div>

        <div class="m-portlet m--margin-top-30">
          <div class="row m--margin-top-30">
            <div class="col">
              <b-table
                hover
                @sort-changed="sortChanged"
                :fields="crewTableFields"
                :items="crewList.items"
                :sort-by.sync="sortBy"
                :no-local-sorting="true"
                v-if="crewList.items.length"
                v-bind:class="{
                  'fixed-col-6': superAdmin,
                  'fixed-col-3': !superAdmin
                }"
                class="table crew-manage-table  crew-table m-table m-table--head-bg-light table-with-shadow">

                <template slot="c.name" slot-scope="data">
                  <nuxt-link class="m--font-boldest2 m--font-blue" :to="`/manage-crew-changes/${data.item.id}`">
                    {{data.item.name}}
                  </nuxt-link>
                </template>

                <template slot="c.startDate" slot-scope="data">
                  <span v-if="data.item.startDate && data.item.endDate">
                    {{data.item.startDate * 1000 | date('DD.MM.YYYY')}} - {{data.item.endDate * 1000 | date('DD.MM.YYYY')}}
                  </span>
                  <span class="m--font-grey" v-else>
                    dates not set
                  </span>
                </template>

                <template slot="c.status" slot-scope="data">
                  <span class="row no-gutters align-items-center" v-if="data.item.status === 'notStarted'">
                    <div class="col-md-6">
                      <span
                        class="no-cursor m--margin-right-10 btn btn-metal btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                        <i class="m--font-light font-11 la la-pause"></i>
                      </span>
                      <span>Not Started</span>
                    </div>

                    <div class="col-md-6">
                      <div v-if="admin">
                        <crew-status-button
                          @onCopy="duplicateCrew(data.item)"
                          @changeStatus="changeStatus"
                          :crew="data.item"
                        />
                      </div>
                    </div>
                  </span>

                  <span class="row no-gutters align-items-center" v-if="data.item.status === 'importing'">
                    <span>Importing</span>
                  </span>

                  <span class="row no-gutters align-items-center" v-if="data.item.status === 'late'">
                    <div class="col-md-6">
                      <span
                        class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                        <i class="m--font-light font-11 la la-close"></i>
                      </span>
                      <span>Late</span>
                    </div>
                    <div class="col-md-6">
                       <div v-if="admin">
                        <crew-status-button
                          @onCopy="duplicateCrew(data.item)"
                          @changeStatus="changeStatus"
                          :crew="data.item"
                        />
                      </div>
                    </div>
                  </span>

                  <span class="row no-gutters align-items-center" v-if="data.item.status === 'cancelled'">
                    <span
                      class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                      <i class="m--font-light font-11 la la-close"></i>
                    </span>
                    <span>Cancelled</span>
                  </span>

                  <span class="row no-gutters align-items-center" v-if="data.item.status === 'finished'">
                    <span
                      class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                      <i class="m--font-light font-11 la la-check"></i>
                    </span>
                    <span>Finished</span>
                  </span>

                  <span class="row no-gutters align-items-center" v-if="data.item.status === 'inProgress'">
                    <div class="col-md-6">
                      <span
                        class="no-cursor m--margin-right-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                        <i class="m--font-light font-10 la la-arrow-right"></i>
                      </span>
                      <span>In Progress</span>
                    </div>

                    <div class="col-md-6">
                      <div v-if="admin">
                        <crew-status-button
                          @onCopy="duplicateCrew(data.item)"
                          @changeStatus="changeStatus"
                          :crew="data.item"
                        />
                      </div>
                    </div>


                  </span>

                </template>

                <template slot="company.name" slot-scope="data">
                  {{data.item.companyName}}
                </template>

                <template slot="groupsCount" slot-scope="data">
                  <processingEmptyVal class="text-center" :val="data.item.groupsCount"></processingEmptyVal>
                </template>

                <template slot="peopleCount" slot-scope="data">
                  <processingEmptyVal class="text-center" :val="data.item.peopleCount"></processingEmptyVal>
                </template>

                <template slot="edit" slot-scope="data">
                  <table-btns @edit="editCrew(data.item)"
                              @onCopy="duplicateCrew(data.item)"
                              :item="data.item"
                              deleteText="Are you sure you want <br> to delete this crew change?"
                              deleteBtn="Yes, delete crew"
                              @delete="deleteCrew(data.item.id)"
                              @login="login(data.item)"
                              :showCopy="true">
                  </table-btns>
                </template>

              </b-table>

              <no-info v-if="formString && !crewList.items.length"/>
            </div>
          </div>
        </div>

        <div v-if="crewList.items.length || formString" class="m--margin-bottom-30 m-datatable m-datatable--default">
          <div class="row align-items-center">

            <div class="col">
              <div class="row no-gutters align-items-center justify-content-end">
                <div>
                  <table-result class="m--font-grey" :total="crewList.total"></table-result>
                </div>

                <b-pagination-nav
                  class="m--margin-left-30"
                  v-if="crewList.items.length && crewList.total > 25"
                  :link-gen="linkGen"
                  base-url="/manage-crew-changes"
                  :use-router="true"
                  :number-of-pages="Math.ceil(crewList.total / crewList.perPage)"
                  v-model="crewList.page"/>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- the modal -->
      <add-crew v-if="newCrewModal.open"
                :show="newCrewModal.open"
                :edit="newCrewModal.edit"
                :crew="newCrewModal.crew">
      </add-crew>

      <copy-crew v-if="copyCrewModal.open"
                 :show="copyCrewModal.open"
                 :crew="copyCrewModal.crew">
      </copy-crew>

    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import noInfo from '../../components/crewManager/no-info'
  import addCrew from '../../components/modals/addCrew'
  import copyCrew from '../../components/modals/copyCrew'
  import findIndex from 'lodash/findIndex'
  import cloneDeep from 'lodash/cloneDeep'
  import errorForm from '../../components/Error'
  import crewStatusButton from '../../components/crewManager/crew-status-button'
  import processingEmptyVal from '../../components/processingEmptyVal'
  import tableBtns from '../../components/admin/table-btns'
  import VueCookie from 'vue-cookie'
  import tableResult from '../../components/table-result'

  export default {

    // perimisions <CrewAdmin>, <CrewManager>.

    fetch ({store, route}) {
      const params = store.getters.checkQuery(route.query)
      return store.dispatch('getCrewList', {search: params})
    },
    computed: mapState([
      'crewList',
      'admin',
      'superAdmin',
      'currentUser',
      'newCrewModal',
      'copyCrewModal'
    ]),
    watch: {
      $route (val) {
        let params = {}
        if (this.formString) {
          params = this.formString
        }
        if (val.query.page) {
          params += '&page=' + val.query.page
        }

        this.$store.dispatch('getCrewList', {search: params})
      },
      'newCrewModal.open' (val) {
        if (!val) {
          this.crewList.items.push()
        }
      },
      'copyCrewModal.open' (val) {
        if (!val) {
          this.crewList.items.push()
        }
      }
    },
    data () {
      const defaultTable = {
        'c.name': {
          label: 'Name',
          sortable: true
        },
        'c.startDate': {
          label: 'dates',
          sortable: true
        },
        'c.status': {
          label: 'status',
          sortable: true
        }
      }
      return {
        sortBy: null,
        cvsData: '',
        status: 'not_accepted',
        formString: null,
        errorMessage: null,
        errorShow: false,
        activePage: this.$route.query.page,
        crewAdminTable: {
          peopleCount: {
            label: '# Members',
            sortable: true
          },
          groupsCount: {
            label: '# Groups',
            sortable: true
          },
          'company.name': {
            label: 'Company Name',
            sortable: true
          },
          edit: {
            label: ' '
          }
        },
        defaultTable: cloneDeep(defaultTable),
        crewTableFields: cloneDeep(defaultTable),
        form: {
          name: this.$route.query.name || '',
          status: '',
          startDate: '',
          endDate: '',
          company: '',
          fromPeople: '',
          toPeople: '',
          fromGroups: '',
          toGroups: ''
        },
        select: {
          selected: 'All',
          options: [
            {id: 0, val: 'all', label: 'All'},
            {id: 1, val: 'notStarted', label: 'Not Started'},
            {id: 2, val: 'finished', label: 'Finished'},
            {id: 3, val: 'inProgress', label: 'In Progress'},
            {id: 4, val: 'late', label: 'Late'},
            {id: 5, val: 'cancelled', label: 'Cancelled'}
          ]
        },
      }
    },
    methods: {
      editCrew (crew) {
        const data = {
          open: true,
          edit: true,
          crew
        }
        this.$store.dispatch('createCrewModal', data)
      },
      login (crew) {
        this.$store.dispatch('getUserAdminId', crew.companyId)
          .then((res) => {
            VueCookie.set('auth_token', res.apiKey)
            this.$store.commit('SET_AUTH_TOKEN', res.apiKey)

            this.$store.dispatch('getUser')
              .then(() => {
                this.crewTableFields = cloneDeep(this.defaultTable)
                this.$router.push({name: 'manage-crew-changes'})
                this.resetSearch()
                this.crewList ? this.crewList.items.push() : ''
              })

          })
      },
      deleteCrew (id) {
        console.log(id);
        this.$store.dispatch('crewDelete', id)
          .then(() => {
            this.$store.dispatch('getCrewList', this.formString)
          })
      },
      duplicateCrew (crew) {
        console.log('copy', crew);
        this.$store.dispatch('copyCrewModal', { open: true, crew })
      },
      sortChanged (ctx) {

        let search = 'sort=' + ctx.sortBy + '&direction=' + (ctx.sortDesc ? 'desc' : 'asc')

        if (this.form) {
          search += ('&' + $.param(this.form))
        }

        this.formString = search
        this.$store.dispatch('getCrewList', {search})

      },
      getExport () {
        let search = 'export=true'
        if (this.form) {
          search += ('&' + $.param(this.form))
        }

        this.$store.dispatch('getCrewList', {search, exportFile: true})
          .then((res) => {
            this.cvsData = 'data:text/csv;charset=utf-8,' + encodeURI(res)
            this.cvsData = res
          })
      },
      exportCrew () {
        const csvData = new Blob([this.cvsData], {type: 'text/csv;charset=utf-8;'})
        const csvURL = window.URL.createObjectURL(csvData)
        const tempLink = document.createElement('a')

        tempLink.href = csvURL
        tempLink.setAttribute('download', 'shown_crew_changes.csv')
        tempLink.click()
      },
      closeError () {
        this.errorShow = false
        this.errorMessage = null
      },
      linkGen (pageNum) {
        return '?page=' + pageNum
      },
      changeStatusFilter (val) {
        this.select.selected = this.select.options[val].label
        if (this.select.options[val].id === 0) {
          return this.form.status = ''
        }
        this.form.status = this.select.options[val].val
      },
      changeStatus (id, status) {
        this.$store.dispatch('changeCrewStatus', {id, status})
          .then((res) => {
            const crewIndex = findIndex(this.crewList.items, {id: id})
            this.crewList.items[crewIndex].status = res.body.status
          }).catch(reject => {
          this.errorShow = true
          this.errorMessage = reject.error.message || 'Server Error'
        })
      },
      resetSearch () {
        const emptyForm = {
          name: '',
          status: '',
          startDate: '',
          endDate: ''
        }

        $('#m_daterangepicker_1').val('')

        this.select.selected = 'All'
        this.$router.push({query: {}})
        this.form = emptyForm
        this.formString = null
        this.searchCrew()
      },
      searchCrew () {
        this.formString = $.param(this.form)
        this.$store.dispatch('getCrewList', {search: this.formString})
          .then(() => {
            this.$router.push({query: {}})
            this.getExport()
            this.sortBy = null;
          })
      },
      openCreateCrew () {
        const data = {
          open: true
        }
        this.$store.dispatch('createCrewModal', data)
      },
      setDate (start, end) {
        this.form.startDate = start.utc().format('X')
        this.form.endDate = end.utc().format('X')
      }
    },
    components: {
      noInfo,
      addCrew,
      crewStatusButton,
      errorForm,
      processingEmptyVal,
      tableBtns,
      tableResult,
      copyCrew
    },
    created: function () {
      if (this.superAdmin) {
        Object.assign(this.crewTableFields, this.crewAdminTable)
      }
    },
    mounted: function () {
      this.formString = $.param(this.$route.query)
      this.getExport()

      $('#m_daterangepicker_1, #m_daterangepicker_1_modal').daterangepicker({
        buttonClasses: 'm-btn btn',
        applyClass: 'btn-primary',
        autoUpdateInput: false,
        cancelClass: 'btn-secondary',
        locale: {
          format: 'DD.MM.YYYY'
        }
      })

      $('#m_daterangepicker_1').on('apply.daterangepicker', (ev, picker) => {
        $('#m_daterangepicker_1').val(picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY'))
        this.setDate(picker.startDate, picker.endDate)
      })
    },
    head () {
      return {
        title: 'Manage Crew Changes'
      }
    },
    name: 'manage-crew-changes'
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-manage'
</style>
