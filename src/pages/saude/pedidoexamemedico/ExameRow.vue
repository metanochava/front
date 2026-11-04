<template>
  <!-- one compact line per exam: name + code, a star that puts it on (or takes
       it off) the Entity's favourites, and a button that adds it to the
       request (a check once it is in the request) -->
  <div
    class="exame-row row items-center no-wrap cursor-pointer"
    :class="{ 'exame-row--added': added }"
    data-test="exame-row"
    @click="emit('add')"
  >
    <s-btn
      v-if="canFavourite"
      dense
      flat
      round
      size="sm"
      :icon="favourite ? 'star' : 'star_outline'"
      :color="favourite ? 'amber-8' : 'grey-6'"
      class="q-mr-xs"
      data-test="exame-favourite"
      @click.stop="emit('toggle-favourite')"
    >
      <s-tooltip>{{ favourite ? tdc('Remove from favourites') : tdc('Add to favourites') }}</s-tooltip>
    </s-btn>
    <q-icon v-else-if="favourite" name="star" color="amber-8" size="16px" class="q-mr-xs" />

    <div class="col ellipsis text-body2">
      <s-highlight :text="exame.nome" :search="search" />
      <span v-if="exame.codigo" class="text-caption q-ml-xs" style="opacity: .7"><s-highlight :text="exame.codigo" :search="search" /></span>
      <s-tooltip>{{ exame.codigo ? `${exame.codigo} - ${exame.nome}` : exame.nome }}</s-tooltip>
    </div>
    <q-icon
      :name="added ? 'check_circle' : 'add_circle_outline'"
      :color="added ? 'positive' : 'primary'"
      size="18px"
      class="q-ml-xs"
    />
  </div>
</template>

<script setup>
import { tdc } from 'quasar_resaas'

defineProps({
  exame: { type: Object, required: true },
  search: { type: String, default: '' },
  added: Boolean,
  favourite: Boolean,
  // the star only for who may change the list (add_ / delete_favouriteexam)
  canFavourite: Boolean,
})

const emit = defineEmits(['add', 'toggle-favourite'])
</script>
