<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
    <div class="container m--padding-top-30">
      <div class="row justify-content-between align-items-center">
        <div class="col-md-3">
          <h4 class="m--font-dark">
            Manage Group Trips
          </h4>
        </div>

        <div class="col" v-if="groupsList.items.length">
          <div class="row no-gutters align-items-center justify-content-end">
            <div>
                <span class="m--font-grey">
                  <table-result :total="groupsList.total"></table-result>
                </span>
            </div>

            <b-pagination-nav
              class="m--margin-left-30"
              v-if="groupsList.items.length && groupsList.total > 25"
              :link-gen="linkGen"
              base-url="/admin/manage-group-tips"
              :use-router="true"
              :number-of-pages="Math.ceil(groupsList.total / groupsList.perPage)"
              v-model="groupsList.page"/>

          </div>
        </div>
      </div>

      <div class="m-portlet m--margin-top-30" v-if="!groupsList.items.length && !formString">
        <div class="row">
          <div class="col">
            <no-info></no-info>
          </div>
        </div>
      </div>

      <div v-if="groupsList.items.length || formString" class="m-portlet m--margin-top-30">
        <div class="m-portlet__body">
          <b-form class="m-form" novalidate>
            <div class="row align-items-end">
              <div class="col">
                <div class="row">
                  <div class="col-auto">
                    <div class="min-w-300">
                      <b-form-group class="m-form__group"
                                    label="Group:"
                                    label-for="name">
                        <b-form-input id="name"
                                      type="text"
                                      v-model="form.name"
                                      required
                                      name="name"
                                      class="m-input"
                                      placeholder="Group">
                        </b-form-input>
                      </b-form-group>
                    </div>

                    <div class="min-w-300 m--margin-top-15">
                      <b-form-group class="m-form__group"
                                    label="Company:"
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

                  <div class="col">
                    <div class="row">

                      <div class="col">
                        <div class="">
                          <b-form-group class="m-form__group"
                                        label="# Crew From:"
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

                        <div class="m--margin-top-15">
                          <b-form-group class="m-form__group"
                                        label="# Crew To:"
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

                      <div class="col">
                        <div class="">
                          <b-form-group label="Status:"
                                        class="m-form__group"
                                        label-for="status">
                            <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100"
                                        id="status"
                                        :text="status.selected || 'Select'">
                              <b-dropdown-item v-for="option in status.options"
                                               v-bind:key="option.val"
                                               v-on:click="changeSelectVal(option.id, 'status', status)">
                                {{option.label}}
                              </b-dropdown-item>
                            </b-dropdown>
                          </b-form-group>
                        </div>

                        <div class="m--margin-top-15">
                          <div class="m-form__group datepicker-container">
                            <label class="col-form-label pt-0">
                              Date From - To:
                            </label>
                            <div class="input-wrapp">
                              <input type='text'
                                     class="form-control pull-right "
                                     id="m_daterangepicker_1"
                                     value=""
                                     readonly
                                     placeholder="dd.mm.yyyy">
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>


                  </div>
                </div>

              </div>
              <div class="col-btn">
                <button
                  class="btn m-btn m--font-transform-u m--font-boldest2 btn-info"
                  @click="search"
                  type="button">
                  SEARCH
                </button>
              </div>
              <div class="col-btn">
                <button
                  @click="resetSearch($event)"
                  class="btn m-btn m--font-transform-u m--font-boldest2 btn-dark m--font-light"
                  type="button">
                  RESET
                </button>
              </div>
            </div>
          </b-form>
        </div>
      </div>

      <div class="m-portlet m--margin-top-30">
        <div class="row m--margin-top-30">
          <div class="col">

            <b-table
              hover
              @sort-changed="sortChanged"
              :fields="groupsListTableFields"
              :items="groupsList.items"
              :sort-by.sync="sortBy"
              :no-local-sorting="true"
              v-if="groupsList.items.length"
              class="table fixed-col-6 crew-table m-table m-table--head-bg-light table-with-shadow">

              <template slot="c.name" slot-scope="data">
                <div class="word-break">
                  {{data.item.name}}
                </div>
              </template>

              <template slot="crew.name" slot-scope="data">
                <nuxt-link :to="'/manage-crew-changes?name=' + data.item.crewName"
                           class="word-break m--font-boldest2 m--font-blue cursor-pointer">
                  {{data.item.crewName}}
                </nuxt-link>

              </template>

              <template slot="peopleCount" slot-scope="data">
                <processingEmptyVal :val="data.item.peopleCount"></processingEmptyVal>
              </template>

              <template slot="c.status" slot-scope="data">
                <span class="row no-gutters align-items-center" v-if="data.item.status === 'notStarted'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-metal btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-11 la la-pause"></i>
                  </span>
                  <span>Not Started</span>
                </span>

                <span class="row no-gutters align-items-center" v-if="data.item.status === 'importing'">
                  <span>Importing</span>
                </span>

                <span class="row no-gutters align-items-center" v-if="data.item.status === 'late'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-11 la la-close"></i>
                  </span>
                  <span>Late</span>
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
                  <span
                    class="no-cursor m--margin-right-10 btn btn-primary btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-10 la la-arrow-right"></i>
                  </span>
                  <span>In Progress</span>
                </span>
              </template>

              <template slot="leader" slot-scope="data">
                <processingEmptyVal :val="data.item.leader"></processingEmptyVal>
              </template>

              <template slot="company.name" slot-scope="data">
                <processingEmptyVal :val="data.item.companyName"></processingEmptyVal>
              </template>

              <template slot="edit" slot-scope="data">
                <table-btns @edit="editGroup(data.item)"
                            :item="data.item"
                            deleteText="Are you sure you want <br> to delete this group?"
                            deleteBtn="Yes, delete group"
                            @delete="deleteGroup(data.item)"
                            @login="login(data.item.companyId)"
                ></table-btns>
              </template>

            </b-table>


            <no-info v-if="formString && !groupsList.items.length"/>
          </div>
        </div>
      </div>

      <div v-if="groupsList.items.length || formString" class="m--margin-bottom-30 m-datatable m-datatable--default">
        <div class="row align-items-center">

          <div class="col">
            <div class="row no-gutters align-items-center justify-content-end">
              <div>
                  <span class="m--font-grey">
                    <table-result :total="groupsList.total"></table-result>
                  </span>
              </div>

              <b-pagination-nav
                class="m--margin-left-30"
                v-if="groupsList.items.length && groupsList.total > 25"
                :link-gen="linkGen"
                base-url="/admin/manage-group-tips"
                :use-router="true"
                :number-of-pages="Math.ceil(groupsList.total / groupsList.perPage)"
                v-model="groupsList.page"/>
            </div>
          </div>

        </div>
      </div>

      <!--modals-->

      <new-group v-if="editGroupModalData.open"
                 :createGroup="editGroupModalData.open"
                 :group="editGroupModalData.group"
                 :editGroup="editGroupModalData.edit"
                 @closeCreateGroup="toggleCreateGroup">
      </new-group>

    </div>


  </div>
</template>

<script>

  import noInfo from '../../components/crewManager/no-info'
  import tableResult from '../../components/table-result'
  import { mapState } from 'vuex'
  import processingEmptyVal from '../../components/processingEmptyVal'
  import tableBtns from '../../components/admin/table-btns'
  import VueCookie from 'vue-cookie'
  import newGroup from '../../components/modals/newGroup'
  import cloneDeep from 'lodash/cloneDeep'
  import findIndex from 'lodash/findIndex'

  export default {
    fetch ({store, route}) {
      const params = store.getters.checkQuery(route.query)
      return store.dispatch('getGroupsList', params)
    },
    computed: mapState([
      'groupsList',
      'editGroupModalData'
    ]),
    mounted: function () {
      this.formString = $.param(this.$route.query)

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
    data () {

      let optionsTo = [
        {id: 1, val: 1, label: '1'},
        {id: 2, val: 2, label: '2'},
        {id: 3, val: 3, label: '3'},
        {id: 4, val: 4, label: '4'},
        {id: 5, val: 5, label: '5'},
        {id: 6, val: 6, label: '6'}
      ]
      const optionsFrom = cloneDeep(optionsTo)
      optionsFrom.unshift({id: 0, val: 0, label: '0'})

      return {
        editId: null,
        sortBy: null,
        formString: null,
        form: {
          name: this.$route.query.name || '',
          status: null,
          company: null,
          startDate: null,
          endDate: null,
          fromPeople: null,
          toPeople: null
        },
        status: {
          selected: 'All',
          options: [
            {id: 0, val: 'all', label: 'All'},
            {id: 1, val: 'notStarted', label: 'Not Started'},
            {id: 2, val: 'finished', label: 'Finished'},
            {id: 3, val: 'inProgress', label: 'In Progress'},
            {id: 4, val: 'late', label: 'Late'}
          ]
        },
        fromPeople: {
          selected: null,
          options: cloneDeep(optionsFrom)
        },
        toPeople: {
          selected: null,
          options: cloneDeep(optionsTo)
        },
        groupsListTableFields: {
          'c.name': {
            label: 'Group',
            sortable: true
          },
          'company.name': {
            label: 'Company',
            sortable: true
          },
          'crew.name': {
            label: 'Crew Change',
            sortable: true
          },
          peopleCount: {
            label: '# Crew',
            sortable: true
          },
          leader: {
            label: 'Group Leader',
            sortable: true
          },
          'c.status': {
            label: 'Status',
            sortable: true
          },
          edit: {
            label: ' '
          }
        },
      }
    },
    methods: {
      search () {
        this.formString = $.param(this.form)
        this.$store.dispatch('getGroupsList', this.formString)
          .then(() => {
            this.$router.push({query: {}})
            this.sortBy = null
          })
      },
      resetSearch () {
        $('#m_daterangepicker_1').val('')
        this.form = {
          ...this.form,
          name: null,
          status: null,
          company: null,
          startDate: null,
          endDate: null,
          fromPeople: null,
          toPeople: null
        }
        this.search()
      },
      setDate (start, end) {
        this.form.startDate = start.utc().format('X')
        this.form.endDate = end.utc().format('X')
      },
      changeSelectVal (id, name, select) {
        const index = findIndex(select.options, {id})

        select.selected = select.options[index].label

        if (select.options[index].id === 0) {
          return this.form[name] = null
        }
        this.form[name] = select.options[index].val
      },
      linkGen (pageNum) {
        return '?page=' + pageNum
      },
      toggleCreateGroup () {
        const data = {
          open: true
        }
        this.$store.commit('SET_EDIT_GROUP', data)
      },
      editGroup (item) {
        this.editId = item.id

        const data = {
          edit: true,
          open: true,
          group: item,
          gropId: item.id,
          crewId: item.crewId
        }

        this.$store.commit('SET_EDIT_GROUP', data)
      },
      deleteGroup (group) {
        this.$store.dispatch('deleteGroup', {crewId: group.crewId, groupId: group.id})
          .then(() => {
            this.$store.dispatch('getGroupsList', this.formString)
          })
      },
      login (id) {
        this.$store.dispatch('getUserAdminId', id)
          .then((res) => {
            VueCookie.set('auth_token', res.apiKey)
            this.$store.commit('SET_AUTH_TOKEN', res.apiKey)

            this.$store.dispatch('getUser')
              .then(() => {
                this.$router.push({name: 'manage-crew-changes'})
              })
          })
      },
      sortChanged (ctx) {
        let search = 'sort=' + ctx.sortBy + '&direction=' + (ctx.sortDesc ? 'desc' : 'asc')

        if (this.form) {
          search += ('&' + $.param(this.form))
        }

        this.formString = search
        this.$store.dispatch('getGroupsList', search)
      },
    },
    components: {
      noInfo,
      processingEmptyVal,
      tableBtns,
      newGroup,
      tableResult
    },
    watch: {
      'editGroupModalData.open' (val) {
        if (!val) {
          this.$store.dispatch('getGroupsList', this.formString)
        }
      },
      $route (val) {
        let params = {}
        if (this.formString) {
          params = this.formString
        }
        if (val.query.page) {
          params += '&page=' + val.query.page
        }

        this.$store.dispatch('getGroupsList', params)
      }
    },
    head () {
      return {
        title: 'Manage Group Tips'
      }
    },
    name: 'manage-group-trips'
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-manage'
</style>
