<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <button
              v-if="current && current.username === profile.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="$router.push({ name: 'Settings' })"
            >
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </button>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="handlerFollow(profile.following)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ !profile.following ? 'Follow' : 'Unfollow' }}
              {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'my_article' }"
                  :to="{
                    name: 'Profile',
                    query: { tab: 'my_article' },
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'favorited_article' }"
                  :to="{
                    name: 'Profile',
                    query: {
                      tab: 'favorited_article',
                    },
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <template v-if="myArticle.length > 0">
            <div
              v-for="article in myArticle"
              :key="article.slug"
              class="article-preview"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'Profile',
                    params: { username: `@${article.author.username}` },
                  }"
                >
                  <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    class="author"
                    :to="{
                      name: 'Profile',
                      params: { username: `@${article.author.username}` },
                    }"
                  >
                    {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">
                    {{ article.date | date('MMMM DD, YYYY') }}
                  </span>
                </div>
                <button
                  class="btn btn-sm pull-xs-right"
                  :class="
                    article.favorited ? 'btn-primary' : 'btn-outline-primary '
                  "
                  @click="handlerFavorite(article)"
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

                <ul v-if="article.tagList.length > 0" class="tag-list">
                  <li
                    v-for="aTag in article.tagList"
                    :key="`profile-article-tag-${aTag}`"
                    class="tag-default tag-pill tag-outline"
                  >
                    {{ aTag }}
                  </li>
                </ul>
              </nuxt-link>
            </div>
          </template>

          <template v-else>
            <div class="article-preview">No articles are here... yet.</div>
          </template>

          <nav v-if="totalPage > 1">
            <ul class="pagination">
              <li
                v-for="item in totalPage"
                :key="`page_count_${item}`"
                :class="{ active: item === page }"
                class="page-item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'Profile',
                    query: { page: item, tab },
                    params: { username: `@${profile.username}` },
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProfileIndex',

  async asyncData({ params, query, $axios }) {
    let { username } = params
    let { tab } = query

    // replace @username => username
    username = username.replace('@', '')

    const page = +query.page || 1
    const limit = 5
    const offset = (page - 1) * limit
    tab = tab ?? 'my_article'

    // Article params.
    const ArticleParams = {
      limit,
      offset,
    }

    // dispose article api by tab value
    if (tab === 'my_article') ArticleParams.author = username
    if (tab === 'favorited_article') ArticleParams.favorited = username

    const [{ profile }, { articles: myArticle, articlesCount }] =
      await Promise.all([
        $axios.$get(`/api/profiles/${username}`),
        $axios.$get('/api/articles', {
          params: ArticleParams,
        }),
      ])

    return { profile, limit, offset, myArticle, articlesCount, tab, page }
  },

  computed: {
    ...mapState({ current: 'user' }),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
  },
  watchQuery: ['tab', 'page'],

  methods: {
    async handlerFollow(isFollow) {
      const action = isFollow
        ? () =>
            this.$axios.$delete(`/api/profiles/${this.profile.username}/follow`)
        : () =>
            this.$axios.$post(`/api/profiles/${this.profile.username}/follow`)
      await action()
      this.profile.following = !this.profile.following
    },

    async handlerFavorite(article) {
      const action = article.favorited
        ? () => this.$axios.$delete(`/api/articles/${article.slug}/favorite`)
        : () => this.$axios.$post(`/api/articles/${article.slug}/favorite`)
      await action()
      this.myArticle.forEach((item) => {
        if (article.slug === item.slug) {
          item.favorited = !article.favorited
          item.favoritesCount = article.favorited
            ? item.favoritesCount + 1
            : item.favoritesCount - 1
        }
      })
    },
  },
}
</script>
