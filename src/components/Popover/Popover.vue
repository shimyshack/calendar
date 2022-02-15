<template>
  <div ref="trigger">
    <slot
      name="trigger"
      :is-open="open"
      :open="() => open = true"
      :close="() => open = false"
      :toggle="() => open = !open"
    />
  </div>
  <Teleport to="body">
    <Transition
      enter-from-class="c-transform c-opacity-0"
      enter-active-class="c-transition c-ease-out c-duration-100"
      enter-to-class="c-transform c-opacity-100 c-scale-100"
      leave-from-class="c-transform c-opacity-100 c-scale-100"
      leave-active-class="c-transition c-ease-in c-duration-75"
      leave-to-class="c-transform c-opacity-0 c-scale-95"
    >
      <div
        ref="popover"
        v-if="open"
        class="c-preflight c-fixed c-z-50"
        :style="positionStyle"
      >
        <div class="c-bg-white c-border c-shadow-lg c-p-4 c-rounded">
          <slot
            :is-open="open"
            :open="() => open = true"
            :close="() => open = false"
            :toggle="() => open = !open"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { CSSProperties } from 'vue'
export interface CSSObject extends CSSProperties {
  [ key: string ]: CSSObject | string | number | undefined;
}
</script>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { onClickOutside, onKeyUp, useElementBounding, useWindowSize } from '@vueuse/core'

const props = defineProps({
  offsetY: { type: Number, default: 8 }
})

const trigger = ref(null)
const popover = ref(null)
const open = ref(false)
const triggerRect = reactive(useElementBounding(trigger))
const popoverRect = reactive(useElementBounding(popover))
const windowSize = reactive(useWindowSize())

const positionStyle = computed(() => {
  const position: CSSObject = {}

  // vertical position
  if (triggerRect.bottom + props.offsetY + popoverRect.height > windowSize.height) {
    position.top = `${triggerRect.top - props.offsetY - popoverRect.height}px`
  } else {
    position.top = `${triggerRect.top + triggerRect.height + props.offsetY}px`
  }

  // horizontal position
  if (triggerRect.left + popoverRect.width < windowSize.width) {
    position.left = `${triggerRect.left}px`
  } else {
    position.right = `${windowSize.width - triggerRect.right}px`
  }

  return position
})

onClickOutside(popover, (event) => {
  if (event.target === trigger.value || (trigger.value && (trigger.value as HTMLElement).contains((event.target as HTMLElement)))) return
  if (!open.value) return
  open.value = false
})

onKeyUp('Escape', () => {
  if (!open.value) return
  open.value = false
})
</script>