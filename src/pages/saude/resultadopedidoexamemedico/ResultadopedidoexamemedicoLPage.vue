<template>
  <q-page class="q-pa-sm">

    <s-pdf-render
      v-model="Pedidoexamemedico.showPdf"
      :src="Pedidoexamemedico.pdf"
      :title="tdc('Medical exam result')"
    />

    <PacienteHeader />

    <div class="result-banner">
      <table width="100%">
        <tr>
          <td width="80" align="center">
            <q-icon name="biotech" size="54px" color="primary" />
          </td>

          <td align="center">
            <div class="banner-title">
              {{ tdc('Medical exam result').toUpperCase() }}
            </div>

            <div class="banner-subtitle">
              {{ tdc('Document management of laboratory results') }}
            </div>
          </td>

          <td width="80"></td>
        </tr>
      </table>
    </div>

    <!-- the results are always one patient's: none open, nothing to show -->
    <div v-if="!Resultadopedidoexamemedico.paciente" class="text-center text-grey-7 q-pa-xl" data-test="results-no-patient">
      <q-icon name="person_search" size="40px" />
      <div class="q-mt-sm">{{ tdc('Open a patient to see their results.') }}</div>
    </div>

    <s-card v-else flat bordered class="explorer-card-main">


      <ExplorerToolbar
        :selected="selected"
        @new-folder="dialogs.folder = true"
        @upload="dialogs.upload = true"
        @rename="renameSelected"
        @delete="deleteSelected"
        @refresh="refresh"
        @search="search"
      />
      <!-- files / folders in the current folder -->
      <div class="text-center text-weight-bold text-primary text-subtitle1 q-py-xs" data-test="explorer-counts">
        {{ Resultadopedidoexamemedico.ficheiros.length }} / {{ Resultadopedidoexamemedico.pastas.length }}
        <s-tooltip>{{ tdc('Files') }} / {{ tdc('Folders') }}</s-tooltip>
      </div>

      <ExplorerBreadcrumb
        :caminho="Resultadopedidoexamemedico.caminho"
        @root="goRoot"
        @go-to="goTo"
      />

      <q-separator />

      <ExplorerGrid
        :folders="Resultadopedidoexamemedico.pastas"
        :files="Resultadopedidoexamemedico.ficheiros"
        :selected="selected"
        @select="selectItem"
        @open-folder="openFolder"
        @open-file="openFile"
      />

    </s-card>

    <FolderDialog
      v-model="dialogs.folder"
      @save="createFolder"
    />

    <UploadDialog
      v-model="dialogs.upload"
      @save="uploadFile"
    />

    <FilePreviewDialog v-model="previewOpen" :file="previewFile" />


  </q-page>
</template>


<script setup>
import { tdc } from 'quasar_resaas'

import { ref, reactive, onMounted, watch } from 'vue'
import { usePacienteStore } from './../paciente/pacienteStore'



import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

const Paciente = usePacienteStore()

import ExplorerToolbar from './../components/ExplorerToolbar.vue'
import ExplorerBreadcrumb from './../components/ExplorerBreadcrumb.vue'
import ExplorerGrid from './../components/ExplorerGrid.vue'
import FolderDialog from './../components/FolderDialog.vue'
import UploadDialog from './../components/UploadDialog.vue'
import FilePreviewDialog from './../components/FilePreviewDialog.vue'

import { usePedidoexamemedicoStore } from './../pedidoexamemedico/pedidoexamemedicoStore'
import { useResultadopedidoexamemedicoStore } from './resultadopedidoexamemedicoStore'

const Pedidoexamemedico = usePedidoexamemedicoStore()
const Resultadopedidoexamemedico = useResultadopedidoexamemedicoStore()

const selected = ref(null)

const dialogs = reactive({
    folder: false,
    upload: false
})

async function refresh(){

    await Resultadopedidoexamemedico.loadExplorer(
        Resultadopedidoexamemedico.currentFolder
    )

}

async function search(text){

    await Resultadopedidoexamemedico.searchExplorer(text)

}

function selectItem(item){

    selected.value = item

}

async function openFolder(folder){

    selected.value = folder

    await Resultadopedidoexamemedico.openFolder(folder)

}

// a file opens in a modal that shows it by type (image, PDF, video, audio,
// text; anything else offers the download) - FilePreviewDialog
const previewFile = ref(null)
const previewOpen = ref(false)

function openFile(file){

    if(!file?.file) return
    previewFile.value = file
    previewOpen.value = true

}

async function goRoot(){

    selected.value = null

    await Resultadopedidoexamemedico.goRoot()

}

async function goTo(index){

    selected.value = null

    await Resultadopedidoexamemedico.goTo(index)

}

function explorerData() {

    return {

        pai: Resultadopedidoexamemedico.currentFolder,
        // a folder / file always belongs to the open patient
        paciente: Resultadopedidoexamemedico.paciente,
        // item_pedido: Pedidoexamemedico.row.id,

    }

}

async function createFolder(data) {

    await Resultadopedidoexamemedico.createExplorer({

        ...explorerData(),

        tipo: 'Folder',

        nome: data.nome,

    })

    await refresh()

}

async function uploadFile(data) {
    // multipart: the file itself plus the fields (a JSON body cannot carry it;
    // the old code sent form1.file, always undefined, so nothing was uploaded)
    const form = new FormData()
    const fields = {
        ...explorerData(),
        tipo: 'File',
        nome: data.file?.name,
        valor_resultado: data.valor_resultado,
        observacao: data.observacao,
        laudo: data.laudo,
    }
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== null && value !== '') form.append(key, value)
    }
    if (data.file) form.append('file', data.file, data.name || data.file.name)

    const created = await Resultadopedidoexamemedico.createExplorer(form)

    await refresh()

    // the list shows it right away (refresh above); open it too, so the user
    // sees what was uploaded without looking for it
    const item = created?.data || created
    if (item?.file) openFile(item)

}


async function renameSelected(){

    if(!selected.value) return

    const nome = prompt(
        'Novo nome',
        selected.value.nome
    )

    if(!nome) return

    await Resultadopedidoexamemedico.renameExplorer(

        selected.value.id,

        nome

    )

    await refresh()

}

async function deleteSelected(){

    if(!selected.value) return

    if(!confirm('Eliminar este item?')) return

    await Resultadopedidoexamemedico.deleteExplorer(

        selected.value.id

    )

    selected.value = null

    await refresh()

}

// the current patient (pacienteStore row - persisted, like the other clinical
// pages): the explorer shows and creates only their results
async function loadPatient(id) {
    Resultadopedidoexamemedico.paciente = id || null
    if (id) await Resultadopedidoexamemedico.goRoot()
}

onMounted(async()=>{

    await Resultadopedidoexamemedico.init()
    await loadPatient(Paciente.row?.id)

})

watch(() => Paciente.row?.id, (id, old) => { if (id && id !== old) loadPatient(id) })

</script>



<style scoped>

.result-banner{
    background:#f8fbff;
    border:2px solid #1976d2;
    border-radius:10px;
    padding:14px;
    margin-bottom:18px;
}

.banner-title{
    font-size:26px;
    font-weight:bold;
    color:#1976d2;
    letter-spacing:1px;
}

.banner-subtitle{
    font-size:13px;
    color:#666;
    margin-top:4px;
}

.explorer-card-main{

    overflow:hidden;

    border-radius:10px;

    min-height:75vh;

    display:flex;

    flex-direction:column;

}

.explorer-toolbar{

    background:white;

    border-bottom:1px solid #E5E7EB;

}

.breadcrumb-area{

    background:#fafafa;

    border-bottom:1px solid #E5E7EB;

    padding:8px 16px;

    overflow-x:auto;

    white-space:nowrap;

}

.explorer-container{

    flex:1;

    overflow:auto;

    padding:25px;

    display:flex;

    flex-wrap:wrap;

    align-content:flex-start;

    gap:18px;

    background:white;

}

.explorer-item{

    width:120px;

    min-height:120px;

    border-radius:8px;

    cursor:pointer;

    transition:.2s;

    padding:10px;

    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;

    border:1px solid transparent;

    user-select:none;

}

.explorer-item:hover{

    background:#E3F2FD;

    border-color:#90CAF9;

}

.explorer-item.selected{

    background:#BBDEFB;

    border-color:#1976D2;

}

.explorer-label{

    margin-top:10px;

    text-align:center;

    font-size:13px;

    word-break:break-word;

    line-height:16px;

}

.empty-folder{

    width:100%;

    text-align:center;

    padding:80px 20px;

    color:#888;

}

.empty-folder .q-icon{

    opacity:.6;

}

::-webkit-scrollbar{

    width:10px;

    height:10px;

}

::-webkit-scrollbar-thumb{

    background:#C7C7C7;

    border-radius:20px;

}

::-webkit-scrollbar-thumb:hover{

    background:#9E9E9E;

}

::-webkit-scrollbar-track{

    background:transparent;

}

@media (max-width:768px){

    .explorer-item{

        width:95px;

    }

    .banner-title{

        font-size:20px;

    }

}

</style>
