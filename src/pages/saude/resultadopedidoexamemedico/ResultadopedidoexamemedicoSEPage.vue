<template>
  <q-page class="q-pa-sm">

    <s-pdf-render
      v-model="Resultadoexamemedico.showPdf"
      :src="Resultadoexamemedico.pdf"
      title="Resultado de Exame Médico"
    />

    <PacienteHeader />

    <div class="result-banner">
      <table width="100%">
        <tr>
          <td width="80" align="center">
            <q-icon name="biotech" size="54px" color="primary" />
          </td>

          <td align="center">
            <div class="banner-title">
              RESULTADO DE EXAME MÉDICO
            </div>

            <div class="banner-subtitle">
              Registo, emissão e validação de resultados laboratoriais
            </div>
          </td>

          <td width="80"></td>
        </tr>
      </table>
    </div>

    <div
      v-if="Resultadoexamemedico.loading"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner color="primary" size="42px" />
    </div>

    <s-card v-else flat bordered>
      <div class="q-pa-lg">
        <div class="row q-col-gutter-lg">

          <!-- FORMULÁRIO -->
          <div class="col-md-8 col-xs-12">

            <div class="row q-col-gutter-md">
              <div class="col-md-8 col-xs-12">
                <s-select
                  v-model="Resultadoexamemedico.form.item_pedido"
                  label="Item do Pedido / Exame"
                  :options="itemPedidoOptions"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-md-4 col-xs-12">
                <s-input
                  v-model="Resultadoexamemedico.form.numero_revisao"
                  type="number"
                  label="N.º Revisão"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-md-6 col-xs-12">
                <s-input
                  v-model="Resultadoexamemedico.form.valor_resultado"
                  label="Valor do Resultado"
                />
              </div>

              <div class="col-md-6 col-xs-12">
                <s-file
                  v-model="Resultadoexamemedico.form.ficheiro"
                  label="Ficheiro do Resultado"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-md-6 col-xs-12">
                <s-date-time
                  v-model="Resultadoexamemedico.form.data_colheita"
                  label="Data da Colheita"
                />
              </div>

              <div class="col-md-6 col-xs-12">
                <s-date-time
                  v-model="Resultadoexamemedico.form.data_resultado"
                  label="Data do Resultado"
                />
              </div>
            </div>

            <div class="q-mt-md">
              <s-editor
                v-model="Resultadoexamemedico.form.laudo"
                label="Laudo"
                min-height="220px"
              />
            </div>

            <div class="q-mt-md">
              <s-editor
                v-model="Resultadoexamemedico.form.observacao"
                label="Observações"
                min-height="140px"
              />
            </div>

          </div>

          <!-- RESUMO -->
          <div class="col-md-4 col-xs-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">
                  Resumo do Resultado
                </div>

                <q-separator class="q-my-md" />

                <div class="summary-item">
                  <strong>Paciente</strong>
                  <br>
                  {{ Paciente.row?.person?.full_name || '-' }}
                </div>

                <div class="summary-item">
                  <strong>NID</strong>
                  <br>
                  {{ Paciente.row?.nid || '-' }}
                </div>

                <div class="summary-item">
                  <strong>Exame</strong>
                  <br>
                  {{ selectedItemLabel }}
                </div>

                <div class="summary-item">
                  <strong>Valor</strong>
                  <br>
                  {{ Resultadoexamemedico.form.valor_resultado || '-' }}
                </div>

                <div class="summary-item">
                  <strong>Data Resultado</strong>
                  <br>
                  {{ Resultadoexamemedico.form.data_resultado || '-' }}
                </div>

                <q-separator class="q-my-md" />

                <s-switch
                  v-model="Resultadoexamemedico.form.validado"
                  label="Resultado Validado"
                />

                <s-switch
                  v-model="Resultadoexamemedico.form.assinado_digitalmente"
                  label="Assinado Digitalmente"
                />

                <div
                  v-if="Resultadoexamemedico.form.validado"
                  class="q-mt-md"
                >
                  <q-banner rounded class="bg-green-1 text-green-9">
                    Resultado marcado como validado.
                  </q-banner>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </div>

      <q-separator />

      <q-card-actions align="right">
        <s-btn
          flat
          color="grey"
          label="Cancelar"
        />

        <s-btn
          color="primary"
          icon="save"
          label="Emitir Resultado"
          :loading="Resultadoexamemedico.saving"
          @click="save"
        />
      </q-card-actions>
    </s-card>

  </q-page>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'


import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

import { useResultadopedidoexamemedicoStore } from './resultadopedidoexamemedicoStore'
import { useItempedidoexamemedicoStore } from './../itempedidoexamemedico/itempedidoexamemedicoStore'
import { usePacienteStore } from './../paciente/pacienteStore'

const route = useRoute()

const Resultadoexamemedico = useResultadopedidoexamemedicoStore()
const Itempedidoexamemedico = useItempedidoexamemedicoStore()
const Paciente = usePacienteStore()

const itemPedidoOptions = computed(() =>
  (Itempedidoexamemedico.rows || []).map(item => ({
    value: item.id,
    label: item.exame_label ||
      item.exame?.nome ||
      item.exame_nome ||
      item.label ||
      item.id
  }))
)

const selectedItemLabel = computed(() => {
  const item = itemPedidoOptions.value.find(
    option => String(option.value) === String(Resultadoexamemedico.form.item_pedido)
  )

  return item?.label || '-'
})

async function afterSave(item) {
  if (!item?.id) return

  await Resultadoexamemedico.getPdf(item.id)

  Resultadoexamemedico.showPdf = true

  await Resultadoexamemedico.loadData()
}

async function save() {
  Resultadoexamemedico.form.state = 'Active'

  if (!Resultadoexamemedico.form.numero_revisao) {
    Resultadoexamemedico.form.numero_revisao = 1
  }

  const data = await Resultadoexamemedico.save()

  await afterSave(data?.data || data)
}

async function load(id) {
  if (!id) {
    Resultadoexamemedico.resetForm()

    Resultadoexamemedico.form.numero_revisao = 1
    Resultadoexamemedico.form.validado = false
    Resultadoexamemedico.form.assinado_digitalmente = false

    const itemPedidoId = route.query.item_pedido || route.params.item_pedido

    if (itemPedidoId) {
      Resultadoexamemedico.form.item_pedido = itemPedidoId
    }

    return
  }

  if (String(Resultadoexamemedico.row?.id) === String(id)) {
    Resultadoexamemedico.form = {
      ...Resultadoexamemedico.row
    }

    return
  }

  await Resultadoexamemedico.getById(id)
}

async function init() {
  await Promise.all([
    Resultadoexamemedico.init(),
    Itempedidoexamemedico.init()
  ])

  await load(route.params.id)
}

watch(
  () => route.params.id,
  async (id) => {
    await load(id)
  }
)

onMounted(init)
</script>

<style>
.result-banner {
  background: #f8fbff;
  border: 2px solid #2563eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.banner-title {
  font-size: 26px;
  font-weight: bold;
  color: #2563eb;
  letter-spacing: 2px;
}

.banner-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.summary-item {
  margin-bottom: 14px;
}
</style>
