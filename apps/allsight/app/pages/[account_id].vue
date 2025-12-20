<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="loading">Loading space...</div>

    <div v-else-if="error" class="error">
      <h2>Error loading space</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="space" class="space-content">
      <div class="flex border-b-2 border-black">
        <NuxtLink :to="`/${accountId}`" class="tab"> General </NuxtLink>
        <NuxtLink :to="`/${accountId}/settings`" class="tab">
          Settings
        </NuxtLink>
      </div>
      <NuxtPage />
    </div>

    <div v-else class="not-found">
      <h2>Space not found</h2>
      <p>The space with ID "{{ accountId }}" could not be found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

if (!accountId) {
  throw createError({
    statusCode: 400,
    statusMessage: "Invalid account ID",
  })
}

const {
  data: space,
  error,
  pending: loading,
} = await useFetch(`/api/accounts?id=${accountId}`, {
  server: true,
  default: () => null,
  headers: useRequestHeaders(["cookie"]),
})
</script>

<style scoped>
.tab {
  @apply bg-gray-200 h-8 px-3 flex items-center;
}

.tab.router-link-exact-active,
.tab:hover {
  @apply bg-black text-white;
}
</style>
