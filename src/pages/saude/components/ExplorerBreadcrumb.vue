<template>
  <div class="breadcrumb-area">
    <div class="row items-center no-wrap">

      <q-btn
        dense
        flat
        color="primary"
        icon="home"
        label="Resultados"
        @click="$emit('root')"
      />

      <template
        v-for="(item, index) in caminho"
        :key="item.id"
      >
        <q-icon
          name="chevron_right"
          size="18px"
          class="q-mx-xs text-grey-7"
        />

        <q-btn
          dense
          flat
          color="primary"
          icon="folder"
          :label="item.nome"
          @click="$emit('go-to', index)"
        />
      </template>

    </div>
  </div>
</template>

<script setup>
defineProps({
  caminho: {
    type: Array,
    default: () => []
  }
})

defineEmits([
  'root',
  'go-to'
])
</script>

<style scoped>
.breadcrumb-area {
  padding: 10px 18px;
  background: #fafafa;
  overflow-x: auto;
}
</style>
