<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />

    <!-- CARREGAMENTO DO PACIENTE -->
    <div
      v-if="Paciente.loading"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        size="40px"
        color="primary"
      />
    </div>


      <!-- =========================================
          DADOS DO PACIENTE
      ========================================== -->
      <div v-else class="row q-col-gutter-x-sm " >
        <div class="col-md-7 q-gutter-sm">
          <q-card
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center">
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="medical_information"
                  size="42px"
                />

                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">
                    Dados do paciente
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <s-form
                :store="Person"
                :ignore-fields="personIgnoreFields"
              />
              <s-form
                :store="Paciente"
                :ignore-fields="pacienteIgnoreFields"
              />

            </q-card-section>
          </q-card>

          <!-- =========================================
              DADOS PESSOAIS
          ========================================== -->
          <q-card
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center">
                <q-avatar
                  color="secondary"
                  text-color="white"
                  icon="person"
                  size="42px"
                />

                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">
                    Dados. ...
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- PACIENTE SEM PESSOA -->
            <q-card-section

              class="text-center text-grey-7 q-py-xl"
            >

            </q-card-section>
          </q-card>
        </div>




        <div class=" col-md-5 q-gutter-sm " style="padding-right: 0px;">
          <q-card
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center">
                <q-avatar
                  color="secondary"
                  text-color="white"
                  icon="person"
                  size="42px"
                />

                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">
                    Mais 1
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />
            <q-card-section

              class="text-center text-grey-7 q-py-xl"
            >

            </q-card-section>
          </q-card>

          <q-card
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center">
                <q-avatar
                  color="secondary"
                  text-color="white"
                  icon="person"
                  size="42px"
                />

                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold">
                    Mais 3
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section

              class="text-center text-grey-7 q-py-xl"
            >

            </q-card-section>
          </q-card>
        </div>
      </div>


      <!-- DEBUG TEMPORÁRIO -->
      <!--
      <pre>{{ Paciente.row?.person }}</pre>
      <pre>{{ Person.row }}</pre>
      -->
  </q-page>
</template>

<script setup>
import {
  computed,
  watch, onMounted
} from 'vue'

import {

  usePersonStore
} from 'quasar_resaas'

import { usePacienteStore } from './pacienteStore'

import PacienteHeader from './PacienteHeaderPage.vue'

const Paciente = usePacienteStore()
const Person = usePersonStore()

// =============================================
// CAMPOS IGNORADOS
// =============================================

const commonIgnoreFields = [
  'id',
  'entity',
  'branch',
  'created_at',
  'updated_at',
  'created_by',
  'updated_by',
  'deleted_at'
]

const pacienteIgnoreFields = [
  ...commonIgnoreFields,

  /*
   * O campo person não deve ser apresentado no formulário
   * automático do paciente porque será carregado no store Person.
   */
  'person'
]

const personIgnoreFields = [
  ...commonIgnoreFields,

  /*
   * Pode acrescentar outros campos da pessoa que não devem
   * aparecer no formulário.
   */
  'user',
  'full_name'
]

// =============================================
// IDENTIFICADOR DA PESSOA
// =============================================

const personId = computed(() => {
  const person = Paciente.row?.person

  if (!person) {
    return null
  }

  /*
   * Quando o serializer devolve somente o UUID:
   *
   * person: "87e456..."
   */
  if (
    typeof person === 'string' ||
    typeof person === 'number'
  ) {
    return person
  }

  /*
   * Quando o serializer devolve:
   *
   * person: {
   *   id: "87e456..."
   * }
   */
  if (typeof person === 'object') {
    return (
      person.id ||
      person.value ||
      person.pk ||
      null
    )
  }

  return null
})

// =============================================
// CARREGAR A PESSOA AUTOMATICAMENTE
// =============================================

watch(
  personId,

  async (newPersonId, oldPersonId) => {
    /*
     * Quando o paciente ainda não possui pessoa.
     */
    if (!newPersonId) {
      Person.resetForm?.()
      return
    }

    /*
     * Evita repetir a requisição quando o ID não mudou.
     */
    if (newPersonId === oldPersonId) {
      return
    }

    /*
     * Evita carregar novamente quando a pessoa já está
     * presente no store.
     */
    const currentPersonId =
      Person.row?.id ||
      Person.form?.id ||
      null

    if (
      currentPersonId &&
      String(currentPersonId) === String(newPersonId)
    ) {
      return
    }

    try {
      await Person.getById(newPersonId)
    } catch (error) {
      console.error(
        'Erro ao carregar os dados da pessoa:',
        error
      )

      Person.resetForm?.()
    }
  },

  {
    /*
     * Executa também quando o componente abre e o paciente
     * já se encontra carregado.
     */
    immediate: true
  }
)

onMounted(async () => {
  Person.init()
})
</script>
