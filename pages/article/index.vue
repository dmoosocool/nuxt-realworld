<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

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
            <span class="date">{{ article.date | date('MMMM DD, YYYY') }}</span>
          </div>

          <template
            v-if="
              current &&
              current.username &&
              current.username === article.author.username
            "
          >
            <span>
              <nuxt-link
                class="btn btn-outline-secondary btn-sm"
                :to="{ name: 'EditorArticle', params: { slug: article.slug } }"
              >
                <i class="ion-edit"></i> Edit Article
              </nuxt-link>

              <button
                class="btn btn-outline-danger btn-sm"
                @click="handlerDeleteArticle()"
              >
                <i class="ion-trash-a"></i> Delete Article
              </button>
            </span>
          </template>
          <template v-else>
            <button
              class="btn btn-sm"
              :class="
                article.author.following
                  ? 'btn-secondary'
                  : 'btn-outline-secondary'
              "
              @click="handlerFollow(article.author.following)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ article.author.following ? 'Unfollow' : 'Follow' }}
              {{ article.author.username }}
            </button>
            &nbsp;&nbsp;
            <button
              class="btn btn-sm"
              :class="article.favorited ? 'btn-primary' : 'btn-outline-primary'"
              @click="handlerFavorite(article.favorited)"
            >
              <i class="ion-heart"></i>
              &nbsp; Favorite Post
              <span class="counter">({{ article.favoritesCount }})</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div class="markdown" v-html="article.body"></div>

          <ul class="tag-list">
            <li
              v-for="aTag in $options.filters.emptytag(article.tagList)"
              :key="aTag"
              class="tag-default tag-pill tag-outline"
            >
              {{ aTag }}
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <Meta :article="article" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <Comments :article="article" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Markdown from 'markdown-it'
import { mapState } from 'vuex'
import Comments from '~/components/comments.vue'
import Meta from '~/components/meta.vue'

export default {
  name: 'ArticleIndex',
  components: {
    Comments,
    Meta,
  },
  async asyncData({ $axios, params }) {
    const { slug } = params
    const { article } = await $axios.$get(`/api/articles/${slug}`)
    const md = new Markdown()
    article.body = md.render(article.body)

    return { article, slug }
  },
  computed: {
    ...mapState({ current: 'user' }),
  },

  methods: {
    async handlerFollow(isFollow) {
      const action = isFollow
        ? () =>
            this.$axios.$delete(
              `/api/profiles/${this.article.author.username}/follow`
            )
        : () =>
            this.$axios.$post(
              `/api/profiles/${this.article.author.username}/follow`
            )
      await action()
      this.article.author.following = !isFollow
    },

    async handlerFavorite(isFavorite) {
      const action = isFavorite
        ? () =>
            this.$axios.$delete(`/api/articles/${this.article.slug}/favorite`)
        : () => this.$axios.$post(`/api/articles/${this.article.slug}/favorite`)
      await action()
      this.article.favorited = !isFavorite
      this.article.favoritesCount = isFavorite
        ? this.article.favoritesCount - 1
        : this.article.favoritesCount + 1
    },

    async handlerDeleteArticle() {
      try {
        await this.$axios.$delete(`/api/articles/${this.slug}`)
      } finally {
        this.$router.push({ name: 'Home', query: { tab: 'your_feed' } })
      }
    },
  },
}
</script>
