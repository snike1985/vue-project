import axios from 'axios'
import VueCookie from 'vue-cookie'
import Cookies from 'cookies'

const configAx = {}

export const newAxios = axios.create({
  baseURL: process.env.baseUrl
})

newAxios.interceptors.request.use((config) => {
  let auth_token
  if (process.server) {
    const cookies = new Cookies(configAx.req, configAx.res)
    auth_token = cookies.get('auth_token')
  } else {
    auth_token = VueCookie.get('auth_token')
  }

  if (auth_token) {
    config.headers['x-auth-token'] = auth_token
  }

  return config
})

newAxios.interceptors.response.use((response) => {
  return response
}, function (error) {
  // Do something with response error
  if (error.response.status === 401) {
    if (process.server) {
      const cookies = new Cookies(configAx.req, configAx.res)
      cookies.set('auth_token', null)
    } else {
      VueCookie.delete('auth_token')
    }
    configAx.redirect('/login')
  }
  return Promise.reject(error.response)
})

export function setConfig (req, res, redirect) {
  configAx.req = req
  configAx.res = res
  configAx.redirect = redirect
}
