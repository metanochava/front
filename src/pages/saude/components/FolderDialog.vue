<template>

<q-dialog v-model="dialog">
  <s-modal-card :title="tdc('New folder')" icon="create_new_folder" width="500px">
    <s-input
        v-model="form.nome"
        :label="tdc('Folder name')"
        prepend-icon="folder"
        autofocus
    />



    <template #footer>
      <s-btn
          flat
          :label="tdc('Cancel')"
          v-close-popup
      />

      <s-btn
          color="primary"
          icon="create_new_folder"
          :label="tdc('Create folder')"
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

    nome:''

})

function guardar(){

    emit('save',{

        nome:form.nome

    })

    form.nome=''

    dialog.value=false

}

</script>
