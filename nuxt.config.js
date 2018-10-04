const webpack = require('webpack');
const baseUrl = (process.env.NODE_ENV === 'production' ? 'https://api.jurnez-admin.com/v1' : 'https://api.jurnez-server.com/v1');
const firebaseKey = (process.env.NODE_ENV === 'production' ? 'AIzaSyBsAkjIKoSdWj2fppl4_4TiZf3j9ipbBws' : 'AIzaSyBxJFzj6L6sNEMSNinc2oA1TZIYuERW0Vs');
const firebaseUrl = (process.env.NODE_ENV === 'production' ? 'https://jurnez-prod.firebaseio.com/' : 'https://jurnez-197511.firebaseio.com');
const firebaseDomain = (process.env.NODE_ENV === 'production' ? 'jurnez-prod.firebaseio.com' : 'jurnez-197511.firebaseio.com');
const stripeKey = (process.env.NODE_ENV === 'production' ? 'pk_live_RGVgAZpiyK5G025jN0dIcZ9b' : 'pk_test_J8BY5AJUHHyiSH1pZ3bEgviz');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'JEZ',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'JEZ'}
    ],
    script: [
      {src: 'https://js.stripe.com/v3/'},
      {src: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js', async: true},
      {src: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js'},
      {src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBxJFzj6L6sNEMSNinc2oA1TZIYuERW0Vs&libraries=places'},
      {src: '/js/fonts.js'}
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://maxcdn.icons8.com/fonts/line-awesome/1.1/css/line-awesome-font-awesome.min.css'
      },
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  // loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */

  router: {
    middleware: ['auth'],
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
      return {x: 0, y: 0}
    }
  },
  css: [
    {src: '~/static/scss/theme.scss', lang: 'scss'},
    {src: '~/assets/scss/app.scss', lang: 'scss'}
  ],
  plugins: [
    '~/plugins/bootstrap.js',
    '~/plugins/setupFirebase.js',
    '~/plugins/plugins.js',
    '~/plugins/dateFilter.js',
    '~/plugins/axios-interseptors.js',
  ],
  env: {
    baseUrl: baseUrl,
    stripeKey: stripeKey,
    firebaseKey: firebaseKey,
    firebaseUrl: firebaseUrl,
    firebaseDomain: firebaseDomain
  },
  module: [],
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: [
      'firebase/app',
      'firebase/database',
      'firebase/auth',
      'jquery',
      'axios',
      'bootstrap/dist/js/bootstrap.bundle.js',
      'lodash',
      'moment',
      'bootstrap-daterangepicker',
      'bootstrap-datepicker',
      'vue-datetime-picker',
      'eonasdan-bootstrap-datetimepicker'
    ],
    extractCSS: {
      allChunks: true
    },

    extend (config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      const extract = config.plugins.find(plugin => plugin.renderExtractedChunk)
      extract.options.allChunks = true
    },
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery'
      })
    ]
  }

}
