<template>
  <div id="app">
    <Contributes :data="data" />
  </div>
</template>

<script setup lang="ts">
import Contributes from './package/contributes.vue'
const data = [
  {
    date: '2022-06-01',
    count: 2
  },
  {
    date: '2022-06-07',
    count: 5
  },
  {
    date: '2022-06-14',
    count: 5
  },
  {
    date: '2022-06-20',
    count: 9
  },
  {
    date: '2022-06-27',
    count: 9
  },
  {
    date: '2022-05-26',
    count: 2
  },
  {
    date: '2022-06-03',
    count: 2
  },
  {
    date: '2022-06-11',
    count: 5
  },
  {
    date: '2022-06-18',
    count: 5
  },
  {
    date: '2022-06-26',
    count: 8
  },
  {
    date: '2022-07-03',
    count: 8
  },
  {
    date: '2022-09-29',
    count: 2
  },
  {
    date: '2022-09-30',
    count: 6
  },
  {
    date: '2022-10-01',
    count: 2
  },
  {
    date: '2022-10-02',
    count: 6
  },
  {
    date: '2022-09-21',
    count: 6
  },
  {
    date: '2022-09-14',
    count: 6
  },
  {
    date: '2022-09-06',
    count: 6
  },
  {
    date: '2022-08-30',
    count: 6
  },
  {
    date: '2022-08-22',
    count: 6
  },
  {
    date: '2022-10-05',
    count: 6
  },
  {
    date: '2022-10-12',
    count: 6
  },
  {
    date: '2022-10-18',
    count: 6
  },
  {
    date: '2022-10-25',
    count: 6
  },
  {
    date: '2022-10-31',
    count: 6
  },
]
</script>

<style scoped></style>