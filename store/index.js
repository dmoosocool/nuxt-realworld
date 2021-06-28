const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    // vuex中存放已登陆用户的信息
    user: null,
  }
}

export const mutations = {
  setUser(state, data) {
    state.user = data
  },
}

export const actions = {
  // nuxtServerInit 是nuxt的一个特殊方法 这个action 会在服务端渲染期间自动调用
  // 初始化容器数据, 传递数据给客户端使用
  nuxtServerInit({ commit }, { req }) {
    let user = null
    // 如果请求头中带有cookie, 那么就解析cookie 并将cookie中的user解析出来存放在vuex中

    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } finally {
        commit('setUser', user)
      }
    }
  },
}
