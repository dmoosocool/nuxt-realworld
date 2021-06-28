<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form v-if="user" @submit.prevent="handlerSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="handlerLogout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'SettingIndex',
  middleware: 'authenticated',

  async asyncData({ $axios }) {
    const { user } = await $axios.$get('/api/user')
    return { user }
  },
  // computed: {
  //   ...mapState(['user']),
  // },

  methods: {
    async handlerSubmit() {
      try {
        const data = {
          user: this.user,
        }
        const { user } = await this.$axios.$put('/api/user', data)
        // 修改当前用户信息
        this.$store.commit('setUser', user)
        Cookie.set('user', user)
      } finally {
        this.$router.push({
          name: 'Profile',
          params: { username: `@${this.user.username}` },
        })
      }
    },

    handlerLogout() {
      try {
        Cookie.set('user', null)
        this.$store.commit('setUser', null)
      } finally {
        this.$router.push({
          name: 'Home',
        })
      }
    },
  },
}
</script>
