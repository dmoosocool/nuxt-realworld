export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-realworld',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'http://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'http://fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/static/css/style.css'],

  cssSourceMap: true,
  //
  server: {
    host: '0.0.0.0',
    port: 3001,
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/request.js', '~/plugins/dayjs.js', '~/plugins/tag.js'],

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
  build: {
    extractCSS: true,

    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        // Disable a plugin by passing false as value
        'postcss-import': {},
        'postcss-url': {},
        'postcss-preset-env': {},
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true,
        },
      },
    },
  },

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
            path: '/editor/:slug',
            component: resolve(__dirname, 'pages/edit'),
            name: 'EditorArticle',
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
