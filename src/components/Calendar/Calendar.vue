<template>
  <div data-testid="calendar" class="c-preflight c-select-none">
    <template v-if="showCalendars">
      <template v-if="showCalendars && view === 'days'">
        <div
          class="c-flex c-gap-1 c-mb-2 c-w-56"
          :class="{ 'sm:c-w-120': isRange }"
        >
          <div class="c-flex-grow c-flex">
            <button
              type="button"
              class="c-my-auto c-text-lg c-font-semibold c-flex c-gap-1 c-text-gray-900 hover:c-text-gray-500"
              @click="view === 'days' ? view = 'years' : view = 'days'"
            >
              <span>{{ calendarMonthTitle }} {{ calendarYearTitle }}</span>
              <template v-if="isRange">
                <span class="c-hidden sm:c-inline-block">-</span>
                <span class="c-hidden sm:c-inline-block">{{ calendarNextMonthTitle }} {{ calendarNextYearTitle }}</span>
              </template>
            </button>
          </div>
          <template v-if="view === 'days'">
            <button type="button" class="c-text-gray-700 c-px-1 hover:c-bg-gray-300 c-rounded disabled:c-pointer-events-none disabled:c-opacity-50" :disabled="!canGoToPrevMonth" @click="goToPrevMonth">
              <span class="c-sr-only">Go to previous month</span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="c-w-5 c-h-5" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"></path></svg>
            </button>
            <button type="button" class="c-text-gray-700 c-px-1 hover:c-bg-gray-300 c-rounded disabled:c-pointer-events-none disabled:c-opacity-50" :disabled="!canGoToNextMonth" @click="goToNextMonth">
              <span class="c-sr-only">Go to next month</span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="c-w-5 c-h-5" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144l-144 144"></path></svg>
            </button>
          </template>
        </div>
        <div
          class="c-flex c-flex-col sm:c-flex-row"
          :class="{ 'c-gap-8': showCalendars }"
        >
          <div class="c-grid c-grid-cols-7 c-w-56 c-place-content-start">
            <div
              class="c-text-sm c-font-bold c-text-gray-400 c-text-center c-uppercase c-w-8 c-mb-1"
              v-for="day of calendarDaysOfWeek"
              :key="day"
            >{{ day.charAt(0) }}</div>
            <div
              v-for="day of calendarDaysInMonth"
              :key="day"
              :class="[
                'c-w-8 c-h-8 c-mb-1',
                day === 1 ? `c-col-start-${calendarStartOfMonth}` : '',
                dateIsWithinInterval(day) ? 'c-bg-blue-200' : '',
                dateIsAtStartOfInterval(day) ? 'c-bg-blue-200 c-rounded-l-full' : '',
                dateIsAtEndOfInterval(day) ? 'c-bg-blue-200 c-rounded-r-full' : '',
              ]"
            >
              <button
                type="button"
                class="disabled:c-pointer-events-none disabled:c-opacity-25"
                :class="{
                  'c-px-2 c-py-1 c-w-8 c-h-8 c-rounded-full c-text-sm': true,
                  'hover:c-bg-gray-300': !dateIsSameDay(day),
                  'c-font-bold c-bg-blue-500 c-text-white': dateIsSameDay(day),
                  'c-font-bold c-text-blue-500 c-bg-gray-100': dateIsToday(day) && !dateIsSameDay(day) && !dateIsWithinInterval(day),
                  'c-font-semibold c-text-blue-900': dateIsWithinInterval(day) && !dateIsSameDay(day)
                }"
                :disabled="dateIsBeforeMin(day) || dateIsAfterMax(day)"
                :title="dateIsToday(day) ? 'Today' : ''"
                @click="setModelValueDate(day)"
              >{{ day }}</button>
            </div>
          </div>

          <template v-if="isRange">
            <div class="c-hidden sm:c-grid c-grid-cols-7 c-place-content-start">
              <div
                class="c-text-sm c-font-bold c-text-gray-400 c-text-center c-uppercase c-mb-1"
                v-for="day of calendarDaysOfWeek"
                :key="day"
              >{{ day.charAt(0) }}</div>
              <div
                v-for="day of calendarNextDaysInMonth"
                :key="day"
                :class="[
                  'c-w-8 c-h-8 c-mb-1',
                  day === 1 ? `c-col-start-${calendarNextStartOfMonth}` : '',
                  dateIsWithinInterval(day, true) ? 'c-bg-blue-200' : '',
                  dateIsAtStartOfInterval(day, true) ? 'c-bg-blue-200 c-rounded-l-full' : '',
                  dateIsAtEndOfInterval(day, true) ? 'c-bg-blue-200 c-rounded-r-full' : '',
                ]"
              >
                <button
                  type="button"
                  class="disabled:c-pointer-events-none disabled:c-opacity-25"
                  :class="{
                    'c-px-2 c-py-1 c-w-8 c-h-8 c-rounded-full c-text-sm': true,
                    'hover:c-bg-gray-300': !dateIsSameDay(day, true),
                    'c-font-bold c-bg-blue-500 c-text-white': dateIsSameDay(day, true),
                    'c-font-bold c-text-blue-500 c-bg-gray-100': dateIsToday(day, true) && !dateIsSameDay(day, true) && !dateIsWithinInterval(day, true),
                    'c-font-semibold c-text-blue-900': dateIsWithinInterval(day, true) && !dateIsSameDay(day, true)
                  }"
                  :disabled="dateIsBeforeMin(day, true) || dateIsAfterMax(day, true)"
                  :title="dateIsToday(day, true) ? 'Today' : ''"
                  @click="setModelValueDate(day, true)"
                >{{ day }}</button>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="c-grid c-gap-1 c-w-56" :class="{ 'c-w-120': isRange }">
          <div class="c-space-y-1">
            <div class="c-text-sm c-uppercase c-font-semibold c-text-gray-500">Month</div>
            <select
              v-model="calendarMonthSelect"
              class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            >
              <option v-for="month of calendarMonths">{{ month }}</option>
            </select>
          </div>
          <div class="c-mt-1 c-space-y-1">
            <div class="c-text-sm c-uppercase c-font-semibold c-text-gray-500">Year</div>
            <select
              v-model="calendarYearSelect"
              class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            >
              <option v-for="year of calendarYears">{{ year }}</option>
            </select>
          </div>
          <button
            type="button"
            class="c-mt-2 c-font-semibold c-border c-rounded c-px-2 c-py-1 hover:c-shadow c-text-sm hover:c-bg-blue-600 c-rounded c-text-white c-bg-blue-500"
            @click="goToSelectedMonth()"
          >Go To Date</button>
          <button
            type="button"
            class="c-mt-2 c-font-semibold c-border c-rounded c-px-2 c-py-1 hover:c-schadow c-text-sm hover:c-bg-gray-100 c-rounded c-text-blue-500"
            @click="goToThisMonth()"
          >Go To Today</button>
          <hr class="c-my-2" />
          <button
            type="button"
            class="c-font-semibold c-border c-rounded c-px-2 c-py-1 hover:c-schadow c-text-sm hover:c-bg-gray-100 c-rounded c-text-blue-500"
            @click="view = 'days'"
          >Cancel</button>
        </div>
      </template>
    </template>

    <!-- Time pickers -->
    <div
      v-if="showTime && view === 'days'"
      :class="{ 'sm:c-flex sm:c-gap-8 sm:c-w-120': showCalendars && isRange }"
    >
      <div :class="{ 'c-w-56 c-border-t c-my-2 c-pt-2 c-border-t': showCalendars }">
        <div class="c-uppercase c-text-sm c-text-gray-500 c-mb-2" :class="{ 'c-opacity-50': !dateSelectionIsComplete}">
          <template v-if="date && date instanceof Date">
            {{ formatDate(date, 'eee MMM dd yyyy') }}
          </template>
          <template v-else-if="date && !(date instanceof Date) && date.start instanceof Date">
            {{ formatDate(date.start, 'eee MMM dd yyyy') }}
          </template>
          <template v-else>
            --
          </template>
        </div>
        <div class="c-flex c-gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="c-my-auto c-flex-shrink-0 c-w-4 c-h-4 c-text-gray-700"
            :class="{ 'opacity-50': !dateSelectionIsComplete}"
            width="32"
            height="32"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 512 512"
          >
            <path
              d="M256 8C119 8 8 119 8 256s111 248 248 248s248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200s-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"
              fill="currentColor"
            />
          </svg>
          <select
            v-model="startTimeHour"
            :disabled="!startTimeHour || !dateSelectionIsComplete"
            class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            @change="changeTime('hour', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="hour of getCalendarHours">{{ hour }}</option>
          </select>
          <span class="c-my-auto">:</span>
          <select
            v-model="startTimeMinutes"
            :disabled="!startTimeMinutes || !dateSelectionIsComplete"
            class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            @change="changeTime('minutes', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="min of getCalendarMinutes">{{ min }}</option>
          </select>
          <select
            v-model="startTimeMeridian"
            :disabled="!startTimeMeridian || !dateSelectionIsComplete"
            class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            @change="changeTime('meridian', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="meridian of getCalendarMeridian">{{ meridian }}</option>
          </select>
        </div>
      </div>
      <div v-if="isRange" class="c-border-t c-my-2 c-pt-2 c-border-t" :class="{ 'c-w-56': showCalendars }">
        <div class="c-uppercase c-text-sm c-text-gray-500 c-mb-2" :class="{ 'c-opacity-50': !dateSelectionIsComplete}">
          <template v-if="date && !(date instanceof Date) && date.end instanceof Date">
            {{ formatDate(date.end, 'eee MMM dd yyyy') }}
          </template>
          <template v-else>
            --
          </template>
        </div>
        <div class="c-flex c-gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="c-my-auto c-flex-shrink-0 c-w-4 c-h-4 c-text-gray-700"
            :class="{ 'opacity-50': !dateSelectionIsComplete}"
            width="32"
            height="32"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 512 512"
          >
            <path
              d="M256 8C119 8 8 119 8 256s111 248 248 248s248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200s-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"
              fill="currentColor"
            />
          </svg>
          <select
            v-model="endTimeHour"
            :disabled="!endTimeHour || !dateSelectionIsComplete"
            class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            @change="changeTime('hour', ($event.target as HTMLSelectElement).value, true)"
          >
            <option v-for="hour of getCalendarHours">{{ hour }}</option>
          </select>
          <span class="my-auto">:</span>
          <select
            v-model="endTimeMinutes"
            :disabled="!endTimeMinutes || !dateSelectionIsComplete"
            class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            @change="changeTime('minutes', ($event.target as HTMLSelectElement).value, true)"
          >
            <option v-for="min of getCalendarMinutes">{{ min }}</option>
          </select>
          <select
            v-model="endTimeMeridian"
            :disabled="!endTimeMeridian || !dateSelectionIsComplete"
            class="c-w-full c-p-1 c-bg-gray-200 hover:c-bg-gray-300 disabled:c-pointer-events-none disabled:c-opacity-50 c-rounded c-cursor-pointer"
            @change="changeTime('meridian', ($event.target as HTMLSelectElement).value, true)"
          >
            <option v-for="meridian of getCalendarMeridian">{{ meridian }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export type CalendarDate = Date | null
export interface CalendarRange {
  start: CalendarDate
  end: CalendarDate
}
export type CalendarMode = 'dateTime' | 'date' | 'time'

export default {
  name: 'Calendar'
}
</script>

<script lang="ts" setup>
import { isWithinInterval, isBefore, isAfter, isDate, min, max, isSameDay, getDaysInMonth, startOfMonth, getDay, getHours, setDate, setHours, setMinutes, setSeconds, setMilliseconds, subMonths, addMonths, format } from 'date-fns'
import { ref, computed, watch, PropType, onMounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: [Object, Date] as PropType<CalendarDate | CalendarRange>, default: null },
  mode: {
    type: String as PropType<CalendarMode>,
    validator(value: CalendarMode) {
      return ['dateTime', 'date', 'time'].includes(value)
    },
    default: 'date'
  },
  min: { type: Date as PropType<CalendarDate>, default: null },
  max: { type: Date as PropType<CalendarDate>, default: null }
})

const emit = defineEmits(['update:modelValue'])

const date = computed<CalendarDate | CalendarRange>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const displayedMonth = ref(new Date())
const calendarDaysOfWeek = ref(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
const calendarMonths = ref(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
const calendarYears = ref([...Array(200).keys()].map((i) => i + 1900))
const calendarMonthTitle = computed(() => format(displayedMonth.value, 'MMM'))
const calendarYearTitle = computed(() => format(displayedMonth.value, 'yyyy'))
const calendarStartOfMonth = computed(() => getDay(startOfMonth(displayedMonth.value)) + 1)
const calendarDaysInMonth = computed(() => getDaysInMonth(displayedMonth.value))

const displayedNextMonth = ref(addMonths(displayedMonth.value, 1))
const calendarNextMonthTitle = computed(() => format(displayedNextMonth.value, 'MMM'))
const calendarNextYearTitle = computed(() => format(displayedNextMonth.value, 'yyyy'))
const calendarNextStartOfMonth = computed(() => getDay(startOfMonth(displayedNextMonth.value)) + 1)
const calendarNextDaysInMonth = computed(() => getDaysInMonth(displayedNextMonth.value))

const view = ref('days')
const calendarMonthSelect = ref<string | null>(null)
const calendarYearSelect = ref<string | null>(null)

const setCalendarSelectMonthAndYear = () => {
  calendarMonthSelect.value = format(displayedMonth.value, 'MMMM')
  calendarYearSelect.value = format(displayedMonth.value, 'yyyy')
}

watch(() => view.value, () => {
  setCalendarSelectMonthAndYear()
})

const showCalendars = computed(() => {
  return props.mode === 'date' || props.mode === 'dateTime'
})

const showTime = computed(() => {
  return props.mode === 'dateTime' || props.mode === 'time'
})

const startTimeHour = ref<string | null>(null)
const startTimeMinutes = ref<string | null>(null)
const startTimeMeridian = ref<string | null>(null)
const endTimeHour = ref<string | null>(null)
const endTimeMinutes = ref<string | null>(null)
const endTimeMeridian = ref<string | null>(null)

onMounted(() => {
  initTimeMode()
  moveToStartDate()
  nextTick(() => {
    updateTimeSelects()
  })
})

const initTimeMode = () => {
  if (props.mode === 'time') {
    const now = setHours(setMinutes(setSeconds(setMilliseconds(new Date(), 0), 0), 0), 0)
    if (isRange.value) {
      date.value = {
        start: date.value && !(date.value instanceof Date) && !date.value.start ? now : date.value && date.value && !(date.value instanceof Date) && date.value.start || null,
        end: date.value && !(date.value instanceof Date) && !date.value.end ? now : date.value && date.value && !(date.value instanceof Date) && date.value.end || null
      }
    } else if (!date.value) {
      date.value = now
    }
  }
}

watch(() => props.modelValue, () => {
  updateTimeSelects()
}, { deep: true })

const moveToStartDate = () => {
  if (date.value && !(date.value instanceof Date) && date.value.start instanceof Date) {
    displayedMonth.value = date.value.start
  } else if (date.value && date.value instanceof Date) {
    displayedMonth.value = date.value
  } else if (props.min && props.min instanceof Date && isAfter(props.min, new Date())) {
    displayedMonth.value = props.min
  }
  displayedNextMonth.value = addMonths(displayedMonth.value, 1)
}

const updateTimeSelects = () => {
  if (isRange.value) {
    if (date.value && !(date.value instanceof Date) && date.value.start instanceof Date) {
      startTimeHour.value = formatDate(date.value.start, 'hh')
      startTimeMinutes.value = formatDate(date.value.start, 'mm')
      startTimeMeridian.value = getHours(date.value.start) > 11 ? 'pm' : 'am'
    } else {
      startTimeHour.value = null
      startTimeMinutes.value = null
      startTimeMeridian.value = null
    }
    if (date.value && !(date.value instanceof Date) && date.value.end instanceof Date) {
      endTimeHour.value = formatDate(date.value.end, 'hh')
      endTimeMinutes.value = formatDate(date.value.end, 'mm')
      endTimeMeridian.value = getHours(date.value.end) > 11 ? 'pm' : 'am'
    } else {
      endTimeHour.value = null
      endTimeMinutes.value = null
      endTimeMeridian.value = null
    }
  } else if (date.value instanceof Date) {
    startTimeHour.value = formatDate(date.value, 'hh')
    startTimeMinutes.value = formatDate(date.value, 'mm')
    startTimeMeridian.value = getHours(date.value) > 11 ? 'pm' : 'am'
  } else {
    startTimeHour.value = null
    startTimeMinutes.value = null
    startTimeMeridian.value = null
  }
}

const changeTime = (interval: 'hour' | 'minutes' | 'meridian', value: string, isEndOfRange = false) => {
  switch (interval) {
    case 'hour':
      if (isRange.value) {
        if (!isEndOfRange && date.value && !(date.value instanceof Date) && date.value.start instanceof Date) {
          const currentHour = getHours(date.value.start)
          const hours = currentHour > 12 ? parseInt(value) + 12 : parseInt(value)
          date.value.start = setHours(date.value.start, hours)
        } else if (isEndOfRange && date.value && !(date.value instanceof Date) && date.value.end instanceof Date) {
          const currentHour = getHours(date.value.end)
          const hours = currentHour > 12 ? parseInt(value) + 12 : parseInt(value)
          date.value.end = setHours(date.value.end, hours)
        }
      } else if (date.value instanceof Date) {
        const currentHour = getHours(date.value)
        const hours = currentHour > 12 ? parseInt(value) + 12 : parseInt(value)
        date.value = setHours(date.value, hours)
      }
      break
    case 'minutes':
      if (isRange.value) {
        if (!isEndOfRange && date.value && !(date.value instanceof Date) && date.value.start instanceof Date) {
          date.value.start = setMinutes(date.value.start, parseInt(value))
        } else if (isEndOfRange && date.value && !(date.value instanceof Date) && date.value.end instanceof Date) {
          date.value.end = setMinutes(date.value.end, parseInt(value))
        }
      } else if (date.value instanceof Date) {
        date.value = setMinutes(date.value, parseInt(value))
      }
      break
    case 'meridian':
      if (isRange.value) {
        if (!isEndOfRange && date.value && !(date.value instanceof Date) && date.value.start instanceof Date) {
          const currentHour = getHours(date.value.start)
          let hours = value === 'am' && currentHour >= 12 ? currentHour - 12 : value === 'pm' && currentHour < 12 ? currentHour + 12 : currentHour
          date.value.start = setHours(date.value.start, hours)
        } else if (isEndOfRange && date.value && !(date.value instanceof Date) && date.value.end instanceof Date) {
          const currentHour = getHours(date.value.end)
          let hours = value === 'am' && currentHour >= 12 ? currentHour - 12 : value === 'pm' && currentHour < 12 ? currentHour + 12 : currentHour
          date.value.end = setHours(date.value.end, hours)
        }
      } else if (date.value instanceof Date) {
        const currentHour = getHours(date.value)
        let hours = value === 'am' && currentHour >= 12 ? currentHour - 12 : value === 'pm' && currentHour < 12 ? currentHour + 12 : currentHour
        date.value = setHours(date.value, hours)
      }
      break
    default:
      break
  }

  if (isRange.value && date.value && !(date.value instanceof Date) && date.value.start instanceof Date && date.value.end instanceof Date) {
    date.value = {
      start: min([date.value.start, date.value.end]),
      end: max([date.value.start, date.value.end])
    }
  }

  nextTick(() => {
    updateTimeSelects()
  })
}

const getCalendarHours = computed(() => {
  const hours = [...Array(12).keys()]
  return hours.map(i => (i + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }))
})

const getCalendarMinutes = computed(() => {
  const minutes = [...Array(60).keys()]
  return minutes.map(i => i.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }))
})

const getCalendarMeridian = computed(() => {
  return ['am', 'pm']
})

const goToPrevMonth = () => {
  displayedMonth.value = subMonths(displayedMonth.value, 1)
  displayedNextMonth.value = subMonths(displayedNextMonth.value, 1)
}
const goToNextMonth = () => {
  displayedMonth.value = addMonths(displayedMonth.value, 1)
  displayedNextMonth.value = addMonths(displayedNextMonth.value, 1)
}
const goToSelectedMonth = () => {
  if (!calendarMonthSelect.value || !calendarYearSelect.value) return
  const monthIndex = calendarMonths.value.findIndex((i) => i === calendarMonthSelect.value) + 1
  if (typeof monthIndex === 'number') {
    displayedMonth.value = new Date(parseInt(calendarYearSelect.value), monthIndex, 0, 0, 0, 0, 0)
    displayedNextMonth.value = addMonths(displayedMonth.value, 1)
    view.value = 'days'
  }
}
const goToThisMonth = () => {
  displayedMonth.value = new Date()
  displayedNextMonth.value = addMonths(displayedMonth.value, 1)
  view.value = 'days'
}
const canGoToPrevMonth = computed(() => {
  if (!(props.min instanceof Date)) return true
  return isBefore(startOfMonth(props.min), startOfMonth(displayedMonth.value))
})
const canGoToNextMonth = computed(() => {
  if (!(props.max instanceof Date)) return true
  return isAfter(startOfMonth(props.max), startOfMonth(displayedMonth.value))
})

const formatDate = (date: Date, output: string) => format(date, output)
const isRange = computed(() => props.modelValue && !isDate(props.modelValue))
const dateSelectionIsComplete = computed(() => {
  if (!date.value) return false
  if (date.value && date.value instanceof Date) {
    return true
  }
  if (date.value && !(date.value instanceof Date) && date.value.start instanceof Date && date.value.end instanceof Date) {
    return true
  }
  return false
})

const setModelValueDate = (day: number, isNextMonth = false) => {
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  if (isRange.value && date.value) {
    if ((date.value as CalendarRange).end || !(date.value as CalendarRange).start) {
      (date.value as CalendarRange) = {
        start: setHours(setMinutes(setSeconds(setMilliseconds(setDate(month, day), 0), 0), 0), 0),
        end: null
      }
    } else {
      if (
        !(date.value instanceof Date) &&
        (isDate(date.value.start) && date.value.start instanceof Date)
      ) {
        const start = date.value.start
        const end = setHours(setMinutes(setSeconds(setMilliseconds(setDate(month, day), 0), 0), 0), 0)
        date.value = {
          start: min([start, end]),
          end: max([start, end])
        }
      } else {
        (date.value as CalendarRange).end = setHours(setMinutes(setSeconds(setMilliseconds(setDate(month, day), 0), 0), 0), 0)
      }
    }
  } else {
    date.value = setHours(setMinutes(setSeconds(setMilliseconds(setDate(month, day), 0), 0), 0), 0)
  }

  nextTick(() => {
    updateTimeSelects()
  })
}
const dateIsBeforeMin = (day: number, isNextMonth = false) => {
  if (!(props.min instanceof Date)) return false
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  const startOfMin = setHours(setMinutes(setSeconds(setMilliseconds(props.min, 0), 0), 0), 0)
  return isBefore(setDate(month, day), startOfMin)
}
const dateIsAfterMax = (day: number, isNextMonth = false) => {
  if (!(props.max instanceof Date)) return false
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  const startOfMax = setHours(setMinutes(setSeconds(setMilliseconds(props.max, 0), 0), 0), 0)
  return isAfter(setDate(month, day - 1), startOfMax)
}
const dateIsWithinInterval = (day: number, isNextMonth = false) => {
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  if (
    date.value &&
    !(date.value instanceof Date) &&
    (
      isDate(date.value.start) && date.value.start instanceof Date &&
      isDate(date.value.end) && date.value.end instanceof Date
    )
  ) {
    return isWithinInterval(
      setDate(month, day),
      { start: date.value.start, end: date.value.end }
    )
  }
  return false
}
const dateIsAtStartOfInterval = (day: number, isNextMonth = false) => {
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  if (
    date.value &&
    !(date.value instanceof Date) &&
    (
      isDate(date.value.start) && date.value.start instanceof Date &&
      isDate(date.value.end) && date.value.end instanceof Date
    )
  ) {
    return isSameDay(setDate(month, day), date.value.start)
  }
  return false
}
const dateIsAtEndOfInterval = (day: number, isNextMonth = false) => {
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  if (
    date.value &&
    !(date.value instanceof Date) &&
    (
      isDate(date.value.start) && date.value.start instanceof Date &&
      isDate(date.value.end) && date.value.end instanceof Date
    )
  ) {
    return isSameDay(setDate(month, day), date.value.end)
  }
  return false
}
const dateIsSameDay = (day: number, isNextMonth = false) => {
  // is null
  if (!date.value) {
    return false
  }

  // is a date
  else if (isDate(date.value) && date.value instanceof Date) {
    const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
    return isSameDay(setDate(month, day), date.value)
  }

  // is an object (range date)
  else if (
    !(date.value instanceof Date) &&
    (
      isDate(date.value.start) && date.value.start instanceof Date ||
      isDate(date.value.end) && date.value.end instanceof Date
    )
  ) {
    const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
    return (isDate(date.value.start) && date.value.start instanceof Date && isSameDay(setDate(month, day), date.value.start)) || (isDate(date.value.end) && date.value.end instanceof Date && isSameDay(setDate(month, day), date.value.end))
  }
}
const dateIsToday = (day: number, isNextMonth = false) => {
  const month = isNextMonth ? displayedNextMonth.value : displayedMonth.value
  return isSameDay(setDate(month, day), new Date())
}
</script>
