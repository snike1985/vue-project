<template>
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
    <div class="container m--padding-top-30">
      <div class="row justify-content-between align-items-center">
        <div class="col-md-3">
          <h4 class="m--font-dark">
            Manage Users
          </h4>
        </div>
        <div class="col" v-if="usersList.items.length">
          <div class="row no-gutters align-items-center justify-content-end">
            <div>
              <table-result class="m--font-grey" :total="usersList.total"></table-result>
            </div>

            <b-pagination-nav
              class="m--margin-left-30"
              v-if="usersList.items.length && usersList.total > 25"
              :link-gen="linkGen"
              base-url="/admin/manage-users"
              :use-router="true"
              :number-of-pages="Math.ceil(usersList.total / usersList.perPage)"
              v-model="usersList.page"/>

          </div>
        </div>
      </div>

      <div class="m-portlet m--margin-top-30" v-if="!usersList.items.length && !formString">
        <div class="row">
          <div class="col">
            <no-info></no-info>
          </div>
        </div>
      </div>

      <div v-if="usersList.items.length || formString" class="m-portlet m--margin-top-30">
        <div class="m-portlet__body">
          <b-form class="m-form" novalidate>
            <div class="row">
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
                  <b-form-input id="email"
                                type="text"
                                v-model="form.email"
                                name="email"
                                class="m-input"
                                placeholder="Email">
                  </b-form-input>
                </b-form-group>
              </div>

              <div class="col">
                <b-form-group class="m-form__group">
                  <b-form-input id="company"
                                type="text"
                                v-model="form.company"
                                name="company"
                                class="m-input"
                                placeholder="Company">
                  </b-form-input>
                </b-form-group>
              </div>

              <div class="col">
                <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100" id="status"
                            :text="'Role:  ' + roles.selected">
                  <b-dropdown-item v-for="option in roles.options" v-bind:key="option.val"
                                   v-on:click="changeRoles(option.val)">{{option.label}}
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
              :fields="usersListTableFields"
              :items="usersList.items"
              :sort-by.sync="sortBy"
              :no-local-sorting="true"
              v-if="usersList.items.length"
              class="max-word-1 table fixed-col-5 crew-table m-table m-table--head-bg-light table-with-shadow">

              <template slot="name" slot-scope="data">
                <processingEmptyVal :val="data.item.name"></processingEmptyVal>
              </template>

              <template slot="username" slot-scope="data">
                <div :class="{'m--font-metal': !data.item.username}">
                  <a :href="'mailto:' + data.item.username" v-if="data.item.username">
                    {{data.item.username}}
                  </a>

                  <span v-else>—</span>
                </div>
              </template>

              <template slot="company" slot-scope="data">
                  <nuxt-link class="word-break m--font-boldest2 m--font-blue cursor-pointer"
                             :to="'/admin/manage-companies?name=' + data.item.company.name">
                    {{data.item.company.name}}
                  </nuxt-link>
              </template>

              <template slot="roles" slot-scope="data">
                <span v-if="isAdmin(data.item.roles)">
                  Admin
                </span>
                <span v-else>
                  Manager
                </span>
              </template>

              <template slot="edit" slot-scope="data">
                <div class="m--margin-left-10">
                  <table-btns @edit="editUser(data.item)"
                              :item="data.item"
                              deleteText="Are you sure you want <br> to delete this user?"
                              deleteBtn="Yes, delete user"
                              @delete="deleteUser(data.item.id)"
                              @login="login(data.item.id)"
                  ></table-btns>
                </div>
              </template>

            </b-table>

            <no-info v-if="formString && !usersList.items.length"/>
          </div>
        </div>
      </div>

      <div v-if="usersList.items.length || formString" class="m--margin-bottom-30 m-datatable m-datatable--default">
        <div class="row align-items-center">

          <div class="col">
            <div class="row no-gutters align-items-center justify-content-end">
              <div>
                <table-result class="m--font-grey" :total="usersList.total"></table-result>
              </div>

              <b-pagination-nav
                class="m--margin-left-30"
                v-if="usersList.items.length && usersList.total > 25"
                :link-gen="linkGen"
                base-url="/admin/manage-users"
                :use-router="true"
                :number-of-pages="Math.ceil(usersList.total / usersList.perPage)"
                v-model="usersList.page"/>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!--modals-->
    <edit-user v-if="editAdminUserModal.open" :user="editAdminUserModal.user"></edit-user>

  </div>
</template>

<script>
  import noInfo from '../../components/crewManager/no-info'
  import { mapState } from 'vuex'
  import processingEmptyVal from '../../components/processingEmptyVal'
  import tableBtns from '../../components/admin/table-btns'
  import VueCookie from 'vue-cookie'
  import editUser from '../../components/modals/admin/editUser'
  import findIndex from 'lodash/findIndex'
  import tableResult from '../../components/table-result'

  export default {
    fetch ({store, route}) {
      const params = store.getters.checkQuery(route.query)
      return store.dispatch('getUsersList', params)
    },
    computed: mapState([
      'usersList',
      'editAdminUserModal'
    ]),
    data () {
      return {
        formString: null,
        sortBy: null,
        roles: {
          selected: 'All',
          options: [
            {id: 0, val: 'all', label: 'All'},
            {id: 1, val: 'ROLE_ADMIN', label: 'Admin'},
            {id: 2, val: 'ROLE_MANAGER', label: 'Manager'}
          ]
        },
        form: {
          name: '',
          username: '',
          company: this.$route.query.company || '',
          role: ''
        },
        usersListTableFields: {
          name: {
            label: 'Name',
            sortable: true
          },
          username: {
            label: 'Email',
            sortable: true
          },
          company: {
            label: 'Company',
            sortable: true
          },
          roles: {
            label: 'Role',
            sortable: true
          },
          edit: {
            label: ' '
          }
        }
      }
    },
    mounted: function() {
      this.formString = $.param(this.$route.query)
    },
    methods: {
      isAdmin(roles) {
        return roles.some((item) => {
          if (item === 'ROLE_SUPER_ADMIN' || item === 'ROLE_ADMIN') return true
        })
      },
      linkGen (pageNum) {
        return '?page=' + pageNum
      },
      changeRoles(val) {
        const index = findIndex(this.roles.options, {val})

        this.roles.selected = this.roles.options[index].label

        if (this.roles.options[index].id === 0) {
          return this.form.role = null
        }
        this.form.role = this.roles.options[index].val
      },
      resetSearch(){
        this.form = {
          name: '',
          email: '',
          company: '',
          role: null
        }
        this.roles.selected = 'All'
        this.search()
      },
      search(){
        this.formString = $.param(this.form)
        this.$store.dispatch('getUsersList', this.formString)
          .then(() => {
            this.sortBy = null;
            this.$router.push({query: {}})
          })
      },
      editUser(item) {
        const data = {
          open: true,
          user: item
        }
        this.$store.commit('SET_EDIT_ADMIN_USER_MODAL', data)
      },
      deleteUser(id) {
        this.$store.dispatch('deleteUser', id)
          .then(() => {
            this.$store.dispatch('getUsersList', this.formString)
          })
      },
      login(id) {
        this.$store.dispatch('getUserId', id)
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

        let sort = 'c.' + ctx.sortBy

        if (ctx.sortBy === 'company') {
          sort = 'company.name'
        }

        let search = 'sort=' + sort + '&direction=' + (ctx.sortDesc ? 'desc' : 'asc')

        if (this.form) {
          search += ('&' + $.param(this.form))
        }

        this.formString = search
        this.$store.dispatch('getUsersList', search)
      }
    },
    watch: {
      'editAdminUserModal.open'(val) {
        if(!val) {
          this.usersList.items.push()
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

        this.$store.dispatch('getUsersList', params)
      }
    },
    components: {
      noInfo,
      processingEmptyVal,
      tableBtns,
      editUser,
      tableResult
    },
    head () {
      return {
        title: 'Manage Users'
      }
    },
    name: 'manage-users'
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-manage'
</style>
