<template>
  <q-page class="flex flex-center column">
    <img
      :alt="User?.Entidade?.nome + '  logo'"
      :src="User?.Entidade?.logo?.url"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script setup>
import { UserStore } from 'quasar_resaas'

const User = UserStore()

// import figlet from 'figlet'
// import { ref, onMounted } from 'vue'

// const banner = ref('')

// onMounted(() => {
//   banner.value = figlet.textSync('METANO', {
//     font: 'Big',
//   })
//   console.log(
//     figlet.textSync('METANO', {
//       font: 'Big',
//     }),
//   )
// })
// const texto = ascii(User.Entidade.nome)
</script>

