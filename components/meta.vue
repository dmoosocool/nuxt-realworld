<template>
  <div class="article-meta">
    <template v-if="currentArticle">
      <nuxt-link
        :to="{
          name: 'Profile',
          params: {
            username: `@${currentArticle.author.username}`,
          },
        }"
      >
        <img :src="currentArticle.author.image" />
      </nuxt-link>
      <div class="info">
        <nuxt-link
          class="author"
          :to="{
            name: 'Profile',
            params: {
              username: `@${currentArticle.author.username}`,
            },
          }"
        >
          {{ currentArticle.author.username }}
        </nuxt-link>
        <span class="date">
          {{ currentArticle.createdAt | date('MMM DD, YYYY') }}
        </span>
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
          class="btn btn-sm btn-outline-secondary"
          :class="{
            active: currentArticle.author.following,
          }"
          @click="handlerFollow(article.author.following)"
        >
          <i class="ion-plus-round"></i>
          &nbsp; {{ currentArticle.author.following ? 'Unfollow' : 'Follow' }}
          {{ currentArticle.author.username }}
        </button>
        &nbsp;&nbsp;
        <button
          class="btn btn-sm btn-outline-primary"
          :class="{
            active: currentArticle.favorited,
          }"
          @click="handlerFavorite(currentArticle.favorited)"
        >
          <i class="ion-heart"></i>
          &nbsp; Favorite Post
          <span class="counter">({{ currentArticle.favoritesCount }})</span>
        </button>
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    currentArticle() {
      return this.article
    },

    ...mapState({ current: 'user' }),
  },
  methods: {
    async handlerFollow(isFollow) {
      const action = isFollow
        ? () =>
            this.$axios.$delete(
              `/api/profiles/${this.currentArticle.author.username}/follow`
            )
        : () =>
            this.$axios.$post(
              `/api/profiles/${this.currentArticle.author.username}/follow`
            )
      await action()
      this.currentArticle.author.following = !isFollow
    },
    async handlerFavorite(isFavorite) {
      const action = isFavorite
        ? () =>
            this.$axios.$delete(
              `/api/articles/${this.currentArticle.slug}/favorite`
            )
        : () =>
            this.$axios.$post(
              `/api/articles/${this.currentArticle.slug}/favorite`
            )
      await action()
      this.currentArticle.favorited = !isFavorite
      this.currentArticle.favoritesCount = isFavorite
        ? this.currentArticle.favoritesCount - 1
        : this.currentArticle.favoritesCount + 1
    },
  },
}
</script>
