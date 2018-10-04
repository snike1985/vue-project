import Vue from 'vue'
import moment from 'moment-timezone'

export default ({ app, store }) => {
  Vue.filter('date', function (date, format, tz) {
    tz = tz || 'Europe/Kiev';
    if (date) {
      return moment.tz(date, tz).format(format)
    }
  })
}
