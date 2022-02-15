<template>
  <Popover>
    <template #trigger="{ open, close, toggle }">
      <input
        class="c-border c-p-2 c-rounded c-w-full"
        type="text"
        @focusin="open"
        @keydown.tab="close"
        @mousedown="toggle"
        @keyup.enter.prevent="toggle"
      >
    </template>
    <Calendar v-model="modelValue" :mode="mode" :min="min" :max="max" />
  </Popover>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { CalendarDate, CalendarRange, CalendarMode } from '../Calendar/Calendar.vue';
  import Calendar from '../Calendar/Calendar.vue'
  import Popover from '../Popover/Popover.vue'

  const props = defineProps({
    modelValue: { type: [Object, Date, null] as PropType<CalendarDate | CalendarRange>, default: null },
    mode: { type: String as PropType<CalendarMode>, default: 'date' },
    min: { type: [Date, null] as PropType<CalendarDate>, default: null },
    max: { type: [Date, null] as PropType<CalendarDate>, default: null }
  })
</script>