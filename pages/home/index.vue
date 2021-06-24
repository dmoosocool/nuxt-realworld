<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'your_feed' }"
                  :to="{ name: 'Home', query: { tab: 'your_feed' } }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'global_feed' }"
                  :to="{ name: 'Home' }"
                >
                  Global Feed
                </nuxt-link>
              </li>

              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'tag' }"
                  :to="{ name: 'Home', query: { tab: 'tag', tag } }"
                >
                  # {{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
            v-for="article in articles"
            :key="article.slug"
            class="article-preview"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'Profile',
                  params: { username: '@' + article.author.username },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'Profile',
                    params: { username: '@' + article.author.username },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{ name: 'Article', params: { slug: article.slug } }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>

              <ul class="tag-list">
                <li
                  v-for="aTag in article.tagList"
                  :key="aTag"
                  class="tag-default tag-pill tag-outline"
                >
                  {{ aTag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div v-if="tags.length > 0" class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'Home',
                  query: {
                    tag,
                    tab: 'tag',
                  },
                }"
                class="tag-pill tag-default"
              >
                {{ tag }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  // 特殊Nuxtjs 钩子, 将会在ssr之前执行且仅会在`server`端执行,
  // Nuxtjs 将 asyncData的返回对象合并至 this.datas 里
  // 仅在需要ssr的页面中使用, 不需要ssr时, 应该使用常规的发请求的方法.
  async asyncData({ query, $axios }) {
    // 当前页码, 如果为空默认第1页
    const page = Number.parseInt(query.page || 1)
    // 每页显示的个数
    const limit = 20
    // 当前的tab
    const tab = query.tab || 'global_feed'
    // 是否需要过滤标签
    const tag = query.tag

    const getArticles = (params) => $axios.$get('/api/articles', { params })
    const getYourFeedArticles = (params) =>
      $axios.$get('/api/articles/feed', { params })

    const getTags = () => $axios.$get('/api/tags')

    // 当前tab要么是 'global_feed' 要么是 'your_feed'
    // 根据当前激活的tab选项卡进行请求
    const loadArticles = tab === 'your_feed' ? getYourFeedArticles : getArticles

    // 获取文章列表及标签
    const [ArticlesRes, TagsRes] = await Promise.all([
      loadArticles({ limit, offset: (page - 1) * limit, tag }),
      getTags(),
    ])

    const { articles, articlesCount } = ArticlesRes
    let { tags } = TagsRes

    tags = tags.filter((item) => {
      if (item.length === 0) return false
      // 过滤掉无效字符
      // https://asecuritysite.com/coding/asc2
      if (item.charCodeAt() > 7424) return false
      return true
    })
    return { articles, articlesCount, tags, limit, page, tab, tag }
  },

  computed: {
    ...mapState(['user']),
  },

  // 监听当前页面属性发生变化
  watchQuery: ['page', 'tag', 'tab'],
}
</script>
