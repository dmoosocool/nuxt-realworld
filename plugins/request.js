export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    // if not have authorization, redirect to login page
    if (code === 401) {
      redirect('/login')
      return Promise.resolve()
    }
    return Promise.reject(error)
  })
}
