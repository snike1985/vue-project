import Vuex from 'vuex'
import { newAxios } from '~/plugins/axios'
import axios from 'axios'
import Cookies from 'cookies'
import VueCookie from 'vue-cookie'
import moment from 'moment-timezone'
import findIndex from 'lodash/findIndex'
import firebase from '~/services/firebase-init'
import capitalize from 'lodash/capitalize'
import pullAllBy from 'lodash/pullAllBy'
import cloneDeep from 'lodash/cloneDeep'
import keys from 'lodash/keys'
import 'firebase/auth';

const createStore = () => {
  return new Vuex.Store({
    state,
    getters: {
      dateFilter: (state) => (date, format, tz) => {
        tz = tz || 'Europe/Kiev'
        if (date) {
          return moment.tz(date, tz).format(format)
        }
      },
      formValidation: (state) => (formErrors, errors, form) => {
        const {children} = formErrors
        const formKeys = Object.keys(children)

        formKeys.forEach((key) => {
          if (children[key].errors && children[key].errors.length) {
            if (form) {
              return errors.add(form + capitalize(key), children[key].errors[0], 'server')
            }
            errors.add(key, children[key].errors[0], 'server')
          }
        })
      },
      checkQuery: (state) => (query) => {
        let params = ''
        if (query) {

          const queryValues = keys(query)

          if (queryValues.length) {
            queryValues.forEach((val, index) => {
              params += val + '=' + query[val]
              if (index < (queryValues.length - 1)) {
                params += '&'
              }
            })
          }
        }
        return params
      }
    },
    actions,
    mutations
  })
}

export const state = () => ({
  currentUser: null,
  superAdmin: null,
  admin: null,
  authToken: null,
  crewList: null,
  crewDetails: null,
  nationalityList: null,
  crewGroupsTypes: null,
  crewGroupsList: null,
  crewGroup: null,
  timezoneList: null,
  managersList: null,
  notificationPref: null,
  unreadMessages: 0,
  createMemberModal: {
    open: false,
    edit: false,
    user: null
  },
  editGroupModalData: {
    open: false,
    edit: false,
    group: null,
    groupId: null,
    crewId: null
  },
  editCompanyModal: {
    open: false,
    company: null
  },
  editAdminUserModal: {
    open: false,
    user: null
  },
  editAdminMemberModal: {
    open: false,
    user: null
  },
  autoCreateGroupModal: {
    open: false
  },
  memberDetailsModal: {
    open: false,
    user: null
  },
  acceptedModal: {
    open: false
  },
  newCrewModal: {
    open: false,
    crew: null
  },
  copyCrewModal: {
    open: false,
    edit: false,
    crew: null
  },
  changePass: {
    open: false
  },
  createManager: {
    open: false
  },
  chatMessages: [],
  payment: {},
  paymentPlans: null,
  countries: [],
  alertsList: null,
  individualUnreadAlerts: 0,
  crewGroupUnreadAlerts: 0,
  crewUnreadAlerts: 0,
  firebaseAlerts: [],
  changePayment: {
    open: false
  },
  createCustomPlan: {
    open: false
  },
  companyList: null,
  usersList: null,
  membersList: null,
  groupsList: null,
  matchingObj: null,
  allManagersList: null
});

export const mutations = {
  SET_USER: function (state, user) {
    state.currentUser = user

    state.superAdmin = user.roles.some((item) => {
      if (item === 'ROLE_SUPER_ADMIN') return true
    })

    state.admin = user.roles.some((item) => {
      if (item === 'ROLE_SUPER_ADMIN' || item === 'ROLE_ADMIN') return true
    })
  },
  SET_AUTH_TOKEN (state, clientId) {
    state.authToken = clientId
  },
  SET_CREW_LIST (state, list) {
    state.crewList = list
  },
  SET_CREW_DETAILS (state, res) {
    state.crewDetails = res
  },
  SET_NATIONALITY_LIST (state, res) {
    state.nationalityList = res
  },
  SET_CREW_GROUPS (state, res) {
    state.crewGroupsTypes = res
  },
  SET_CREW_GROUP_LIST (state, res) {
    state.crewGroupsList = res
  },
  SET_CREW_MANAGERS_LIST (state, res) {
    state.crewManagersList = res
  },
  SET_ALL_MANAGERS_LIST (state, res) {
    state.allManagersList = res
  },
  SET_ACTIVE_MEMBER (state, member) {
    state.createMemberModal.user = member
  },
  SET_GROUP_DETAILS (state, group) {
    state.crewGroup = group
  },
  SET_EDIT_GROUP (state, data) {
    state.editGroupModalData.open = data.open
    state.editGroupModalData.edit = data.edit
    state.editGroupModalData.group = data.group
    state.editGroupModalData.crewId = data.crewId
    state.editGroupModalData.gropId = data.gropId
  },
  SET_CREATE_CREW_MODAL (state, data) {
    state.newCrewModal.open = data.open
    state.newCrewModal.edit = data.edit
    state.newCrewModal.crew = data.crew
  },
  SET_COPY_CREW_MODAL (state, data) {
    state.copyCrewModal.open = data.open
    state.copyCrewModal.crew = data.crew
  },
  SET_EDIT_COMPANY_MODAL (state, data) {
    state.editCompanyModal.open = data.open
    state.editCompanyModal.company = data.company
  },
  SET_EDIT_ADMIN_USER_MODAL (state, data) {
    state.editAdminUserModal.open = data.open
    state.editAdminUserModal.user = data.user
  },
  SET_EDIT_ADMIN_MEMBER_MODAL (state, data) {
    state.editAdminMemberModal.open = data.open
    state.editAdminMemberModal.user = data.user
  },
  SET_MEMBER_DETAILS_MODAL (state, data) {
    state.memberDetailsModal.open = data.open
    state.memberDetailsModal.user = data.user
  },
  SET_CHAT_MESSAGES (state, data) {
    state.chatMessages = data
  },
  SET_UNREAD_MESSAGES (state, data) {
    state.unreadMessages = data
  },
  UPDATE_CREW_GROUP (state, group) {
    const groupIndex = findIndex(state.crewGroupsList.items, {id: group.id})

    state.crewGroupsList.items[groupIndex] = group
  },
  SET_TIMEZONE_LIST (state, list) {
    state.timezoneList = list
  },
  SET_NOTIF_PREFERENCE (state, preference) {
    state.notificationPref = preference
  },
  SET_MANAGERS_LIST (state, managers) {
    state.managersList = managers
  },
  SET_CHANGE_PASS_MODAL (state, data) {
    state.changePass = data
  },
  SET_USER_COMPANY (state, company) {
    state.currentUser.company = company
  },
  SET_CREATE_MANAGER_MODAL (state, data) {
    state.createManager = data
  },
  SET_PAYMENT (state, data) {
    state.payment = data
  },
  SET_PAYMENT_PLANS (state, data) {
    state.paymentPlans = data
  },
  SET_CHANGE_PAYMENT_MODAL (state, data) {
    state.changePayment = data
  },
  SET_CREATE_CUSTOM_PLAN_MODAL (state, data) {
    state.createCustomPlan = data
  },
  SET_AUTO_CREATE_GROUP_MODAL (state, data) {
    state.autoCreateGroupModal = data
  },
  SET_ACCEPTED_MODAL (state, data) {
    state.acceptedModal = data
  },
  SET_COUNTRIES (state, data) {
    state.countries = data
  },
  SET_ALERTS (state, {string, res}) {

    if (!string) {
      this.commit('SET_ALERTS_COUNT', {
        type: 'individual',
        notificationCount: res.unreadRecordsLeft
      })
    }

    if (!state.alertsList) {
      return state.alertsList = res
    }

    state.alertsList.items = state.alertsList.items.concat(res.items)
    state.alertsList.recordsLeft = res.recordsLeft
    state.alertsList.unreadRecordsLeft = res.unreadRecordsLeft
  },
  ADD_FIREBASE_ALERTS (state, {type, id}) {
    let newNotifications = cloneDeep(state.firebaseAlerts[type])

    if (type === 'crewGroup' || type === 'crew') {
      newNotifications = cloneDeep(state.firebaseAlerts[type][id])
    }

    pullAllBy(newNotifications, state.alertsList.items, 'id')

    if (newNotifications.length) {
      newNotifications.forEach((item) => {
        state.alertsList.items.unshift(item)
      })
    }
  },
  RESET_ALERTS_LIST (state) {
    state.alertsList = null
  },
  SET_ALERTS_COUNT (state, {notificationCount, type}) {
    state[type + 'UnreadAlerts'] = notificationCount
  },
  SET_READ_ALERTS (state) {
    if (!state.alertsList) return
    state.alertsList.items.forEach((item) => {
      item.read = true
    })
  },
  SET_FIREBASE_ALERTS (state, data) {
    state.firebaseAlerts = data
  },
  SET_COMPANY_LIST (state, data) {
    state.companyList = data
  },
  SET_USERS_LIST (state, data) {
    state.usersList = data
  },
  SET_MEMBERS_LIST (state, data) {
    state.membersList = data
  },
  SET_GROUPS_LIST (state, data) {
    state.groupsList = data
  },
  SET_MATCHING_DATA (state, data) {
    state.matchingObj = data
  }
}

export const actions = {

  // modals
  openCreateMember ({commit, state, dispatch}, data) {
    const edit = data ? data.edit : false
    const groupPage = data ? data.groupPage : false

    state.createMemberModal.open = !state.createMemberModal.open
    if (edit || state.createMemberModal.edit) {
      state.createMemberModal.edit = !state.createMemberModal.edit
    }
    if (!state.createMemberModal.open) {
      if (groupPage) {
        return dispatch('getGroupDetails', {
          crewId: this.$router.history.current.params.crewId,
          groupId: this.$router.history.current.params.groupId
        }).then((res) => {
          const members = res.data.body.members
          const memberIndex = findIndex(members, {id: state.createMemberModal.user.id})
          commit('SET_ACTIVE_MEMBER', members[memberIndex])
        })
      }

      dispatch('getCrewGroupList', this.$router.history.current.params.crewId)
        .then(() => {
          if (edit) {
            let groupIndex

            if (!state.createMemberModal.user.crewGroupId) {
              groupIndex = findIndex(state.crewGroupsList.noGroup, {id: state.createMemberModal.user.id})
              return commit('SET_ACTIVE_MEMBER', state.crewGroupsList.noGroup[groupIndex])
            }

            groupIndex = findIndex(state.crewGroupsList.items, {id: state.createMemberModal.user.crewGroupId})
            const members = state.crewGroupsList.items[groupIndex].members
            const memberIndex = findIndex(members, {id: state.createMemberModal.user.id})
            commit('SET_ACTIVE_MEMBER', members[memberIndex])
          }
        })
    }
  },

  setActiveMemberDetails ({commit}, member) {
    commit('SET_ACTIVE_MEMBER', member)
  },

  editGroupModal ({commit}, data) {
    commit('SET_EDIT_GROUP', data)
  },

  createCrewModal ({commit}, data) {
    commit('SET_CREATE_CREW_MODAL', data)
  },

  copyCrewModal ({commit}, data) {
    commit('SET_COPY_CREW_MODAL', data)
  },

  changePassModal ({commit}, data) {
    commit('SET_CHANGE_PASS_MODAL', data)
  },

  createManagerModal ({commit}, data) {
    commit('SET_CREATE_MANAGER_MODAL', data)
  },

  changePaymentModal ({commit}, data) {
    commit('SET_CHANGE_PAYMENT_MODAL', data)
  },

  createCustomPlanModal ({commit}, data) {
    commit('SET_CREATE_CUSTOM_PLAN_MODAL', data)
  },

  autoCreateGroupModal ({commit}, data) {
    commit('SET_AUTO_CREATE_GROUP_MODAL', data)
  },

  acceptedModal ({commit}, data) {
    commit('SET_ACCEPTED_MODAL', data)
  },

  // INIT
  async nuxtServerInit ({commit, state, dispatch}, {req, res}) {
    const cookies = new Cookies(req, res)
    const auth_token = cookies.get('auth_token') || state.authToken

    if (auth_token) {
      newAxios.defaults.headers['x-auth-token'] = auth_token
      await dispatch('getUser').then((res) => {
        commit('SET_USER', res)
        commit('SET_AUTH_TOKEN', res.apiKey)
      })
      await dispatch('getPayment')
    }
  },

  loginFirebaseUser ({state}) {
    return firebase.auth().signInWithEmailAndPassword(state.currentUser.username, state.currentUser.apiKey)
  },

  // CREW MANAGE CHANGES
  createCrew ({commit}, {id, form}) {
    return newAxios.post('/crew/' + (id || 'create'), form)
      .then((res) => {
        return res.data
      })
      .catch(error => Promise.reject(error.data))
  },
  createAutoGroup ({commit}, {id, matches}) {
    return newAxios.put('/crew/' + id + '/auto-group?matches=' + matches + '')
      .then((res) => {
        return res.data
      })
      .catch(error => Promise.reject(error.data))
  },
  changeCrewStatus ({commit}, {id, status}) {
    return newAxios.post('/crew/' + id + '/status', {status: status})
      .then((res) => {
        return res.data
      })
      .catch(error => Promise.reject(error.data))
  },
  getCrewList ({commit}, {search, exportFile}) {
    return newAxios.get('/crew/' + (search ? '?' + search : ''))
      .then((res) => {
        if (!exportFile) {
          commit('SET_CREW_LIST', res.data.body)
          return res.data.body
        }
        return res.data
      })
  },
  getTimezone ({commit}, data) {
    return axios.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + data.lat + ',' + data.lng + '&timestamp=' + data.time + '&key=AIzaSyBxJFzj6L6sNEMSNinc2oA1TZIYuERW0Vs')
      .then((res) => {
        return res.data
      })
      .catch((error) => Promise.reject(error.data))
  },


  // SETTINGS
  getTimezoneList ({commit}) {
    return newAxios.get('/resource/time-zone')
      .then((res) => {
        commit('SET_TIMEZONE_LIST', res.data.body)
        return res.data.body
      })
  },
  getNotifPreference ({commit}) {
    return newAxios.get('/user/notification/preference/')
      .then((res) => {
        commit('SET_NOTIF_PREFERENCE', res.data.body)
        return res.data.body
      })
  },
  setNotificationsInfo ({commit}, form) {
    return newAxios.post('/user/notification/preference/', form)
      .then((res) => {
        commit('SET_NOTIF_PREFERENCE', res.data.body)
        return res.data.body
      })
  },
  getManagers ({commit}) {
    return newAxios.get('/manager/')
      .then((res) => {
        commit('SET_MANAGERS_LIST', res.data.body)
        return res.data.body
      })
  },
  changePass ({commit, dispatch}, form) {
    return newAxios.post('/auth/change-password', form)
      .then((res) => {
        dispatch('setupUser', res.data.body)
        return res.data.body
      })
  },
  setCompanyInfo ({commit}, form) {
    return newAxios.post('/company/', form)
      .then((res) => {
        commit('SET_USER_COMPANY', res.data.body)
        return res.data.body
      })
  },
  setUserInfo ({commit}, form) {
    return newAxios.post('/user/', form)
      .then((res) => {
        return res.data.body
      })
  },

  createManager ({commit}, form) {
    return newAxios.post('/manager/create', form)
      .then((res) => {
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  deleteManager ({commit}, id) {
    return newAxios.delete('/manager/' + id)
      .then((res) => {
        commit('SET_MANAGERS_LIST', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },

  //PAYMENT
  getPayment ({commit}) {
    return newAxios.get('/payment/')
      .then((res) => {
        commit('SET_PAYMENT', res.data.body);
        return res.data.body
      })
  },
  getPaymentPlans ({commit}) {
    return newAxios.get('/payment/plans')
      .then((res) => {
        commit('SET_PAYMENT_PLANS', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  setCustomPlan ({commit}, {data}) {
    return newAxios.post('/payment/custom-plan', data)
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  setPayment ({commit}, {data}) {
    return newAxios.post('/payment/create', data)
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  editPayment ({commit}, {data}) {
    return newAxios.post('/payment/edit', data)
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  switchPayment ({commit}, {data}) {
    return newAxios.post('/payment/switch', data)
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  editPaymentCard ({commit}, {token}) {
    return newAxios.put('/payment/edit-card?token=' + token + '')
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  editPaymenInvoice ({commit}, {data}) {
    return newAxios.post('/payment/edit-invoice', data)
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  deletePayment ({commit}) {
    return newAxios.delete('/payment/cancel')
      .then((res) => {
        commit('SET_PAYMENT', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },

  //RESOURCES
  getCountries ({commit}) {
    return newAxios.get('/resource/country')
      .then((res) => {
        commit('SET_COUNTRIES', res.data.body)
        return res.data.body
      })
  },

  // CONTACTS INFORMATION
  getContactsInfo ({commit}, {id}) {
    return newAxios.get(`/crew/${id}/contact-info/?per_page=9999`)
      .then((res) => {
        return res.data.body
      })
  },
  getContactById ({commit}, {id, contactId}) {
    return newAxios.get(`/crew/${id}/contact-info/${contactId}`)
      .then((res) => {
        return res.data.body
      })
  },
  createContact ({commit}, {id, data}) {
    return newAxios.post(`/crew/${id}/contact-info/create`, data)
      .then((res) => {
        return res.data.body
      })
  },
  changeContact ({commit}, {id, contactId, data}) {
    return newAxios.post(`/crew/${id}/contact-info/${contactId}`, data)
      .then((res) => {
        return res.data.body
      })
  },
  deleteContact ({commit}, {id, contactId}) {
    return newAxios.delete(`/crew/${id}/contact-info/${contactId}`)
      .then((res) => {
        return res.data.body
      })
  },

  // CHAT
  getMessages ({commit, state}, {id, fromTime}) {
    return newAxios.get(`/chat/${id}/?fromTime=${fromTime}`)
      .then((res) => {
        let items = res.data.body.items,
          mesagesArr = []

        for (let item of items) {
          mesagesArr.unshift(item)
        }

        commit('SET_CHAT_MESSAGES', mesagesArr)

        return res.data.body
      })
  },
  getNewMessages ({commit, state}, {id, fromTime}) {
    return newAxios.get(`/chat/${id}/?fromTime=${fromTime}`)
      .then((res) => {
        let items = res.data.body.items,
          mesagesArr = state.chatMessages

        for (let item of items) {
          mesagesArr.unshift(item)
        }
        commit('SET_CHAT_MESSAGES', mesagesArr)

        return res.data.body
      })
  },
  postMessage ({commit, state}, {id, data}) {
    return newAxios.post(`/chat/${id}/message`, data)
      .then((res) => {
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  downloadFile ({state}, {url}) {
    return newAxios.get(`${url}`,{responseType: 'blob'})
      .then((res) => {
        return res
      }).catch((error) => Promise.reject(error.data))
  },
  readMessages ({commit, state}, {id}) {
    return newAxios.put(`/chat/${id}/read`)
      .then((res) => {
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  postMessageFile ({commit, state}, {id, file}) {
    return newAxios.post(`/chat/${id}/file`, file,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  setMessages ({commit, state}, {messages}) {
    commit('SET_CHAT_MESSAGES', messages)
  },
  setUnreadMessages ({commit, state}, {unread}) {
    commit('SET_UNREAD_MESSAGES', unread)
  },

  //IMPORT
  importFile ({commit, state}, {id, file}) {
    return newAxios.post(`/crew/${id}/member/import/create`, file,
      {})
      .then((res) => {
        commit('SET_MATCHING_DATA', res.data.body);
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  importExecute ({state}, {id, importId, data}) {
    return newAxios.patch(`/crew/${id}/member/import/${importId}/execute`, data)
      .then((res) => {
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  setMatchingData ({commit, state}, {data}) {
    commit('SET_MATCHING_DATA', data);
  },
  getImportStatus ({commit, state}, {id, importId}) {
    return newAxios.get(`/crew/${id}/member/import/${importId}`)
      .then((res) => {
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },

  // CREW DETAILS
  crewDetailsInit ({dispatch}, id) {},
  setLeader ({commit}, id) {
    return newAxios.put('/member/' + id + '/leader/')
      .then((res) => {

        return res.data.body
      })
  },

  deleteStop ({commit}, {memberId, stopId}) {
    return newAxios.delete('/member/' + memberId + '/stop/' + stopId)
      .then((res) => {
        return res.data.body
      })
  },

  getCrewDetails ({commit}, id) {
    return newAxios.get('/crew/' + id)
      .then((res) => {
        commit('SET_CREW_DETAILS', res.data.body)
      })
  },
  crewDelete ({commit}, id) {
    return newAxios.delete('/crew/' + id)
      .then((res) => {
        return res.data.body
      })
  },
  crewCopy ({commit}, {id, data}) {
    return newAxios.post(`/crew/${id}/copy/`, data)
      .then((res) => {
        return res.data.body
      })
  },
  getNationalityList ({commit}, id) {
    return newAxios.get('/resource/nationality')
      .then((res) => {
        commit('SET_NATIONALITY_LIST', res.data.body)
      })
  },
  getCrewGroupList ({commit}, id) {
    return newAxios.get('/crew/' + id + '/group/')
      .then((res) => {
        commit('SET_CREW_GROUP_LIST', res.data.body)
        return res
      })
  },
  getGroupDetails ({commit}, {crewId, groupId}) {
    return newAxios.get('/crew/' + crewId + '/group/' + groupId)
      .then((res) => {
        commit('SET_GROUP_DETAILS', res.data.body)
        return res
      })
  },
  editGroup ({commit}, data) {
    return newAxios.post('/crew/' + data.crewId + '/group/' + data.groupId, data.form)
      .then((res) => {
        commit('SET_GROUP_DETAILS', res.data.body)
      })
  },
  deleteGroup ({commit}, {crewId, groupId}) {
    return newAxios.delete('/crew/' + crewId + '/group/' + groupId)
      .then((res) => {
        return res.data.body
      })
  },

  createNewMember ({commit}, {crewId, form, memberId}) {
    return newAxios.post('/crew/' + crewId + '/member/' + (memberId ? +memberId : 'create'), form)
      .then((res) => {

        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },

  deleteMember ({commit}, {crewId, memberId}) {
    return newAxios.delete('/crew/' + crewId + '/member/' + memberId)
      .then((res) => {
        return res.data.body
      })
  },

  createStops ({commit}, {id, data}) {
    return newAxios.post('/member/' + id + '/stop/create', data)
      .then((res) => {
        // TODO
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  copyStops ({commit}, {crewId, memberId}) {

    return newAxios.put('/crew/' + crewId + '/member/' + memberId + '/copy-stops')
      .then((res) => {
        return res.data.body
      }).catch((error) => Promise.reject(error.data))
  },
  createGroup ({commit}, {id, data}) {
    return newAxios.post('/crew/' + id + '/group/create', data)
      .then().catch((error) => Promise.reject(error.data))
  },

  sendOnePass ({commit}, id) {
    return newAxios.post('/member/auth/' + id + '/send-password')
      .then((res) => {
        return res
      })
      .catch((error) => Promise.reject(error.data))
  },
  sendPasswordForAll ({commit}, {crewId, groupId}) {
    return newAxios.put('crew/' + crewId + '/passwords')
      .then((res) => {
        return res
      })
      .catch((error) => Promise.reject(error.data))
  },

  addFirebaseAlerts ({commit}, alerts) {
    commit('SET_FIREBASE_ALERTS', alerts)
  },

  getAlertsList ({commit}, string) {
    const getParam = string ? '?' + string : '';

    return newAxios.get('notification/' + getParam)
      .then((res) => {
        commit('SET_ALERTS', {string, res: res.data.body});
        return res
      })
  },
  readAlerts ({commit}, {string, crewGroupId, crewId}) {
    const getParam = string ? '?' + string : '';

    return newAxios.put('notification/read' + getParam)
      .then((res) => {

        let type = 'individual';

        if (crewGroupId) {
          type = 'crewGroup'
        }
        if (crewId) {
          type = 'crew'
        }

        commit('SET_ALERTS_COUNT', {notificationCount: 0, type})
        commit('SET_READ_ALERTS')
        return res
      })
  },
  getCrewManagers ({commit}, id) {
    return newAxios.get(`/crew/${id}/manager/`)
      .then((res) => {
        commit('SET_CREW_MANAGERS_LIST', res.data.body)
        return res.data.body
      })
  },
  getAllManagers ({commit}) {
    return newAxios.get('/manager/')
      .then((res) => {
        commit('SET_ALL_MANAGERS_LIST', res.data.body.items)
        return res.data.body.items
      })
  },
  addCrewManager ({commit}, {id, data}) {
    console.log('add ', id, data);
    return newAxios.post('/crew/' + id + '/manager/add', data)
      .then().catch((error) => Promise.reject(error.data))
  },
  removeCrewManager ({commit}, {crewId, managerId}) {
    console.log('remove ', crewId, managerId);
    return newAxios.delete('/crew/' + crewId + '/manager/' + managerId)
      .then().catch((error) => Promise.reject(error.data))
  },

    //ACCEPTED CONDITIONS
  acceptedTerms ({commit}, {data}) {
    return newAxios.post('/user/accept-terms', data)
      .then((res) => {
        commit('SET_USER', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },
  acceptedPrivacy ({commit}, {data}) {
    return newAxios.post('/user/accept-privacy', data)
      .then((res) => {
        commit('SET_USER', res.data.body)
        return res.data.body
      })
      .catch((error) => Promise.reject(error.data))
  },

  // AUTH
  setupUser ({commit}, user) {

    const token = user.apiKey
    VueCookie.set('auth_token', token)
    commit('SET_USER', user)
  },
  signUp ({dispatch, commit}, data) {
    return newAxios.post('/auth/registration', data)
      .then((res) => {
        dispatch('setupUser', res.data.body)
        return res
      }).catch(error => Promise.reject(error.data))
  },
  signIn ({commit, dispatch}, data) {
    return newAxios.post('/auth/login', data)
      .then((res) => {
        dispatch('setupUser', res.data.body)

        window.location = '/'
        return res
      })
      .catch(error => Promise.reject(error.data))
  },
  forgotPass ({commit}, data) {
    return newAxios.post('/auth/forgot-password', data)
      .then()
      .catch(error => Promise.reject(error.data))
  },
  changePassword ({commit, state}, plainPassword) {
    return newAxios.post('/auth/new-password', {plainPassword}, {
      headers: {
        'x-auth-token': state.currentUser.apiKey
      }
    })
      .then((res) => {
        const token = res.data.body.apiKey
        VueCookie.set('auth_token', token)
        commit('SET_USER', res.data.body)
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },
  restorePassVerification ({commit}, key) {
    return newAxios.get('/auth/user/verification/password-restore/' + key)
      .then((res) => {
        commit('SET_USER', res.data.body)
      })
      .catch(error => Promise.reject(error.data))
  },
  resendVerifyEmail ({commit}, username) {
    return newAxios.post('/auth/registration-email-resend', {username})
      .then((res) => {
        return res
      })
      .catch(error => Promise.reject(error.data))
  },
  verifyEmail ({commit}, key) {
    return newAxios.get('/auth/user/verification/email/' + key)
      .then((res) => {
        commit('SET_USER', res.data.body)
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },
  async getUser ({commit}) {
    return await newAxios.get('/auth/user')
      .then((res) => {
        commit('SET_USER', res.data.body)
        return res.data.body
      })
  },

  //SUPER ADMIN

  // manage company
  getCompanyList ({commit}, search) {
    return newAxios.get('/company/list/' + (search ? '?' + search : ''))
      .then((res) => {
        commit('SET_COMPANY_LIST', res.data.body)
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

  deleteCompany ({commit, state}, id) {
    return newAxios.delete('/company/' + id)
      .then((res) => {
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

  editCompany ({commit, state}, {form, id}) {
    return newAxios.post('/company/edit/' + id, form)
      .then((res) => {
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

  getUserAdminId ({commit}, id) {
    return newAxios.get('/company/' + id + '/admin')
      .then((res) => {
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

  // manage users
  getUsersList ({commit}, search) {
    return newAxios.get('/user/' + (search ? '?' + search : ''))
      .then((res) => {
        commit('SET_USERS_LIST', res.data.body)
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },
  deleteUser ({commit}, id) {
    return newAxios.delete('/user/' + id)
      .then((res) => {
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },
  getUserId ({commit}, id) {
    return newAxios.get('/user/' + id)
      .then((res) => {
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },
  editAdminUser ({commit}, {id, form}) {
    return newAxios.post('/user/edit/' + id, form)
      .then((res) => {
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

  // manage members

  getMembersList ({commit}, search) {
    return newAxios.get('/crew/member/' + (search ? '?' + search : ''))
      .then((res) => {
        commit('SET_MEMBERS_LIST', res.data.body);
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

  // manage groups

  getGroupsList ({commit}, search) {
    return newAxios.get('/crew/group/list/' + (search ? '?' + search : ''))
      .then((res) => {
        commit('SET_GROUPS_LIST', res.data.body)
        return res.data.body
      })
      .catch(error => Promise.reject(error.data))
  },

}

export default createStore
