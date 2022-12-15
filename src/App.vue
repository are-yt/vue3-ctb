<template>
  <div id="app">
    <Contributes :data="[{ date: '2022-12-12', count: 2 }]" />
  </div>
</template>

<script setup lang="ts">
import Contributes from './package/contributes.vue'
</script>

<style scoped></style>