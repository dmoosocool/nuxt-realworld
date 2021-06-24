export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-realworld',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  //
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/request.js', '~/plugins/dayjs.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },

  proxy: {
    '/api/': 'https://conduit.productionready.io',
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // router
  router: {
    linkActiveClass: 'active',
    // 清除 Nuxt 的自定义路由规则, 自定义路由规则
    extendRoutes(routes, resolve) {
      routes.splice(0)
      routes.push(
        ...[
          {
            path: '',
            component: resolve(__dirname, 'pages/home'),
            name: 'Home',
          },
          {
            path: '/login',
            component: resolve(__dirname, 'pages/login'),
            name: 'Login',
          },
          {
            path: '/register',
            component: resolve(__dirname, 'pages/login'),
            name: 'Register',
          },
          {
            path: '/profile/:username',
            component: resolve(__dirname, 'pages/profile'),
            name: 'Profile',
          },
          {
            path: '/settings',
            component: resolve(__dirname, 'pages/settings'),
            name: 'Settings',
          },
          {
            path: '/editor',
            component: resolve(__dirname, 'pages/edit'),
            name: 'Editor',
          },
          {
            path: '/article/:slug',
            component: resolve(__dirname, 'pages/article'),
            name: 'Article',
          },
          {
            path: '*',
            component: resolve(__dirname, 'pages/notfound'),
            name: 'NotFound',
          },
        ]
      )
    },
  },
}
