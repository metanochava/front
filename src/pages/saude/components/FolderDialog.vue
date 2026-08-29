<template>

<q-dialog v-model="dialog">

    <q-card style="min-width:500px">

        <q-bar :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">

            <q-icon name="create_new_folder"/>

            <div class="q-ml-sm text-subtitle1">

                Nova Pasta

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

            <s-input
                v-model="form.nome"
                label="Nome da pasta"
                prepend-icon="folder"
                autofocus
            />

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
                icon="create_new_folder"
                label="Criar Pasta"
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
