<template>
  <div class="wb">
    <div class="row items-center no-wrap q-gutter-x-xs q-mb-xs wb-tools">
      <s-btn
        v-for="c in colors" :key="c" round dense unelevated size="sm"
        :style="{ background: c, outline: color === c && !erasing ? '3px solid var(--q-primary)' : 'none' }"
        @click="color = c; erasing = false"
      >
        <s-tooltip>{{ tdc('Pen colour') }}</s-tooltip>
      </s-btn>
      <q-separator vertical inset class="q-mx-xs" />
      <s-btn v-for="w in widths" :key="w" flat round dense size="sm" :color="width === w ? 'primary' : undefined" @click="width = w">
        <span :style="{ display: 'inline-block', width: `${w + 4}px`, height: `${w + 4}px`, borderRadius: '50%', background: 'currentColor' }" />
        <s-tooltip>{{ tdc('Line width') }}</s-tooltip>
      </s-btn>
      <q-separator vertical inset class="q-mx-xs" />
      <s-btn flat round dense icon="ink_eraser" :color="erasing ? 'primary' : undefined" @click="erasing = !erasing">
        <s-tooltip>{{ tdc('Eraser') }}</s-tooltip>
      </s-btn>
      <s-btn flat round dense icon="undo" :disable="!history.length" @click="undo">
        <s-tooltip>{{ tdc('Undo') }}</s-tooltip>
      </s-btn>
      <s-btn flat round dense icon="delete_sweep" @click="clear">
        <s-tooltip>{{ tdc('Clear the board') }}</s-tooltip>
      </s-btn>
    </div>
    <canvas
      ref="canvas" class="wb-canvas" :width="w" :height="h" data-test="whiteboard"
      @pointerdown="start" @pointermove="move" @pointerup="end" @pointerleave="end"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { tdc } from 'quasar_resaas'

// The digital board's drawing surface (pointer: mouse, touch or pen). The
// page saves it as a PNG attachment of the lesson (toBlob()).
const props = defineProps({ w: { type: Number, default: 1200 }, h: { type: Number, default: 640 } })
const canvas = ref(null)
const colors = ['#111827', '#1976D2', '#C10015', '#21BA45', '#F2C037', '#9C27B0']
const widths = [2, 4, 8, 14]
const color = ref(colors[0])
const width = ref(4)
const erasing = ref(false)
const history = ref([])
let drawing = false
let ctx = null

function point (event) {
  const rect = canvas.value.getBoundingClientRect()
  return { x: (event.clientX - rect.left) * (props.w / rect.width), y: (event.clientY - rect.top) * (props.h / rect.height) }
}

function start (event) {
  drawing = true
  history.value.push(ctx.getImageData(0, 0, props.w, props.h))
  if (history.value.length > 30) history.value.shift()
  const p = point(event)
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
  canvas.value.setPointerCapture?.(event.pointerId)
}

function move (event) {
  if (!drawing) return
  const p = point(event)
  ctx.globalCompositeOperation = erasing.value ? 'destination-out' : 'source-over'
  ctx.strokeStyle = color.value
  ctx.lineWidth = erasing.value ? width.value * 4 : width.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
}

function end () {
  drawing = false
}

function undo () {
  const last = history.value.pop()
  if (last) ctx.putImageData(last, 0, 0)
}

function clear () {
  history.value.push(ctx.getImageData(0, 0, props.w, props.h))
  ctx.clearRect(0, 0, props.w, props.h)
}

// a PNG of the drawing on a white background
function toBlob () {
  const out = document.createElement('canvas')
  out.width = props.w
  out.height = props.h
  const o = out.getContext('2d')
  o.fillStyle = '#fff'
  o.fillRect(0, 0, props.w, props.h)
  o.drawImage(canvas.value, 0, 0)
  return new Promise(resolve => out.toBlob(resolve, 'image/png'))
}

onMounted(() => { ctx = canvas.value.getContext('2d') })

defineExpose({ toBlob, clear })
</script>

<style scoped>
.wb-tools { overflow-x: auto; }
.wb-canvas { width: 100%; aspect-ratio: 15 / 8; background: #fff; border-radius: 12px; border: 1px solid rgba(128, 128, 128, 0.3);
             touch-action: none; cursor: crosshair; }
</style>
