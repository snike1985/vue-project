<template>
  <div>
    <header class="main-header m-stack m-stack--ver m-stack--desktop">
      <div class="m-stack m-stack--ver m-stack--general">

        <div class="m-stack__item m-stack__item--center m-stack__item--middle" style="width: 120px;">
          <nuxt-link :to="'/'"><img width="150px" src="/images/logo.svg" alt="logo"></nuxt-link>
        </div>

        <div v-if="currentUser" class="m-stack__item m-stack__item--right m-stack__item--middle">
          <div class="row no-gutters justify-content-end align-items-center" v-if="!currentUser.emailVerified">
            <a href="#" class="m-menu__link" v-on:click="logout($event)">Logout</a>
          </div>
          <div class="row no-gutters justify-content-end align-items-center" v-if="currentUser.emailVerified">
            <div v-if="superAdmin">
              <nuxt-link
                to="/admin/manage-users"
                :class="{'nuxt-link-exact-active': $route.query && $route.path == '/admin/manage-users'}"
                class="font-12 manage-crew-btn btn m-btn m--margin-right-20 m--font-transform-u m--font-boldest2 btn-outline-info">
                Manage Users
              </nuxt-link>

              <nuxt-link
                to="/admin/manage-companies"
                :class="{'nuxt-link-exact-active': $route.query && $route.path == '/admin/manage-companies'}"
                class="font-12 manage-crew-btn btn m-btn m--margin-right-20 m--font-transform-u m--font-boldest2 btn-outline-info">
                Manage Companies
              </nuxt-link>

              <nuxt-link
                to="/admin/manage-group-trips"
                :class="{'nuxt-link-exact-active': $route.query && $route.path == '/admin/manage-group-trips'}"
                class="font-12 manage-crew-btn btn m-btn m--margin-right-20 m--font-transform-u m--font-boldest2 btn-outline-info">
                Manage Group Trips
              </nuxt-link>

              <nuxt-link
                to="/admin/manage-crew-members"
                :class="{'nuxt-link-exact-active': $route.query && $route.path == '/manage-crew-members'}"
                class="font-12 manage-crew-btn btn m-btn m--margin-right-20 m--font-transform-u m--font-boldest2 btn-outline-info">
                Manage Crew Members
              </nuxt-link>
            </div>

            <nuxt-link
              v-if="currentUser.active"
              to="/manage-crew-changes"
              :class="{'nuxt-link-exact-active': $route.path == '/manage-crew-changes'}"
              class="font-12 manage-crew-btn btn m-btn m--font-transform-u m--font-boldest2 btn-outline-info">
              Manage Crew Changes
            </nuxt-link>

            <div
              class="m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas  m-header-menu--skin-dark m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-dark m-aside-header-menu-mobile--submenu-skin-dark">
              <ul class="m-menu__nav  m-menu__nav--submenu-arrow">
                <li class="m-menu__item notification-menu-item">
                  <nuxt-link
                    to="/notifications" class="m-menu__link">
                    <span class="m--font-grey">
                      <span class="m-badge m-badge--danger" v-if="individualUnreadAlerts && !superAdmin">{{individualUnreadAlerts}}</span>
                      <i class="flaticon-music-2"></i>
                    </span>
                  </nuxt-link>
                </li>
                <li
                  class="m-menu__item m-menu__item--submenu m-menu__item--rel m-menu__item--open-dropdown"
                  v-bind:class="{
                      'm-menu__item--hover': showSubMenu
                    }">
                  <a class="m-menu__link m-menu__toggle header-submenu-btn"
                     v-on:click="openSubMenu($event)">
                    <i class="flaticon-user-settings"></i>
                    <span class="company-name m--padding-left-10">
                      {{currentUser.company.name}}
                    </span>
                    <i class="m-menu__hor-arrow la la-angle-down"></i>
                  </a>
                  <div class="m-menu__submenu m-menu__submenu--classic m-menu__submenu--right">
                    <span class="sub-menu__arrow"></span>
                    <ul class="m-menu__subnav" v-on:click="openSubMenu($event)">
                      <li class="m-menu__item">
                        <nuxt-link
                          to="/settings" class="m-menu__link">
                          <i class="m-menu__link-icon flaticon-cogwheel-1 m--font-grey"></i>
                          <span class="m-menu__link-text m--font-bolder m--font-info">Settings</span>
                        </nuxt-link>
                      </li>
                      <li class="m-menu__item">
                        <nuxt-link
                          to="/privacy" class="m-menu__link">
                          <i class="m-menu__link-icon flaticon-list-3 m--font-grey"></i>
                          <span class="m-menu__link-text m--font-bolder m--font-info">Privacy Policy</span>
                        </nuxt-link>
                      </li>
                      <li class="m-menu__item">
                        <nuxt-link
                          to="/terms" class="m-menu__link">
                          <i class="m-menu__link-icon flaticon-list-3 m--font-grey"></i>
                          <span class="m-menu__link-text m--font-bolder m--font-info">Terms & Conditions</span>
                        </nuxt-link>
                      </li>
                      <li class="m-menu__item">
                        <a href="#" class="m-menu__link" v-on:click="logout($event)">
                          <i class="m-menu__link-icon flaticon-logout m--font-grey"></i>
                          <span class="m-menu__link-text m--font-bolder m--font-info">Sign Out</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </header>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import VueCookie from 'vue-cookie'
  import firebase from '~/services/firebase-init'
  import {alertsWatch} from '~/plugins/setupFirebase'

  export default {
    name: 'app-header',
    computed: mapState([
      'currentUser',
      'superAdmin',
      'individualUnreadAlerts'
    ]),
    data () {
      return {
        crewId: this.$route.params.crewId,
        groupId: this.$route.params.groupId,
        showSubMenu: false
      }
    },
    mounted: function () {
      document.addEventListener('click', this.toggleMenu);

      if (this.currentUser && !this.superAdmin) {
        this.setupNotifications()
      }
    },
    beforeDestroy: function () {
      document.removeEventListener('click', this.toggleMenu)
    },
    methods: {
      setupNotifications() {

        const databaseRef = alertsWatch(this.$store.state.currentUser.firebaseUserId);

        let data;

        databaseRef.on('value', (dataSnapshot) => {
          data = dataSnapshot.val();
          if(!data) return

          if(data.individual) {
            this.findUnread(data.individual, 'individual');
          }

          if(this.groupId) {
            this.findUnread(data.crewGroup[this.groupId], 'crewGroup')
          }
          if (this.crewId && !this.groupId) {
            this.findUnread(data.crew[this.crewId], 'crew')
          }

          this.$store.dispatch('addFirebaseAlerts', data)
        });
      },
      findUnread(notifications, type) {

        if(!notifications) return
        let notificationCount = 0;

        notifications.forEach((item) => {
          if(!item.read) { notificationCount++}
        })

        setTimeout(() => {
          this.$store.commit('SET_ALERTS_COUNT', {notificationCount, type})
        })
      },
      logout (evt) {
        evt.preventDefault();
        VueCookie.delete('auth_token');
        this.$store.commit('SET_AUTH_TOKEN', null);
        firebase.auth().signOut();
        window.location = '/login'
      },
      openSubMenu (e) {
        e.stopPropagation();
        this.showSubMenu = !this.showSubMenu
      },
      toggleMenu() {

        if (this.showSubMenu) {
          this.showSubMenu = !this.showSubMenu
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../assets/scss/header'
</style>

