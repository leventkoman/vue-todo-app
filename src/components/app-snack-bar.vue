<script setup>
import {inject} from "vue";
const snackbarService = inject("snackbarService")
</script>

<template>
  <v-snackbar
      v-model="snackbarService.state.value.show"
      :timeout="snackbarService.state.value.timeout"
      :color="snackbarService.state.value.backGround"
  >
    {{ snackbarService.state.value.text }}
    <template #actions>
      <v-btn
          :color="snackbarService.state.value.btnColor"
          variant="text"
          @click="snackbarService.close()"
      >{{ snackbarService.state.value.action }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>

</style>