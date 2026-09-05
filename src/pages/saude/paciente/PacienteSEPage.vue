<template>

  <q-page class="q-pa-sm">

    <s-card
      flat
      bordered
    >

      <!-- =========================================
           HEADER
      ========================================== -->

      <q-card-section
        :class="
          $q.dark.isActive
            ? 'bg-dark'
            : 'bg-transparent'
        "
      >

        <div class="text-h5 text-weight-bold">
          Cadastro completo de paciente
        </div>

      </q-card-section>


      <!-- =========================================
           PESQUISAR PESSOA
      ========================================== -->

      <s-person-search
        @selected="onPersonSelected"
      />


      <!-- =========================================
           FORM
      ========================================== -->

      <q-card
        flat
        bordered
        class="rounded-borders"
      >

        <q-card-section>

          <q-form
            ref="myForm"
            class="q-gutter-md"

          >


            <!-- =====================================
                 FOTO
            ====================================== -->

            <div
              class="
                col-12
                row
                justify-center
                items-center
              "
            >

              <s-image-capture
                v-model="Person.form.photo"
                label="Foto do Paciente"
              />

            </div>


            <!-- =====================================
                 PERSON
            ====================================== -->

            <s-form
              ref="personFormRef"
              :store="Person"
              :ignoreFields="personIgnoreFields"
            />


            <q-separator class="q-my-md" />


            <!-- =====================================
                 PACIENTE
            ====================================== -->

            <s-form
              ref="pacienteFormRef"
              :store="Paciente"
              :ignoreFields="pacienteIgnoreFields"
            />


            <!-- =====================================
                 ACTIONS
            ====================================== -->

            <q-separator />

            <s-action-form
              :store="Paciente"
              :reform="pacienteFormRef"
              :buttons="[
                'cancel',
                'reset',
                'delete',
                'edit',
                'save'
              ]"
              @save="savePaciente"
              @cancel="cancel"
              @reset="resetAll"
            />

          </q-form>

        </q-card-section>

      </q-card>

    </s-card>

  </q-page>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRouter,
  useRoute
} from 'vue-router'

import {
  useQuasar
} from 'quasar'

import {
  usePersonStore,
} from 'quasar_resaas'


import { usePacienteStore } from './pacienteStore'




// =============================================
// QUASAR
// =============================================

const $q = useQuasar()


// =============================================
// ROUTER
// =============================================

const router = useRouter()

const route = useRoute()


// =============================================
// STORES
// =============================================

const Paciente = usePacienteStore()

const Person = usePersonStore()


// =============================================
// REFS
// =============================================

const myForm = ref(null)

const personFormRef = ref(null)

const pacienteFormRef = ref(null)


// =============================================
// IGNORE FIELDS
// =============================================

const ignoreFields = [
  'id',

  'entity',
  'branch',

  'state',

  'created_at',
  'updated_at',

  'created_by',
  'updated_by',

  'deleted_at'
]


const personIgnoreFields = computed(() => [

  ...ignoreFields,

  'user',

  // já tem campo próprio (s-image-capture) mais acima no form
  'photo'

])


const pacienteIgnoreFields = computed(() => [

  ...ignoreFields,

  'nid',
  'person'

])


// =============================================
// PERSON SELECTED
// =============================================

const onPersonSelected = async (person) => {

  if (!person) {
    return
  }


  const personId =
    typeof person === 'object'
      ? person?.id
      : person


  if (!personId) {
    return
  }


  try {

    // =========================================
    // GET PERSON
    // =========================================

    await Person.getById(personId)


    Paciente.form.person = personId

  }
  catch (error) {

    console.error(
      'Erro ao carregar pessoa:',
      error
    )
  }
}


// =============================================
// SAVE
// =============================================

const savePaciente = async () => {

  try {

    // =========================================
    // VALIDAR Q-FORM
    // =========================================

    const valid = await myForm.value?.validate?.()


    if (valid === false) {

      $q.notify({
        type: 'warning',
        message: 'Preencha os campos obrigatórios.',
        icon: 'error',
        position: 'top-right'
      })

      return

    }


    // =========================================
    // 1. GUARDAR PERSON
    // =========================================


    let personResponse = null

    Person.form = personFormRef.value.form
    Person.form.state = 'Active'
    personResponse =  await Person.save()

    // =========================================
    // 2. OBTER ID DA PERSON
    // =========================================

    const personId =  personResponse?.id


    if (!personId) {

      $q.notify({
        type: 'negative',
        message: 'Não foi possível guardar os dados da pessoa.',
        icon: 'error',
        position: 'top-right'
      })

      return

    }


    Paciente.form = pacienteFormRef.value.form
    Paciente.form.person = personId
    Paciente.form.state = 'Active'
    // =========================================
    // 4. GUARDAR PACIENTE
    // =========================================

    let pacienteResponse = null
    pacienteResponse = await Paciente.save()

    // =========================================
    // SUCCESS
    // =========================================

    $q.notify({
      type: 'positive',
      message: 'Paciente guardado com sucesso. '+ pacienteResponse.id,
      icon: 'error',
      position: 'top-right'
    })

    router.push({name:"view_paciente", params:{id: pacienteResponse.id }})
  }
  catch  {

    $q.notify({
      type: 'negative',
      message: 'Ocorreu um erro ao guardar o paciente.',
      icon: 'error',
      position: 'top-right'
    })

  }

}


// =============================================
// RESET
// =============================================

const resetAll = () => {

  personFormRef.value?.resetForm?.()

  pacienteFormRef.value?.resetForm?.()

}


// =============================================
// CANCEL
// =============================================

const cancel = () => {

  router.back()

}


// =============================================
// LOAD PACIENTE
// =============================================

async function init() {

  await Person.init()

  await Paciente.init()
}

onMounted(async () => {

  init()

  const id = route.params?.id


  if (!id) {
    return
  }


  try {

    // =========================================
    // GET PACIENTE
    // =========================================

    await Paciente.getById(id)


    // =========================================
    // GET PERSON DO PACIENTE
    // =========================================

    const personId =

      Paciente?.row?.person?.id ||

      Paciente?.row?.person


    if (personId) {

      await Person.getById(personId)

    }

  }
  catch (error) {

    console.error(
      'Erro ao carregar paciente:',
      error
    )

  }

})




</script>


<style scoped>

.my-custom-image {
  object-fit: cover;
}


.rounded-borders {
  border-radius: 8px;
}

</style>
