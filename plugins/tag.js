import Vue from 'vue'
Vue.filter('emptytag', (tagList) => {
  tagList = [...new Set(tagList)]
  return tagList.filter((tag) => {
    if (tag.length === 0) return false
    // 过滤掉无效字符, 因为asc码最大7424 超出的将会解析为空字符, 所以需要过滤掉这些无用的数据
    // https://asecuritysite.com/coding/asc2
    if (tag.charCodeAt() > 7424) return false
    return true
  })
})
