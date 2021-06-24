export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }

    return config
  })

  $axios.onError((error) => Promise.reject(error))
}
