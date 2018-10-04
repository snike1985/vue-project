<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
    <div class="container m--padding-top-30">
      <div class="row justify-content-between align-items-center">
        <div class="col">
          <h4 class="m--font-dark">
            Manage Crew Members
          </h4>
        </div>

        <div class="col" v-if="membersList.items.length">
          <div class="row no-gutters align-items-center justify-content-end">
            <div>
              <table-result :total="membersList.total"></table-result>
            </div>

            <b-pagination-nav
              class="m--margin-left-30"
              v-if="membersList.items.length && membersList.total > 25"
              :link-gen="linkGen"
              base-url="/admin/manage-crew-members"
              :use-router="true"
              :number-of-pages="Math.ceil(membersList.total / membersList.perPage)"
              v-model="membersList.page"/>

          </div>
        </div>
      </div>

      <div class="m-portlet m--margin-top-30" v-if="!membersList.items.length && !formString">
        <div class="row">
          <div class="col">
            <no-info></no-info>
          </div>
        </div>
      </div>

      <div v-if="membersList.items.length || formString" class="m-portlet m--margin-top-30">
        <div class="m-portlet__body">
          <b-form class="m-form" novalidate>
            <div class="row">

              <div class="col">
                <b-form-group class="m-form__group">
                  <b-form-input id="id"
                                type="text"
                                v-model="form.id"
                                name="id"
                                class="m-input"
                                placeholder="ID">
                  </b-form-input>
                </b-form-group>
              </div>

              <div class="col">
                <b-form-group class="m-form__group">
                  <b-form-input id="name"
                                type="text"
                                v-model="form.name"
                                name="name"
                                class="m-input"
                                placeholder="Name">
                  </b-form-input>
                </b-form-group>
              </div>

              <div class="col">
                <b-form-group class="m-form__group">

                  <the-mask v-model="form.phone"
                            id="phone"
                            type="tel"
                            data-vv-as="Phone"
                            name="phone"
                            class="m-input form-control"
                            placeholder="Phone"
                            :mask="'+##(###)###-##-########'">
                  </the-mask>
                </b-form-group>
              </div>

              <div class="col">
                <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100" id="status"
                            :text="'Status:  ' + select.selected">
                  <b-dropdown-item v-for="option in select.options" v-bind:key="option.val"
                                   v-on:click="changeStatusFilter(option.id)">{{option.label}}
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <div class="col-btn">
                <button
                  @click="search"
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

      <div class="m-portlet m--margin-top-30">
        <div class="row m--margin-top-30">
          <div class="col">
            <b-table
              hover
              @sort-changed="sortChanged"
              :fields="membersListTableFields"
              :items="membersList.items"
              :sort-by.sync="sortBy"
              :no-local-sorting="true"
              v-if="membersList.items.length"
              class="manage-member-table table fixed-col-5 crew-table m-table m-table--head-bg-light table-with-shadow">

              <template slot="c.id" slot-scope="data">
                {{data.item.id}}
              </template>

              <template slot="c.name" slot-scope="data">
                <div class="m--font-boldest2 m--font-blue cursor-pointer m-link m-link--blue"
                     @click="openDetails(data.item)">
                  {{data.item.name}}
                </div>
              </template>

              <template slot="company.name" slot-scope="data">
                <nuxt-link v-if="data.item.crew.company" class="m--font-boldest2 m--font-blue cursor-pointer m-link m-link--blue"
                           :to="'/admin/manage-companies?name=' + data.item.crew.company.name">
                  {{data.item.crew.company.name}}
                </nuxt-link>
                <span v-else class="m--font-metal">
                  —
                </span>
              </template>

              <template slot="c.status" slot-scope="data">
                <span class="row no-gutters align-items-center" v-if="data.item.status === 'notStarted'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-metal btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-11 la la-pause"></i>
                  </span>
                  <span>Not Started Yet</span>
                </span>

                <span class="row no-gutters align-items-center" v-if="data.item.status === 'late'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-danger btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-11 la la-close"></i>
                  </span>
                  <span>Late</span>
                </span>

                <span class="row no-gutters align-items-center" v-if="data.item.status === 'arrived'">
                  <span
                    class="no-cursor m--margin-right-10 btn btn-success btn-xs m-btn m-btn--icon btn-sm m-btn--icon-only">
                    <i class="m--font-light font-10 la la-check"></i>
                  </span>
                  <span>
                   Arrived
                  </span>
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

              <template slot="c.phone" slot-scope="data">
                <div v-if="!editAdminMemberModal.open || (editAdminMemberModal && editAdminMemberModal.user.id !== data.item.id)">
                  <the-mask class="hide"
                            :mask="['+##(###)###-##-########']"
                            v-model="data.item.phone"
                            :masked="true"/>
                  {{data.item.phone}}
                </div>
              </template>

              <template slot="edit" slot-scope="data">
                <div class="m--margin-left-10">
                  <table-btns @edit="editMember(data.item)"
                              :item="data.item"
                              deleteText="Are you sure you want <br> to delete this user?"
                              deleteBtn="Yes, delete user"
                              @delete="deleteMember(data.item.id, data.item.crew.id)"
                              :hideLogin="true">
                  </table-btns>
                </div>
              </template>

            </b-table>

            <no-info v-if="formString && !membersList.items.length"/>
          </div>
        </div>
      </div>

      <div v-if="membersList.items.length || formString" class="m--margin-bottom-30 m-datatable m-datatable--default">
        <div class="row align-items-center">

          <div class="col">
            <div class="row no-gutters align-items-center justify-content-end">
              <div>
                <table-result class="m--font-grey" :total="membersList.total"></table-result>
              </div>

              <b-pagination-nav
                class="m--margin-left-30"
                v-if="membersList.items.length && membersList.total > 25"
                :link-gen="linkGen"
                base-url="/admin/manage-crew-members"
                :use-router="true"
                :number-of-pages="Math.ceil(membersList.total / membersList.perPage)"
                v-model="membersList.page"/>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- the modals -->
    <edit-member v-if="editAdminMemberModal.open"
                 :user="editAdminMemberModal.user">
    </edit-member>

    <new-member v-if="createMemberModal.open"
                :nationalityList="nationalityList"
                :createMember="createMemberModal.open"
                :editMember="createMemberModal.edit"
                :user="createMemberModal.user"
                :groups="crewGroupsList.items">
    </new-member>

    <details-member v-if="memberDetailsModal.open"
                 :user="memberDetailsModal.user">
    </details-member>

  </div>
</template>

<script>
  import tableBtns from '../../components/admin/table-btns'
  import noInfo from '../../components/crewManager/no-info'
  import { mapState } from 'vuex'
  import processingEmptyVal from '../../components/processingEmptyVal'
  import editMember from '../../components/modals/admin/editMember'
  import detailsMember from '../../components/modals/admin/member-details'
  import tableResult from '../../components/table-result'

  export default {
    fetch ({store, route}) {
      const params = store.getters.checkQuery(route.query)
      return store.dispatch('getMembersList', params)
    },
    computed: mapState([
      'membersList',
      'editAdminMemberModal',
      'memberDetailsModal',
      'createMemberModal'
    ]),
    mounted: function() {
      this.formString = $.param(this.$route.query)
    },
    watch: {
      'memberDetailsModal.open'(val) {
        if(!val) {
          this.membersList.items.push()
        }
      },
      'editAdminMemberModal.open'(val) {
        if(!val) {
          this.membersList.items.push()
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

        this.$store.dispatch('getMembersList', params)
      }
    },
    data () {
      return {
        sortBy: null,
        formString: null,
        select: {
          selected: 'All',
          options: [
            {id: 0, val: 'all', label: 'All'},
            {id: 1, val: 'notStarted', label: 'Not Started Yet'},
            {id: 2, val: 'arrived', label: 'Arrived'},
            {id: 3, val: 'inProgress', label: 'In Progress'},
            {id: 4, val: 'late', label: 'Late'}
          ]
        },
        form: {
          id: null,
          name: null,
          status: null,
          phone: null
        },
        membersListTableFields: {
          'c.id': {
            label: 'Id',
            sortable: true
          },
          'c.name': {
            label: 'Name',
            sortable: true
          },
          'c.status': {
            label: 'Status',
            sortable: true
          },
          'c.phone': {
            label: 'phone',
            sortable: true
          },
          'company.name': {
            label: 'company',
            sortable: true
          },
          edit: {
            label: ' '
          }
        }
      }
    },
    methods: {
      editMember (member) {

        const data = {
          open: true,
          user: member
        }

        this.$store.commit('SET_EDIT_ADMIN_MEMBER_MODAL', data)
      },
      openDetails(member) {
        const data = {
          open: true,
          user: member
        }
        this.$store.commit('SET_MEMBER_DETAILS_MODAL', data)
      },
      changeStatusFilter (val) {
        this.select.selected = this.select.options[val].label
        if (this.select.options[val].id === 0) {
          return this.form.status = ''
        }
        this.form.status = this.select.options[val].val
      },
      deleteMember (memberId, crewId) {

        this.$store.dispatch('deleteMember', {crewId, memberId})
          .then(() => {
            this.$store.dispatch('getMembersList', this.formString)
          })
      },
      search () {
        this.formString = $.param(this.form)
        this.$store.dispatch('getMembersList', this.formString)
          .then(() => {
            this.$router.push({query: {}})
            this.sortBy = null;
          })
      },
      resetSearch () {
        this.form = {
          id: null,
          name: null,
          status: null,
          phone: null
        }
        this.select.selected = 'All';

        this.search()
      },
      sortChanged (ctx) {
        let search = 'sort=' + ctx.sortBy + '&direction=' + (ctx.sortDesc ? 'desc' : 'asc')

        if (this.form) {
          search += ('&' + $.param(this.form))
        }

        this.formString = search
        this.$store.dispatch('getMembersList', search)
      },
      linkGen (pageNum) {
        return '?page=' + pageNum
      }
    },
    components: {
      noInfo,
      processingEmptyVal,
      tableBtns,
      editMember,
      detailsMember,
      tableResult
    },
    head () {
      return {
        title: 'Manage Crew Members'
      }
    },
    name: 'manage-crew-members'
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-manage'
</style>
