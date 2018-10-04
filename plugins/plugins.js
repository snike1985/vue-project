// Require dependencies

import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VeeValidate from 'vee-validate'
import VueTheMask from 'vue-the-mask'

Vue.use(VeeValidate, { fieldsBagName: 'veeFields' })
Vue.use(VueCookie)
Vue.use(VueTheMask)
