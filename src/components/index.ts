import 'virtual:windi.css'
import { App, Component } from 'vue'
import Calendar from './Calendar'

const Components: Component[] = [
  Calendar
]

export default {
  install(Vue: App) {
    Components.forEach((value: any) => {
      Vue.component(value, Components[value]);
    })
  }
}

export { default as Calendar } from './Calendar'