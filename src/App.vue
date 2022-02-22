<script setup lang="ts">
import { ref } from 'vue'
import Datepicker from './components/Datepicker/Datepicker.vue'
import Table from './components/Table/Table.vue';

const date = ref({ start: null, end: null })
// const date = ref(null)
const min = ref(new Date('02-03-2022'))
const max = ref(new Date('03-12-2022'))

const fields = ref([
  { key: 'id', label: 'ID', header: true },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'createdDate', label: 'Created', hidden: true, format: (date: Date) => date.toLocaleDateString() },
  { key: 'actions', label: 'Actions' }
])
const items = ref([
  { id: 1, title: 'Test', description: 'Lorem ipsum...', createdDate: new Date() },
  { id: 2, title: 'Another one', description: 'Si dolor omit...', createdDate: new Date() },
])
</script>

<template>
  <div class="c-preflight c-p-8">
    <Table :fields="fields" :items="items" class="c-w-full">
      <template #col(description)>
        <col class="c-bg-gray-200">
      </template>
      <template #head(title)="{ field }">
        <span class="c-text-red-500">{{ field.label }}</span>
      </template>
      <template #cell(title)="{ value, item, format }">
        <p>Title: {{ value }}</p>
        <p>Created: {{ format('createdDate') }}</p>
        <p>ID: {{ item.id }}</p>
      </template>
      <template #cell(actions)="{ item }">
        {{ item.id }}
      </template>
    </Table>
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
