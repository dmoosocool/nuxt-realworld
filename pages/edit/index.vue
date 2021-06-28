<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul v-if="errors !== {}" class="error-messages">
            <div v-if="errors.title">
              <li v-for="(t, n) in errors.title" :key="'errors-title-' + n">
                title {{ t }}
              </li>
            </div>
            <div v-if="errors.body">
              <li v-for="(b, n) in errors.body" :key="'errors-body-' + n">
                body {{ b }}
              </li>
            </div>
            <div v-if="errors.description">
              <li
                v-for="(d, n) in errors.description"
                :key="'errors-body-' + n"
              >
                description {{ d }}
              </li>
            </div>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  required
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="addTag"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keyup.enter.prevent="handlerAddTag"
                />
                <div v-if="article.tagList.length > 0" class="tag-list">
                  <span
                    v-for="tag in $options.filters.emptytag(article.tagList)"
                    :key="tag"
                    class="tag-default tag-pill"
                  >
                    <i
                      class="ion-close-round"
                      @click="handlerDeleteTag(tag)"
                    ></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click.prevent="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewPost',
  data() {
    return {
      addTag: '',
      errors: {},
      article: {
        title: '',
        description: '',
        body: '',
        tagList: [],
      },
    }
  },

  methods: {
    handlerAddTag() {
      this.article.tagList.push(this.addTag)
      this.addTag = ''
    },

    handlerDeleteTag(tag) {
      this.article.tagList = this.article.tagList.filter((item) => item !== tag)
    },

    async onSubmit() {
      const { article } = this
      try {
        await this.$axios.$post(`/api/articles`, { article })
        this.$router.push({ name: 'Home' })
      } catch (e) {
        this.errors = e.response.data.errors
      }
    },
  },
}
</script>
