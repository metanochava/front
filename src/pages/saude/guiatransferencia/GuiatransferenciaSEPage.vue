<template>
  <q-page class="q-pa-sm">

    <s-pdf-render
      v-model="Guiatransferencia.showPdf"
      :src="Guiatransferencia.pdf"
      title="Atestado Médico"
    />

    <PacienteHeader />

    <div class="prescription-banner">
      <table width="100%">
        <tr>
          <td width="80" align="center">
            <q-icon
              name="local_hospital"
              size="56px"
              color="primary"
            />
          </td>

          <td align="center">
            <div class="banner-title">
              GUIA DE TRANSFERÊNCIA
            </div>

            <div class="banner-subtitle">
              Referenciação do paciente para outra unidade de saúde
            </div>
          </td>

          <td width="80"></td>
        </tr>
      </table>
    </div>

    <div
      v-if="Guiatransferencia.loading"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        color="primary"
        size="42px"
      />
    </div>

    <s-card
      v-else
      flat
      bordered
    >

      <div class="q-pa-lg">

        <div class="row q-col-gutter-lg">

          <!-- FORMULÁRIO -->
          <div class="col-md-8">

            <s-input
              v-model="Guiatransferencia.form.destino"
              label="Unidade de Destino"
            />

            <div class="q-mt-md">

              <s-input
                v-model="Guiatransferencia.form.motivo"
                label="Motivo da Transferência"
              />

            </div>

            <div class="q-mt-md">

              <s-editor
                v-model="Guiatransferencia.form.diagnostico"
                label="Diagnóstico / Fundamentação Clínica"
                min-height="220px"
              />

            </div>

            <div class="q-mt-md">

              <s-editor
                v-model="Guiatransferencia.form.observacao"
                label="Observações"
                min-height="140px"
              />

            </div>

          </div>

          <!-- RESUMO -->
          <div class="col-md-4">

            <q-card
              flat
              bordered
            >

              <q-card-section>

                <div class="text-subtitle1 text-weight-bold">
                  Resumo
                </div>

                <q-separator class="q-my-md" />

                <div>

                  <strong>Paciente</strong>

                  <br>

                  {{ Paciente.row?.person?.full_name }}

                </div>

                <br>

                <div>

                  <strong>NID</strong>

                  <br>

                  {{ Paciente.row?.nid }}

                </div>

                <br>

                <div>

                  <strong>Destino</strong>

                  <br>

                  {{ Guiatransferencia.form.destino || '-' }}

                </div>

                <br>

                <div>

                  <strong>Motivo</strong>

                  <br>

                  {{ Guiatransferencia.form.motivo || '-' }}

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
          label="Emitir Guia"
          :loading="Guiatransferencia.saving"
          @click="save"
        />

      </q-card-actions>

    </s-card>




  </q-page>
</template>

<style >
  .prescription-banner {
  background: #f8fbff;
  border: 2px solid #2563eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.rx-symbol {
  font-size: 48px;
  color: #2563eb;
  font-weight: bold;
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
</style>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

import { useGuiatransferenciaStore } from './guiatransferenciaStore'
import { usePacienteStore } from './../paciente/pacienteStore'

const Paciente = usePacienteStore()



const route = useRoute()

const Guiatransferencia = useGuiatransferenciaStore()

async function afterSave(item){

    if(!item?.id) return

    await Guiatransferencia.getPdf(item.id)

    Guiatransferencia.showPdf=true

    await Guiatransferencia.loadData()

}

async function save() {

    Guiatransferencia.form.paciente = Paciente.row.id
    Guiatransferencia.form.state = 'Active'

    const data = await Guiatransferencia.save()

    await afterSave(data.data)

}

async function load(id){

    if(!id){

        Guiatransferencia.resetForm()

        return

    }

    if(String(Guiatransferencia.row?.id)===String(id)){

        Guiatransferencia.form={
            ...Guiatransferencia.row
        }

        return

    }

    await Guiatransferencia.getById(id)

}

async function init(){

    await Guiatransferencia.init()

    await load(route.params.id)

}

watch(

    ()=>route.params.id,

    async(id)=>{

        await load(id)

    }

)


onMounted(init)

</script>
