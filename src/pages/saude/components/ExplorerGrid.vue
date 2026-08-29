<template>

  <div class="explorer-container">

    <ExplorerItem
      v-for="folder in folders"
      :key="folder.id"
      :item="folder"
      :selected="selected"
      @select="$emit('select',$event)"
      @open="$emit('open-folder',$event)"
    />

    <ExplorerItem
      v-for="file in files"
      :key="file.id"
      :item="file"
      :selected="selected"
      @select="$emit('select',$event)"
      @open="$emit('open-file',$event)"
    />

    <div
      v-if="!folders.length && !files.length"
      class="empty-folder"
    >

      <q-icon
        name="folder_off"
        size="90px"
        color="grey-5"
      />

      <div class="text-grey-7 text-subtitle1 q-mt-md">
        Esta pasta está vazia
      </div>

    </div>

  </div>

</template>

<script setup>

import ExplorerItem from './ExplorerItem.vue'

defineProps({

    folders:{
        type:Array,
        default:()=>[]
    },

    files:{
        type:Array,
        default:()=>[]
    },

    selected:{
        type:Object,
        default:null
    }

})

defineEmits([
    'select',
    'open-folder',
    'open-file'
])

</script>

<style scoped>

.explorer-container{

    display:flex;

    flex-wrap:wrap;

    align-items:flex-start;

    gap:20px;

    padding:25px;

    min-height:500px;

}

.empty-folder{

    width:100%;

    padding:60px;

    text-align:center;

}

</style>
