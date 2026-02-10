<template>
  <v-app>
    <router-view/>
    <AppSnackBar></AppSnackBar>
  </v-app>
</template>
<script setup>
import AppSnackBar from "@/components/app-snack-bar.vue";
</script>