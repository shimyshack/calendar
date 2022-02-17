<script setup lang="ts">
import { ref } from 'vue'
import Datepicker from './components/Datepicker/Datepicker.vue'

const date = ref({ start: null, end: null })
// const date = ref(null)
const min = ref(new Date('02-03-2022'))
const max = ref(new Date('03-12-2022'))
</script>

<template>
  <div class="c-preflight c-p-8">
    <div class="c-grid c-grid-cols-3 c-gap-4">
      <Datepicker v-model="date" mode="dateTime" :min="min" :max="max">
        <template #default="{ inputValue, updateInputValueStart, updateInputValueEnd, placeholder, open, close, toggle }">
          <div class="c-flex c-w-full c-gap-2">
            <input
              class="c-border c-shadow-inner c-p-2 c-rounded c-w-full"
              type="text"
              :value="inputValue.start"
              :placeholder="placeholder"
              @focusin="updateInputValueStart($event); open()"
              @keydown.tab="updateInputValueStart($event); close()"
              @mousedown="updateInputValueStart($event); toggle()"
              @keyup.enter.prevent="updateInputValueStart($event); toggle()"
              @change="updateInputValueStart"
            >
            <span class="c-my-auto">-</span>
            <input
              class="c-border c-shadow-inner c-p-2 c-rounded c-w-full"
              type="text"
              :value="inputValue.end"
              :placeholder="placeholder"
              @focusin="updateInputValueEnd($event); open()"
              @keydown.tab="updateInputValueEnd($event); close()"
              @mousedown="updateInputValueEnd($event); toggle()"
              @keyup.enter.prevent="updateInputValueEnd($event); toggle()"
              @change="updateInputValueEnd"
            >
          </div>
        </template>
      </Datepicker>
    </div>
  </div>
</template>
