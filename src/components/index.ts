import '../main.css'
import 'virtual:windi.css'
import { App, Component } from 'vue'
import Calendar from './Calendar'
import Datepicker from './Datepicker'
import Popover from './Popover'
import Table from './Table'

interface ComponentList {
  [index: string]: Component
}

const Components: ComponentList = {
  Calendar,
  Datepicker,
  Popover,
  Table
}

export default {
  install(Vue: App) {
    Object.keys(Components).forEach((value: any) => {
      Vue.component(value, Components[value]);
    })
  }
}

export { default as Calendar } from './Calendar'
export { default as Datepicker } from './Datepicker'
export { default as Popover } from './Popover'
export { default as Table } from './Popover'