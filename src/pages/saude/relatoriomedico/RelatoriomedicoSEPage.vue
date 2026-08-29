<template>
  <q-page class="q-pa-sm">

    <s-pdf-render
      v-model="Relatoriomedico.showPdf"
      :src="Relatoriomedico.pdf"
      title="Relatório Médico"
    />

    <PacienteHeader />

    <div class="prescription-banner">
      <table width="100%">
        <tr>

          <td width="80" align="center">
            <q-icon
              name="description"
              size="54px"
              color="primary"
            />
          </td>

          <td align="center">

            <div class="banner-title">
              RELATÓRIO MÉDICO
            </div>

            <div class="banner-subtitle">
              Documento clínico elaborado pelo médico assistente
            </div>

          </td>

          <td width="80"></td>

        </tr>
      </table>
    </div>

    <div
      v-if="Relatoriomedico.loading"
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

            <s-editor
              v-model="Relatoriomedico.form.resumo"
              label="Relatório Clínico"
              min-height="500px"
            />

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

                <q-separator class="q-my-md"/>

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

                  <strong>Médico</strong>

                  <br>

                  {{ Paciente.row?.consulta?.employee_label || '-' }}

                </div>

              </q-card-section>

            </q-card>

          </div>

        </div>

      </div>

      <q-separator/>

      <q-card-actions align="right">

        <s-btn
          flat
          color="grey"
          label="Cancelar"
        />

        <s-btn
          color="primary"
          icon="save"
          label="Emitir Relatório"
          :loading="Relatoriomedico.saving"
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

import { useRelatoriomedicoStore } from './relatoriomedicoStore'
import { usePacienteStore } from './../paciente/pacienteStore'

const Paciente = usePacienteStore()



const route = useRoute()

const Relatoriomedico = useRelatoriomedicoStore()

async function afterSave(item){

    if(!item?.id) return

    await Relatoriomedico.getPdf(item.id)

    Relatoriomedico.showPdf=true

    await Relatoriomedico.loadData()

}

async function save() {

    Relatoriomedico.form.paciente = Paciente.row.id
    Relatoriomedico.form.state = 'Active'

    const data = await Relatoriomedico.save()

    await afterSave(data.data)

}

async function load(id){

    if(!id){

        Relatoriomedico.resetForm()

        return

    }

    if(String(Relatoriomedico.row?.id)===String(id)){

        Relatoriomedico.form={
            ...Relatoriomedico.row
        }

        return

    }

    await Relatoriomedico.getById(id)

}

async function init(){

    await Relatoriomedico.init()

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
