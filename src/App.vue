<script setup lang="ts">
import Calendar, { CalendarRange } from './components/Calendar/Calendar.vue'
// import { Calendar } from '../dist/s-calendar.mjs'
import { ref } from 'vue'
const date = ref<CalendarRange>({ start: null, end: null })
// const date = ref(null)
const min = ref(new Date('07-15-2021'))
const max = ref(new Date('12-12-2022'))

const changeStart = () => {
  date.value.start = new Date()
}
</script>

<template>
  <div class="c-preflight c-space-4 c-p-12">
    <Calendar v-model="date" mode="date" :min="min" :max="max" />
    <button @click="changeStart">Change start</button>
  </div>
</template>
