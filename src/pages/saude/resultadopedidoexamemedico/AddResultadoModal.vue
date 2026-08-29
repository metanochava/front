<template>
  <q-dialog v-model="dialog" full-width full-height>
    <s-card class="">


      <!-- HEADER -->
      <q-bar :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">
        <div class="text-subtitle1">
          {{ 'Resultados' }}
        </div>

        <q-space />

        <!-- DOWNLOAD -->
       .

        <!-- CLOSE -->
        <q-btn dense flat icon="close" @click="dialog = false" />
      </q-bar>

      <!-- BODY -->
      <q-card-section class="q-pa-none" style="height: 100vh;">

      </q-card-section>

    </s-card>

    <q-card
    v-for="item in Pedidoexamemedico.items"
    :key="item"
    class="q-mb-lg"
    flat
    bordered
>

    <q-bar class="bg-grey-2">

        <div class="text-subtitle2 text-weight-bold">
            {{ item?.exame?.label }}
        </div>

        <q-space/>

        <q-badge
            :color="item.estado_exame?.id=='pendente'
                ? 'orange'
                : 'positive'"
        >
            {{ item.estado_exame?.label }}
        </q-badge>

    </q-bar>

    <q-card-section>

      {{ item }}

        <!-- <s-input
            v-model="item.resultado.valor_resultado"
            label="Valor Resultado"
        />

        <div class="row q-col-gutter-md">

            <div class="col">

                <s-date-time
                    v-model="item.resultado.data_colheita"
                    label="Data da Colheita"
                />

            </div>

            <div class="col">

                <s-date-time
                    v-model="item.resultado.data_resultado"
                    label="Data do Resultado"
                />

            </div>

        </div>

        <s-editor
            v-model="item.resultado.laudo"
            label="Laudo"
            min-height="120px"
        />

        <s-editor
            v-model="item.resultado.observacao"
            label="Observação"
            min-height="100px"
        />

        <s-file
            v-model="item.resultado.ficheiro"
            label="Ficheiro"
        />

        <div class="row q-col-gutter-md">

            <div class="col">

                <s-switch
                    v-model="item.resultado.validado"
                    label="Validado"
                />

            </div>

            <div class="col">

                <s-switch
                    v-model="item.resultado.assinado_digitalmente"
                    label="Assinado Digitalmente"
                />

            </div>

        </div> -->

    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">

        <s-btn
            color="primary"
            icon="save"
            label="Guardar Resultado"
            @click="saveResultado(item)"
        />

    </q-card-actions>

</q-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch } from 'vue'
import { usePedidoexamemedicoStore } from './../pedidoexamemedico/pedidoexamemedicoStore.js'

// import { usePacienteStore } from './../paciente/pacienteStore'


// const Paciente = usePacienteStore()

const Pedidoexamemedico = usePedidoexamemedicoStore()



// props
const props = defineProps({
  modelValue: Boolean,
})

// emit
const emit = defineEmits(['update:modelValue'])

// ✅ v-model proxy (CORRETO)
const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})



// limpar memória (blob)
watch(() => props.modelValue, (val) => {
  if (!val && props.src?.startsWith('blob:')) {
    URL.revokeObjectURL(props.src)
  }
})
</script>

<style scoped>
/* opcional: scroll suave */
iframe {
  background: #1e1e1e;
}
</style>
