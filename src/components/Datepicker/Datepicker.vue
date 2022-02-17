<template>
  <Popover>
    <template #trigger="{ isOpen, open, close, toggle }">
      <slot
        :is-open="isOpen"
        :open="open"
        :close="close"
        :toggle="toggle"
        :placeholder="placeholder"
        :input-value="inputValue"
        :update-input-value-start="updateInputValueStart"
        :update-input-value-end="updateInputValueEnd"
      />
    </template>
    <Calendar v-model="modelValue" :mode="mode" :min="min" :max="max" />
  </Popover>
</template>

<script lang="ts" setup>
  import { PropType, ref, computed, watch } from 'vue'
  import { format, parse, min as dateFnsMin, max as dateFnsMax, isValid, isBefore, isAfter } from 'date-fns'
  import { CalendarDate, CalendarRange, CalendarMode } from '../Calendar/Calendar.vue'
  import Calendar from '../Calendar/Calendar.vue'
  import Popover from '../Popover/Popover.vue'

  const props = defineProps({
    modelValue: { type: [Object, Date, null] as PropType<CalendarDate | CalendarRange>, default: null },
    mode: { type: String as PropType<CalendarMode>, default: 'date' },
    min: { type: [Date, null] as PropType<CalendarDate>, default: null },
    max: { type: [Date, null] as PropType<CalendarDate>, default: null }
  })

  const emit = defineEmits(['update:modelValue'])

  const inputValue = ref({ start: '', end: '' })

  const updateInputValueStart = (event: Event) => {
    if (!event.target) return
    inputValue.value.start = (event.target as HTMLInputElement).value
  }

  const updateInputValueEnd = (event: Event) => {
    if (!event.target) return
    inputValue.value.end = (event.target as HTMLInputElement).value
  }

  const isRange = computed(() => props.modelValue && !(props.modelValue instanceof Date))

  const dateFormat = computed(() => {
    switch (props.mode) {
      case 'date':
        return 'MM/dd/yyyy'
      case 'dateTime':
        return 'MM/dd/yyyy h:mm aaa'
      case 'time':
        return 'h:mm aaa'
    }
  })

  const placeholder = computed(() => {
    switch (props.mode) {
      case 'date':
        return 'mm/dd/yyyy'
      case 'dateTime':
        return 'mm/dd/yyyy h:mm a'
      case 'time':
        return 'h:mm a'
    }
  })

  watch(() => props.modelValue, (value) => {
    if (isRange.value) {
      if (value && !(value instanceof Date) && value.start) {
        inputValue.value.start = format(value.start, dateFormat.value)
      } else {
        inputValue.value.start = ''
      }
      if (value && !(value instanceof Date) && value.end) {
        inputValue.value.end = format(value.end, dateFormat.value)
      } else {
        inputValue.value.end = ''
      }
    } else {
      if (value && value instanceof Date) {
        inputValue.value.start = format(value, dateFormat.value)
        inputValue.value.end = ''
      } else {
        inputValue.value.start = ''
        inputValue.value.end = ''
      }
    }
  })

  watch(() => inputValue.value, (value) => {
    let startDate = null
    let endDate = null

    const formats = [
      'MM/dd/yyyy',
      'M/dd/yyyy',
      'M/yyyy',
      'MM/yyyy',
      'MMM d, yyyy',
      'MMMM d, yyyy',
      'MM/dd/yyyy h:mm aaa',
      'M/dd/yyyy h:mm aaa',
      'M/yyyy h:mm aaa',
      'MM/yyyy h:mm aaa',
      'MM/dd/yyyy haaa',
      'M/dd/yyyy haaa',
      'M/yyyy haaa',
      'MM/yyyy haaa',
      'MM/dd/yyyy h aaa',
      'M/dd/yyyy h aaa',
      'M/yyyy h aaa',
      'MM/yyyy h aaa',
      'MM/dd/yyyy HH:mm:ss',
      'M/dd/yyyy HH:mm:ss',
      'M/yyyy HH:mm:ss',
      'MM/yyyy HH:mm:ss',
      'MM.dd.yyyy',
      'M.dd.yyyy',
      'M.yyyy',
      'MM.yyyy',
      'MMM d, yyyy',
      'MMMM d, yyyy',
      'MM.dd.yyyy h:mm aaa',
      'M.dd.yyyy h:mm aaa',
      'M.yyyy h:mm aaa',
      'MM.yyyy h:mm aaa',
      'MM.dd.yyyy haaa',
      'M.dd.yyyy haaa',
      'M.yyyy haaa',
      'MM.yyyy haaa',
      'MM.dd.yyyy h aaa',
      'M.dd.yyyy h aaa',
      'M.yyyy h aaa',
      'MM.yyyy h aaa',
      'MM.dd.yyyy HH:mm:ss',
      'M.dd.yyyy HH:mm:ss',
      'M.yyyy HH:mm:ss',
      'MM.yyyy HH:mm:ss',
      'yyyy-MM-dd',
      'yyyy-M-dd',
      'yyyy-M',
      'yyyy-MM',
      'yyyy-MM-dd h:mm aaa',
      'yyyy-M-dd h:mm aaa',
      'yyyy-M h:mm aaa',
      'yyyy-MM h:mm aaa',
      'yyyy-MM-dd haaa',
      'yyyy-M-dd haaa',
      'yyyy-M haaa',
      'yyyy-MM haaa',
      'yyyy-MM-dd h aaa',
      'yyyy-M-dd h aaa',
      'yyyy-M h aaa',
      'yyyy-MM h aaa',
      'yyyy-MM-dd HH:mm:ss',
      'yyyy-M-dd HH:mm:ss',
      'yyyy-M HH:mm:ss',
      'yyyy-MM HH:mm:ss',
      'yyyy.MM.dd',
      'yyyy.M.dd',
      'yyyy.M',
      'yyyy.MM',
      'yyyy.MM.dd h:mm aaa',
      'yyyy.M.dd h:mm aaa',
      'yyyy.M h:mm aaa',
      'yyyy.MM h:mm aaa',
      'yyyy.MM.dd haaa',
      'yyyy.M.dd haaa',
      'yyyy.M haaa',
      'yyyy.MM haaa',
      'yyyy.MM.dd h aaa',
      'yyyy.M.dd h aaa',
      'yyyy.M h aaa',
      'yyyy.MM h aaa',
      'yyyy.MM.dd HH:mm:ss',
      'yyyy.M.dd HH:mm:ss',
      'yyyy.M HH:mm:ss',
      'yyyy.MM HH:mm:ss',
      'haaa',
      'h aaa',
      'h:mm aaa',
      'hh:mm aaa',
      'HH:mm:ss',
      'EEE',
      'EEEE',
      'EEEEEE',
      'LLL',
      'LLLL',
      'LLL yyyy',
      'LLLL yyyy',
      'QQQ',
      'QQQQ',
      'QQQ yyyy',
      'QQQQ yyyy'
    ]

    const validStartFormat = formats.find((i) => {
      startDate = parse(value.start, i, new Date())
      return isValid(startDate)
    })

    const validEndFormat = formats.find((i) => {
      endDate = parse(value.end, i, new Date())
      return isValid(endDate)
    })

    let start = null
    let end = null

    if (isRange.value) {
      if (startDate && endDate && validStartFormat && validEndFormat) {
        start = dateFnsMin([startDate, endDate])
        end = dateFnsMax([startDate, endDate])
      } else {
        if (startDate && validStartFormat) {
          start = startDate
        } else {
          start = null
        }
        if (endDate && validEndFormat) {
          end = endDate
        } else {
          end = null
        }
      }
    } else {
      if (startDate && validStartFormat) {
        start = startDate
      } else {
        start = null
      }
      end = null
    }

    if (
      (start && props.min && isBefore(start, props.min)) ||
      (start && props.max && isAfter(start, props.max))
    ) {
      start = null
    }

    if (
      (end && props.min && isBefore(end, props.min)) ||
      (end && props.max && isAfter(end, props.max)) ||
      !start
    ) {
      end = null
    }

    emit('update:modelValue', { start, end })
  }, { deep: true })
</script>