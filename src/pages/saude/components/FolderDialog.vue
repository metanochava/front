<template>

<q-dialog v-model="dialog">
  <s-modal-card title="Nova Pasta" icon="create_new_folder" width="500px">
    <s-input
        v-model="form.nome"
        label="Nome da pasta"
        prepend-icon="folder"
        autofocus
    />



    <template #footer>
      <s-btn
          flat
          label="Cancelar"
          v-close-popup
      />

      <s-btn
          color="primary"
          icon="create_new_folder"
          label="Criar Pasta"
          @click="guardar"
      />


    </template>
  </s-modal-card>
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
