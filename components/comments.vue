<template>
  <div>
    <form class="card comment-form" @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea
          v-model="commentContent"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="current.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'Profile',
            params: {
              username: `@${comment.author.username}`,
            },
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'Profile',
            params: {
              username: `@${comment.author.username}`,
            },
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">
          {{ comment.createdAt | date('MMM DD, YYYY') }}
        </span>
        <span
          v-if="current.username === comment.author.username"
          class="mod-options"
          @click="handlerDeleteComment(comment.id)"
        >
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Comments',
  props: {
    article: { type: Object, required: true },
  },
  data() {
    return {
      comments: [],
      commentContent: '',
    }
  },
  computed: {
    ...mapState({ current: 'user' }),
  },
  async mounted() {
    const { comments } = await this.$axios.$get(
      `/api/articles/${this.article.slug}/comments`
    )
    this.comments = comments
  },
  methods: {
    async onSubmit() {
      const data = {
        comment: { body: this.commentContent },
      }
      const { comment } = await this.$axios.$post(
        `/api/articles/${this.article.slug}/comments`,
        data
      )
      this.comments.unshift(comment)
      this.commentContent = ''
    },

    async handlerDeleteComment(id) {
      await this.$axios.$delete(
        `/api/articles/${this.article.slug}/comments/${id}`
      )

      this.comments = this.comments.filter((c) => c.id !== id)
    },
  },
}
</script>
