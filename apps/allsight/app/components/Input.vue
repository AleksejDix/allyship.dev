<template>
  <input
    :type="type"
    :class="`flex h-8 w-full border-2 border-black px-3 py-2 text-base ring-offset-white ring-black file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${$attrs.class || ''}`"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: "text",
  },
})

defineEmits(["update:modelValue"])
</script>
