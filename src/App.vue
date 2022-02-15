<script setup lang="ts">
import { ref } from 'vue'
import Datepicker from './components/Datepicker/Datepicker.vue'
import { CalendarRange } from './components/Calendar/Calendar.vue';

const date = ref<CalendarRange>({ start: null, end: null })
// const date = ref(null)
const min = ref(new Date('02-03-2022'))
const max = ref(new Date('03-12-2022'))
</script>

<template>
  <div class="c-preflight c-space-4 c-px-12 c-py-96">
    <Datepicker v-model="date" mode="dateTime" :min="min" :max="max" />
  </div>
</template>
