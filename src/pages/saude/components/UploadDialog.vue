<template>

<q-dialog v-model="dialog">
  <s-modal-card :title="tdc('New result')" icon="attach_file" width="900px">
    <div class="row q-col-gutter-lg">

        <div class="col-md-6">

            <s-file

                v-model="form.file"

                :label="tdc('Select file')"

            />

        </div>

        <div class="col-md-6">

            <s-input

                v-model="form.valor_resultado"

                :label="tdc('Value')"

            />

        </div>

        <div class="col-12">

            <s-editor

                v-model="form.laudo"

                :label="tdc('Findings')"

                min-height="160px"

            />

        </div>

        <div class="col-12">

            <s-editor

                v-model="form.observacao"

                :label="tdc('Observations')"

                min-height="120px"

            />

        </div>

    </div>



    <template #footer>
      <s-btn

          flat

          :label="tdc('Cancel')"

          v-close-popup

      />

      <s-btn

          color="primary"

          icon="cloud_upload"

          :label="tdc('Send')"

          @click="guardar"

      />


    </template>
  </s-modal-card>
</q-dialog>

</template>

<script setup>
import { tdc } from 'quasar_resaas'

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
