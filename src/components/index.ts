import '../main.css'
import 'virtual:windi.css'
import { App, Component } from 'vue'
import Calendar from './Calendar'

interface ComponentList {
  [index: string]: Component
}

const Components: ComponentList = {
  Calendar
}

export default {
  install(Vue: App) {
    Object.keys(Components).forEach((value: any) => {
      Vue.component(value, Components[value]);
    })
  }
}

export { default as Calendar } from './Calendar'