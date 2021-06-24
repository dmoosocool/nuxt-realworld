// 判断是否登陆的中间件
export default function ({ store, redirect }) {
  // 如果没有在vuex找到当前用户, 则证明没登陆, 那么就重定向到登录页面
  if (!store.state.user) {
    return redirect('/login')
  }
}
