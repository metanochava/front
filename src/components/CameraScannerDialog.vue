<template>
  <q-dialog :model-value="modelValue" @update:model-value="onDialogToggle" @hide="stopScanning">
    <s-card style="width: 100%; max-width: 420px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ tdc('Ler Código') }}</div>
        <q-space />
        <q-btn
          v-if="torchSupported"
          flat round dense
          :icon="torchOn ? 'flash_off' : 'flash_on'"
          :color="torchOn ? 'warning' : 'grey-7'"
          @click="toggleTorch"
        />
        <q-btn flat round dense icon="close" @click="close" />
      </q-card-section>

      <q-card-section>
        <div
          id="camera-scanner-reader"
          ref="readerEl"
          class="scanner-box"
        />

        <div v-if="starting" class="flex flex-center q-pa-md">
          <q-spinner color="primary" size="32px" />
        </div>

        <div v-if="errorMsg" class="text-negative text-caption q-mt-sm text-center">
          {{ errorMsg }}
        </div>

        <div v-if="lastDecoded" class="text-center q-mt-sm">
          <q-badge color="positive">{{ tdc('Lido') }}: {{ lastDecoded }}</q-badge>
        </div>

        <div class="text-caption text-grey-6 text-center q-mt-sm">
          {{ tdc('Aponta a câmara para o código de barras ou QR') }}
        </div>
      </q-card-section>
    </s-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { tdc } from 'quasar_resaas'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'decoded'])

const starting = ref(false)
const errorMsg = ref('')
const lastDecoded = ref('')
const torchSupported = ref(false)
const torchOn = ref(false)

let html5Qrcode = null
let lastDecodedAt = 0
let lastDecodedText = ''

function onDialogToggle(val) {
  emit('update:modelValue', val)
}

function close() {
  emit('update:modelValue', false)
}

async function startScanning() {
  errorMsg.value = ''
  lastDecoded.value = ''
  starting.value = true

  try {
    // import dinâmico: só carrega a lib pesada quando o scanner é aberto
    const { Html5Qrcode } = await import('html5-qrcode')

    await nextTick()

    html5Qrcode = new Html5Qrcode('camera-scanner-reader')

    await html5Qrcode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 260, height: 260 } },
      (decodedText) => onDecoded(decodedText),
      () => {
        // ruído normal de frames sem código — ignorar
      }
    )

    detectTorchSupport()
  } catch (e) {
    errorMsg.value = cameraErrorMessage(e)
  } finally {
    starting.value = false
  }
}

function cameraErrorMessage(e) {
  const msg = String(e?.message || e || '')

  if (msg.includes('NotAllowedError') || msg.toLowerCase().includes('permission')) {
    return tdc('Permissão de câmara negada. Ativa o acesso à câmara nas definições do navegador.')
  }
  if (msg.includes('NotFoundError')) {
    return tdc('Nenhuma câmara encontrada neste dispositivo.')
  }
  if (window.isSecureContext === false) {
    return tdc('A câmara só funciona em HTTPS (ou localhost).')
  }
  return tdc('Não foi possível aceder à câmara.')
}

function onDecoded(decodedText) {
  const now = Date.now()
  // evita adicionar o mesmo código várias vezes por segundo enquanto
  // fica parado em frente à câmara
  if (decodedText === lastDecodedText && now - lastDecodedAt < 2000) return

  lastDecodedText = decodedText
  lastDecodedAt = now
  lastDecoded.value = decodedText

  if (navigator.vibrate) navigator.vibrate(80)

  emit('decoded', decodedText)
}

async function detectTorchSupport() {
  try {
    const capabilities = html5Qrcode.getRunningTrackCameraCapabilities()
    torchSupported.value = !!capabilities?.torchFeature?.().isSupported?.()
  } catch {
    torchSupported.value = false
  }
}

async function toggleTorch() {
  if (!html5Qrcode) return
  try {
    const capabilities = html5Qrcode.getRunningTrackCameraCapabilities()
    torchOn.value = !torchOn.value
    await capabilities.torchFeature().apply(torchOn.value)
  } catch {
    torchSupported.value = false
  }
}

async function stopScanning() {
  torchOn.value = false
  torchSupported.value = false

  if (html5Qrcode) {
    try {
      await html5Qrcode.stop()
      html5Qrcode.clear()
    } catch {
      // câmara já pode ter sido libertada
    }
    html5Qrcode = null
  }
}

watch(() => props.modelValue, (open) => {
  if (open) startScanning()
  else stopScanning()
})

onBeforeUnmount(stopScanning)
</script>

<style scoped>
.scanner-box {
  width: 100%;
  min-height: 260px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}
</style>
