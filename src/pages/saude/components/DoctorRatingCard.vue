<template>
  <!-- the ratings of an employee (hr EmployeeRating): average, count, the
       distribution of the stars and the approved comments. The viewer chooses
       the scope: this clinic, or the same professional in every clinic of the
       platform that shares them. Whoever moderates sees the pending comments. -->
  <s-card flat bordered data-test="doctor-rating">
    <q-card-section class="section-title row items-center no-wrap q-gutter-x-sm">
      <q-icon name="star_rate" size="20px" />
      <div>{{ tdc('Patient ratings') }}</div>
      <q-space />
      <q-btn-toggle
        :model-value="scope"
        dense no-caps unelevated
        toggle-color="primary"
        :options="scopeOptions"
        data-test="rating-scope"
        @update:model-value="value => emit('update:scope', value)"
      >
        <template #entity><s-tooltip>{{ tdc('Ratings given in this clinic') }}</s-tooltip></template>
        <template #global><s-tooltip>{{ tdc('Ratings of this professional in every clinic of the platform') }}</s-tooltip></template>
      </q-btn-toggle>
    </q-card-section>
    <q-separator />

    <q-card-section v-if="loading" class="flex flex-center q-pa-md">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="32px" />
    </q-card-section>

    <q-card-section v-else-if="!rating?.count" class="text-grey-6" data-test="rating-empty">
      {{ tdc('No ratings yet.') }}
    </q-card-section>

    <template v-else>
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-sm-4 column items-center">
          <div class="rating-average" data-test="rating-average">{{ formatAverage(rating.average) }}</div>
          <q-rating :model-value="rating.average || 0" readonly size="22px" color="amber" icon="star_border" icon-selected="star" icon-half="star_half" />
          <div class="text-caption text-grey-7">{{ rating.count }} {{ tdc(rating.count === 1 ? 'rating' : 'ratings') }}</div>
        </div>
        <div class="col-12 col-sm-8">
          <div v-for="n in [5, 4, 3, 2, 1]" :key="n" class="row items-center no-wrap q-gutter-x-sm">
            <div class="text-caption" style="width: 14px">{{ n }}</div>
            <q-icon name="star" color="amber" size="14px" />
            <q-linear-progress :value="share(n)" color="amber" track-color="grey-3" rounded size="8px" class="col" />
            <div class="text-caption text-grey-7" style="width: 28px; text-align: right">{{ rating.distribution?.[n] || 0 }}</div>
          </div>
        </div>
      </q-card-section>
    </template>

    <template v-if="!loading && rating?.comments?.length">
      <q-separator />
      <q-list dense separator data-test="rating-comments">
        <q-item v-for="c in rating.comments" :key="c.id">
          <q-item-section>
            <q-item-label class="row items-center q-gutter-x-sm">
              <q-rating :model-value="c.stars" readonly size="14px" color="amber" icon="star_border" icon-selected="star" />
              <span class="text-caption text-grey-7">{{ ds(c.date) }}</span>
            </q-item-label>
            <q-item-label class="pre-line">{{ c.comment }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>

    <template v-if="!loading && rating?.pending?.length">
      <q-separator />
      <q-card-section class="text-subtitle2 q-pb-none">{{ tdc('Comments awaiting approval') }}</q-card-section>
      <q-list dense separator data-test="rating-pending">
        <q-item v-for="c in rating.pending" :key="c.id">
          <q-item-section>
            <q-item-label class="row items-center q-gutter-x-sm">
              <q-rating :model-value="c.stars" readonly size="14px" color="amber" icon="star_border" icon-selected="star" />
              <span class="text-caption text-grey-7">{{ ds(c.date) }}</span>
            </q-item-label>
            <q-item-label class="pre-line">{{ c.comment }}</q-item-label>
          </q-item-section>
          <q-item-section side class="row no-wrap">
            <div class="row no-wrap q-gutter-x-xs">
              <s-btn round flat dense color="positive" icon="check" data-test="rating-approve" @click="emit('moderate', c, 'approved')">
                <s-tooltip>{{ tdc('Approve comment') }}</s-tooltip>
              </s-btn>
              <s-btn round flat dense color="negative" icon="close" data-test="rating-reject" @click="emit('moderate', c, 'rejected')">
                <s-tooltip>{{ tdc('Reject comment') }}</s-tooltip>
              </s-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </s-card>
</template>

<script setup>
import { computed } from 'vue'
import { tdc, ds } from 'quasar_resaas'

const props = defineProps({
  // {scope, average, count, distribution: {"1".."5"}, comments, pending?}
  rating: { type: Object, default: null },
  scope: { type: String, default: 'entity' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:scope', 'moderate'])

const scopeOptions = computed(() => [
  { value: 'entity', label: tdc('This clinic'), slot: 'entity' },
  { value: 'global', label: tdc('All clinics'), slot: 'global' }
])

const formatAverage = value => (value == null ? '—' : Number(value).toFixed(1))
const share = n => (props.rating?.count ? (props.rating.distribution?.[n] || 0) / props.rating.count : 0)
</script>

<style scoped>
.section-title {
  font-weight: 600;
}

.rating-average {
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}

.pre-line {
  white-space: pre-line;
}
</style>
