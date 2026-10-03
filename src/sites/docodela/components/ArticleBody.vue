<template>
  <!-- the body of a guide or a blog article (guides.js / blog.js block format):
       p paragraph, h heading, ul bullets, ol numbered {title, text}; then the
       closing sentence highlighted -->
  <div class="article-body">
    <template v-for="(block, index) in blocks" :key="index">
      <h2 v-if="block.type === 'h'" class="article-body__heading">{{ tdc(block.text) }}</h2>
      <p v-else-if="block.type === 'p'" class="article-body__text">{{ tdc(block.text) }}</p>
      <ul v-else-if="block.type === 'ul'" class="article-body__list">
        <li v-for="item in block.items" :key="item">{{ tdc(item) }}</li>
      </ul>
      <ol v-else-if="block.type === 'ol'" class="article-body__steps">
        <li v-for="item in block.items" :key="item.title">
          <strong>{{ tdc(item.title) }}</strong>
          <div>{{ tdc(item.text) }}</div>
        </li>
      </ol>
    </template>

    <div v-if="closing" class="article-body__closing">{{ tdc(closing) }}</div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"

export default defineComponent({
  props: {
    blocks: { type: Array, required: true },
    closing: { type: String, default: '' },
  },
  setup () {
    return { tdc }
  },
})
</script>

<style scoped>
.article-body__heading {
  margin: 32px 0 8px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  color: #10233f;
}

.article-body__text,
.article-body__list,
.article-body__steps {
  font-size: 17px;
  line-height: 1.7;
  color: #3a4a5e;
}

.article-body__list li,
.article-body__steps li {
  margin-bottom: 8px;
}

.article-body__steps strong {
  color: #10233f;
}

.article-body__closing {
  margin-top: 32px;
  padding: 20px 24px;
  border-left: 4px solid #1f8f6b;
  border-radius: 0 12px 12px 0;
  background: #f2faf6;
  color: #10233f;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.6;
}

.body--dark .article-body__heading,
.body--dark .article-body__steps strong,
.body--dark .article-body__closing { color: #eef2f7; }
.body--dark .article-body__text,
.body--dark .article-body__list,
.body--dark .article-body__steps { color: #c5cfdb; }
.body--dark .article-body__closing { background: #16261f; }
</style>
