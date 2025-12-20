<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from "vue"

interface Props {
  color?: "gray" | "black"
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "black",
  asChild: false,
})

const slots = useSlots()
const attrs = useAttrs()

const linkClasses = computed(() => {
  const colorClasses = {
    gray: "text-gray-600 hover:text-gray-800 underline underline-offset-4",
    black: "text-black hover:text-gray-600 underline underline-offset-4",
  }

  return colorClasses[props.color!]
})

// Hydration-safe render function
const render = () => {
  if (!props.asChild) {
    // Use NuxtLink for proper client-side routing
    return h(
      "NuxtLink",
      {
        class: linkClasses.value,
        ...attrs,
      },
      slots.default?.()
    )
  }

  const slotContent = slots.default?.()
  if (!slotContent?.length) return

  const child = slotContent[0]
  if (!child) return

  // Merge classes safely without changing VNode structure
  const existingClass = child.props?.class || ""
  const mergedClass = existingClass
    ? `${existingClass} ${linkClasses.value}`
    : linkClasses.value

  return h(
    child.type,
    {
      ...child.props,
      ...attrs,
      class: mergedClass,
    },
    child.children
  )
}
</script>

<template>
  <render />
</template>
