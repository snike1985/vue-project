<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
    <div class="container m--padding-top-30">
      <div class="row justify-content-between align-items-center">
        <div class="col">
          <h4 class="m--font-dark">
            Manage Companies
          </h4>
        </div>
        <div class="col" v-if="companyList.items.length">
          <div class="row no-gutters align-items-center justify-content-end">
            <div>
              <table-result class="m--font-grey" :total="companyList.total"></table-result>
            </div>

            <b-pagination-nav
              class="m--margin-left-30"
              v-if="companyList.items.length && companyList.total > 25"
              :link-gen="linkGen"
              base-url="/admin/manage-companies"
              :use-router="true"
              :number-of-pages="Math.ceil(companyList.total / companyList.perPage)"
              v-model="companyList.page"/>

          </div>
        </div>
      </div>

      <div class="m-portlet m--margin-top-30" v-if="!companyList.items.length && !formString">
        <div class="row">
          <div class="col">
            <no-info></no-info>
          </div>
        </div>
      </div>

      <div v-if="companyList.items.length || formString" class="m-portlet m--margin-top-30">
        <div class="m-portlet__body">
          <b-form class="m-form" novalidate @submit="search">
            <div class="row align-items-end">
              <div class="col">
                <div class="row">
                  <div class="col-auto">
                    <div class="min-w-300">
                      <b-form-group class="m-form__group"
                                    label="Name:"
                                    label-for="name">
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

                    <div class="min-w-300">
                      <b-form-group label="Payment Plan:"
                                    class="m-form__group m--margin-top-15"
                                    label-for="paymentTypes">
                        <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100"
                                    id="paymentTypes"
                                    :text="paymentTypes.selected">
                          <b-dropdown-item v-for="option in paymentTypes.options"
                                           v-bind:key="option.val"
                                           v-on:click="changeSelectVal(option.id, 'paymentType', paymentTypes)">
                            {{option.label}}
                          </b-dropdown-item>
                        </b-dropdown>
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
                                        label-for="fromPeople">
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
                          <b-form-group class="m-form__group"
                                        label="# Crew Changes From:"
                                        label-for="fromCrew">
                            <the-mask id="fromCrew"
                                      type="text"
                                      v-model="form.fromCrew"
                                      required
                                      name="fromCrew"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="From">
                            </the-mask>
                          </b-form-group>
                        </div>

                        <div class="m--margin-top-15">
                          <b-form-group class="m-form__group"
                                        label="# Crew Changes To:"
                                        label-for="toCrew">
                            <the-mask id="toCrew"
                                      type="text"
                                      v-model="form.toCrew"
                                      required
                                      name="toCrew"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="To">
                            </the-mask>
                          </b-form-group>
                        </div>
                      </div>

                      <div class="col">
                        <div class="">
                          <b-form-group class="m-form__group"
                                        label="# Users From:"
                                        label-for="fromManager">
                            <the-mask id="fromManager"
                                      type="text"
                                      v-model="form.fromManager"
                                      required
                                      name="fromManager"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="From">
                            </the-mask>
                          </b-form-group>
                        </div>

                        <div class="m--margin-top-15">
                          <b-form-group class="m-form__group"
                                        label="# Users From:"
                                        label-for="toManager">
                            <the-mask id="toManager"
                                      type="text"
                                      v-model="form.toManager"
                                      required
                                      name="toManager"
                                      class="m-input form-control"
                                      :mask="'#####'"
                                      placeholder="To">
                            </the-mask>
                          </b-form-group>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>

              </div>
              <div class="col-btn">
                <button
                  class="btn m-btn m--font-transform-u m--font-boldest2 btn-info"
                  type="submit">
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
              :fields="companyListTableFields"
              :items="companyList.items"
              :sort-by.sync="sortBy"
              :no-local-sorting="true"
              v-if="companyList.items.length"
              class="table fixed-col-9 crew-table m-table m-table--head-bg-light table-with-shadow">

              <template slot="c.name" slot-scope="data">
                <div class="word-break">
                  {{data.item.name}}
                </div>
              </template>


              <template slot="crewCount" slot-scope="data">
                <processingEmptyVal class="text-center" :val="data.item.crewCount" :link="'/manage-crew-changes?company=' + data.item.name"></processingEmptyVal>
              </template>

              <template slot="peopleCount" slot-scope="data">
                <processingEmptyVal class="text-center" :val="data.item.peopleCount" :link="'/admin/manage-crew-members?company=' + data.item.name"></processingEmptyVal>
              </template>

              <template slot="peopleCountUnique" slot-scope="data">
                <processingEmptyVal class="text-center" :val="data.item.peopleCountUnique"></processingEmptyVal>
              </template>

              <template slot="managerCount" slot-scope="data">
                <processingEmptyVal class="text-center" :val="data.item.managerCount" :link="'/admin/manage-users?company=' + data.item.name"></processingEmptyVal>
              </template>

              <template slot="payment.type" slot-scope="data">
                <div class="m--font-transform-c" :class="{'m--font-metal': !data.item.paymentType}">
                  {{data.item.paymentType ? data.item.paymentType : '—'}}
                  <span class="m--font-grey font-10" v-if="data.item.paymentType">
                    {{'(' + data.item.paymentPeriod + ')'}}
                  </span>
                </div>
              </template>

              <template slot="payment.active" slot-scope="data">
                <div class="text-center">
                  <span
                    v-if="data.item.paymentActive"
                    class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-10 la la-check"></i>
                  </span>
                </div>
              </template>

              <template slot="payment.validTill" slot-scope="data">
                <span :class="{'m--font-metal': !data.item.paymentValidTill}">
                  <processingEmptyVal class="text-center" :val="setDate(data.item.paymentValidTill)"></processingEmptyVal>
                </span>
              </template>

              <template slot="paymentCreatedAt" slot-scope="data">
                <span :class="{'m--font-metal': !data.item.paymentCreatedAt}">
                  <processingEmptyVal class="text-center" :val="setDate(data.item.paymentCreatedAt)"></processingEmptyVal>
                </span>
              </template>

              <template slot="edit" slot-scope="data">
                <table-btns @edit="edit(data.item)"
                            :item="data.item"
                            deleteText="Are you sure you want <br> to delete the company?"
                            deleteBtn="Yes, delete company"
                            @delete="deleteCompany(data.item.id)"
                            @login="loginCompany(data.item.id)"
                ></table-btns>
              </template>

            </b-table>

            <no-info v-if="formString && !companyList.items.length"/>
          </div>
        </div>
      </div>

      <div v-if="companyList.items.length || formString" class="m--margin-bottom-30 m-datatable m-datatable--default">
        <div class="row align-items-center">

          <div class="col">
            <div class="row no-gutters align-items-center justify-content-end">
              <div>
                <table-result class="m--font-grey" :total="companyList.total"></table-result>
              </div>


              <b-pagination-nav
                class="m--margin-left-30"
                v-if="companyList.items.length && companyList.total > 25"
                :link-gen="linkGen"
                base-url="/admin/manage-companies"
                :use-router="true"
                :number-of-pages="Math.ceil(companyList.total / companyList.perPage)"
                v-model="companyList.page"/>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- the modals -->
    <edit-company v-if="editCompanyModal.open" :company="editCompanyModal.company"></edit-company>

  </div>
</template>

<script>
  import noInfo from '../../components/crewManager/no-info'
  import { mapState } from 'vuex'
  import processingEmptyVal from '../../components/processingEmptyVal'
  import cloneDeep from 'lodash/cloneDeep'
  import findIndex from 'lodash/findIndex'
  import VueCookie from 'vue-cookie'
  import EditCompany from '../../components/modals/admin/editCompany'
  import tableBtns from '../../components/admin/table-btns'
  import tableResult from '../../components/table-result'

  export default {
    fetch ({store, route}) {
      const params = store.getters.checkQuery(route.query)
      return store.dispatch('getCompanyList', params)
    },
    computed: mapState([
      'companyList',
      'currentUser',
      'editCompanyModal'
    ]),
    mounted: function() {
      this.formString = $.param(this.$route.query)
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
        sortBy: null,
        formString: null,
        form: {
          name: this.$route.query.name || '',
          paymentType: null,
          fromCrew: null,
          toCrew: null,
          fromPeople: null,
          toPeople: null,
          fromManager: null,
          toManager: null
        },
        fromCrew: {
          selected: null,
          options: cloneDeep(optionsFrom)
        },
        toCrew: {
          selected: null,
          options: cloneDeep(optionsTo)
        },
        fromPeople: {
          selected: null,
          options: cloneDeep(optionsFrom)
        },
        toPeople: {
          selected: null,
          options: cloneDeep(optionsTo)
        },
        fromManager: {
          selected: null,
          options: cloneDeep(optionsFrom)
        },
        toManager: {
          selected: null,
          options: cloneDeep(optionsTo)
        },
        paymentTypes: {
          selected: 'All',
          options: [
            {id: 0, val: 'all', label: 'All'},
            {id: 1, val: 'standard', label: 'Standard'},
            {id: 2, val: 'premium', label: 'Premium'},
            {id: 3, val: 'custom', label: 'Custom'}
          ]
        },
        companyListTableFields: {
          'c.name': {
            label: 'Name',
            sortable: true
          },
          crewCount: {
            label: '# Crew Changes',
            sortable: true
          },
          peopleCount: {
            label: '# Crew Total',
            sortable: true
          },
          peopleCountUnique: {
            label: '# CREW ACTIVE',
            sortable: true
          },
          managerCount: {
            label: '# Users',
            sortable: true
          },
          'payment.type': {
            label: 'Payment Plan',
            sortable: true
          },
          'payment.validTill': {
            label: 'Billing Date',
            sortable: true
          },
          paymentCreatedAt: {
            label: 'PAYMENT CREATED AT',
            sortable: true
          },
          'payment.active': {
            label: 'Payment Active',
            sortable: true
          },
          edit: {
            label: ' '
          }
        }
      }
    },
    methods: {
      setDate (date) {
        const timezone = this.currentUser.timeZone ? this.currentUser.timeZone.name : null
        return this.$store.getters.dateFilter(date * 1000, 'DD.MM.YYYY', timezone)
      },
      linkGen (pageNum) {
        return '?page=' + pageNum
      },
      sortChanged (ctx) {
        let search = 'sort=' + ctx.sortBy + '&direction=' + (ctx.sortDesc ? 'desc' : 'asc')

        if (this.form) {
          search += ('&' + $.param(this.form))
        }

        this.formString = search
        this.$store.dispatch('getCompanyList', search)
      },
      resetSearch (e) {
        const emptyForm = {
          name: '',
          paymentType: null,
          fromCrew: null,
          toCrew: null,
          fromPeople: null,
          toPeople: null,
          fromManager: null,
          toManager: null
        }

        this.paymentTypes.selected = 'All'
        this.fromCrew.selected = null
        this.toCrew.selected = null
        this.fromPeople.selected = null
        this.toPeople.selected = null
        this.fromManager.selected = null
        this.toManager.selected = null

        this.$router.push({query: {}})
        this.form = emptyForm
        this.formString = null
        this.search(e)
      },
      search (e) {
        e.preventDefault()
        this.formString = $.param(this.form)
        this.$store.dispatch('getCompanyList', this.formString)
          .then(() => {
            this.$router.push({query: {}})
            this.sortBy = null;
          })
      },
      changeSelectVal (id, name, select) {
        const index = findIndex(select.options, {id})

        select.selected = select.options[index].label

        if (select.options[index].id === 0) {
          return this.form[name] = null
        }
        this.form[name] = select.options[index].val
      },
      edit (item) {
        const data = {
          open: true,
          company: item
        }
        this.$store.commit('SET_EDIT_COMPANY_MODAL', data)
      },
      deleteCompany (id) {
        this.$store.dispatch('deleteCompany', id)
          .then(() => {
            this.$store.dispatch('getCompanyList', this.formString)
          })
      },
      loginCompany (id) {
        this.$store.dispatch('getUserAdminId', id)
          .then((res) => {
            VueCookie.set('auth_token', res.apiKey)
            this.$store.commit('SET_AUTH_TOKEN', res.apiKey)

            this.$store.dispatch('getUser')
              .then(() => {
                this.$router.push({name: 'manage-crew-changes'})
              })

          })
      }
    },

    watch: {
      $route (val) {
        let params = {}
        if (this.formString) {
          params = this.formString
        }
        if (val.query.page) {
          params += '&page=' + val.query.page
        }

        this.$store.dispatch('getCompanyList', params)
      }
    },
    components: {
      EditCompany,
      noInfo,
      processingEmptyVal,
      tableBtns,
      tableResult
    },
    head () {
      return {
        title: 'Manage Companies'
      }
    },
    name: 'manage-companies'
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-manage'
</style>
