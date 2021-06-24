// 与authenticated中间件相反, 用于处理一些不需要登录的页面
// 比如登陆注册页面,
// 如果是使用了该中间件的视图, 并且已经登录过的用户会自动跳转到项目的根目录
export default function ({ store, redirect }) {
  if (store.state.user) {
    return redirect('/')
  }
}
