<script setup>
import { createClient } from "@supabase/supabase-js"

const config = useRuntimeConfig()
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey
)
const frameworks = ref([])
async function getFramworks() {
  const { data } = await supabase.from("frameworks").select()
  frameworks.value = data
}
onMounted(() => {
  getFramworks()
})
</script>
<template>
  <ul>
    <li v-for="framework in frameworks" :key="framework.id">
      {{ framework.display_name }}
    </li>
  </ul>
</template>
