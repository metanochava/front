<template>

<q-dialog v-model="dialog">

<q-card style="width:900px;max-width:95vw">

    <q-bar :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">

        <q-icon name="attach_file"/>

        <div class="q-ml-sm">

            Novo Resultado

        </div>

        <q-space/>

        <q-btn
            flat
            dense
            icon="close"
            v-close-popup
        />

    </q-bar>

    <q-card-section>

        <div class="row q-col-gutter-lg">

            <div class="col-md-6">

                <s-file

                    v-model="form.file"

                    label="Selecionar ficheiro"

                />

            </div>

            <div class="col-md-6">

                <s-input

                    v-model="form.valor_resultado"

                    label="Valor"

                />

            </div>

            <div class="col-12">

                <s-editor

                    v-model="form.laudo"

                    label="Laudo"

                    min-height="160px"

                />

            </div>

            <div class="col-12">

                <s-editor

                    v-model="form.observacao"

                    label="Observações"

                    min-height="120px"

                />

            </div>

        </div>

    </q-card-section>

    <q-separator/>

    <q-card-actions align="right">

        <s-btn

            flat

            label="Cancelar"

            v-close-popup

        />

        <s-btn

            color="primary"

            icon="cloud_upload"

            label="Enviar"

            @click="guardar"

        />

    </q-card-actions>

</q-card>

</q-dialog>

</template>

<script setup>

import {computed,reactive} from 'vue'

const props=defineProps({

    modelValue:Boolean

})

const emit=defineEmits([

    'update:modelValue',

    'save'

])

const dialog=computed({

    get:()=>props.modelValue,

    set:v=>emit('update:modelValue',v)

})

const form=reactive({

    file:null,

    valor_resultado:'',

    laudo:'',

    observacao:''

})

function guardar(){

const form1 = new FormData()
form1.append("file", form.file, form.name)

    emit('save',{

      ...form,
      ...form1

    })

    form.file=null
    form.valor_resultado=''
    form.laudo=''
    form.observacao=''

    dialog.value=false

}

</script>
