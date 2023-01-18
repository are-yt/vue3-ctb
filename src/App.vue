<template>
  <div id="app">
    <Contributes :data="[{ date: '2022-12-12', count: 2 }, { date: '2022-12-13', count: 5 }, { date: '2022-12-14', count: 10 }]" />
  </div>
</template>

<script setup lang="ts">
import Contributes from './package/contributes.vue'
const config = {
  showFooter: false
}
</script>

<style scoped></style>