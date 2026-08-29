<template>
  <q-page class="q-pa-sm">

    <s-pdf-render
      v-model="Atestadomedico.showPdf"
      :src="Atestadomedico.pdf"
      title="Atestado Médico"
    />

    <PacienteHeader />
    <div class="prescription-banner">
        <table width="100%">
          <tr>
            <td width="80" align="center">
              <span class="rx-symbol"> ℞ </span>
            </td>

            <td align="center">
              <div class="banner-title">
                ATESTADO MÉDICO
              </div>

              <div class="banner-subtitle">
                Requisição emitida por profissional de saúde habilitado
              </div>
            </td>

            <td width="80"></td>
          </tr>
        </table>
      </div>

    <div
      v-if="Atestadomedico.loading"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        color="primary"
        size="42px"
      />
    </div>
    <s-card flat bordered>

    <div class="q-pa-lg">

        <div class="row q-col-gutter-lg">

            <!-- FORMULÁRIO -->

            <div class="col-md-8">

                <div class="row q-col-gutter-md">

                    <div class="col-6">

                        <s-date
                            v-model="Atestadomedico.form.data_criacao"
                            label="Data de Emissão"
                        />

                    </div>

                    <div class="col-6">

                        <s-date
                            v-model="Atestadomedico.form.data_limite"
                            label="Válido Até"
                        />

                    </div>

                </div>

                <div class="q-mt-md">

                    <s-input
                        v-model="Atestadomedico.form.comparecer"
                        label="Comparecer"
                    />

                </div>

                <div class="q-mt-md">

                    <s-editor
                        v-model="Atestadomedico.form.diagnostico"
                        label="Diagnóstico / Fundamentação Clínica"
                        min-height="250px"
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

                        <br>

                        <div>

                            <strong>Data</strong>

                            <br>

                            {{ Atestadomedico.form.data_criacao }}

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
            label="Emitir Atestado"
            :loading="Atestadomedico.saving"
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

import { useAtestadomedicoStore } from './atestadomedicoStore'
import { usePacienteStore } from './../paciente/pacienteStore'

const Paciente = usePacienteStore()



const route = useRoute()

const Atestadomedico = useAtestadomedicoStore()

async function afterSave(item){

    if(!item?.id) return

    await Atestadomedico.getPdf(item.id)

    Atestadomedico.showPdf=true

    await Atestadomedico.loadData()

}

async function save() {

    Atestadomedico.form.paciente = Paciente.row.id
    Atestadomedico.form.state = 'Active'

    const data = await Atestadomedico.save()

    await afterSave(data.data)

}

async function load(id){

    if(!id){

        Atestadomedico.resetForm()

        return

    }

    if(String(Atestadomedico.row?.id)===String(id)){

        Atestadomedico.form={
            ...Atestadomedico.row
        }

        return

    }

    await Atestadomedico.getById(id)

}

async function init(){

    await Atestadomedico.init()

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
