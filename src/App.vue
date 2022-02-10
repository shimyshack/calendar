<script setup lang="ts">
import Calendar from './components/Calendar.vue'
// import { Calendar } from '../dist/s-calendar.mjs'
import { ref } from 'vue'
const date = ref<any>({ start: null, end: null })
// const date = ref(null)
const min = ref(new Date('07-15-2021'))
const max = ref(new Date('12-12-2022'))

const changeStart = () => {
  if (date.value && date.value.start) {
    date.value.start = new Date()
  }
}
</script>

<template>
  <div class="p-12">
    <Calendar v-model="date" mode="date" :min="min" :max="max" />
    <button @click="changeStart">Change start</button>
  </div>
</template>
