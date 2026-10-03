<template>
  <q-page data-test="docodela-blog-page">
    <BlogComp />
  </q-page>
</template>

<script>
import { defineComponent } from "vue"
import BlogComp from "../components/BlogComp.vue"

// /blog: the articles of blog.js (each opens /blog/:slug)
export default defineComponent({
  components: { BlogComp },
})
</script>
