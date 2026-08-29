
<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      app="saude" model="Paciente"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :extraActions="[
        {action:'Marcar Consulta', permission:'pdf_paciente', icon:'event', method: 'get', position: 'l', tooltip:'Marcar Consulta', visible: true},
       ]"
      @runaction="onRunAction"
    />


    <!-- <s-auto-crud
      app="saude" model="Paciente"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :extraActions="[
        {'action':'Marcar Consulta', 'icon':'event', 'method': 'get', 'position': 'l', 'role':'pdf_paciente', },
        {'action':'pedra', 'icon':'event', 'method': 'post', 'position': 'r', 'role':'pdf_paciente'},
        {'action':'map', 'icon':'lock', 'method': 'put', 'position': '', 'role':'pdf_paciente', tooltip:'Clica aqui para ver Pdf '},
       ]"
      @runaction="onRunAction"
    /> -->

  </q-page>
</template>

<script setup>
import { onMounted} from 'vue'

 function onRunAction(obj, row ) {
  console.log( obj, row )
  if(obj.action=='Marcar Consulta'){
    console.log( obj.action, row.id )
  }
}

onMounted(async () => {

})
</script>
