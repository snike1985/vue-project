import {setConfig, newAxios} from '~/plugins/axios'

export default ({app, store, req, res, redirect}) => {
  setConfig(req, res, redirect)
}
