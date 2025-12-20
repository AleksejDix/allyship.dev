<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="loading">Loading space...</div>

    <div v-else-if="error" class="error">
      <h2>
        {{
          error.statusCode === 403
            ? "Access Denied"
            : error.statusCode === 404
              ? "Space Not Found"
              : "Error Loading Space"
        }}
      </h2>
      <p>
        {{
          error.statusCode === 403
            ? "You do not have permission to access this account."
            : error.statusCode === 404
              ? `The space with ID "${accountId}" could not be found.`
              : error.statusMessage || "An unexpected error occurred."
        }}
      </p>
      <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block">
        ← Back to accounts
      </NuxtLink>
    </div>

    <div v-else-if="space" class="space-content">
      <div class="flex border-b-2 border-black">
        <NuxtLink exact :to="`/${accountId}`" class="tab root">
          General
        </NuxtLink>
        <NuxtLink :to="`/${accountId}/programs`" class="tab">
          Programs
        </NuxtLink>
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
import { FETCH_KEYS } from "~/lib/fetchKeys"

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
} = await useFetch(`/api/accounts/${accountId}`, {
  key: FETCH_KEYS.accounts.byId(accountId),
  server: true,
  default: () => null,
  headers: useRequestHeaders(["cookie"]),
})
</script>

<style scoped>
.tab {
  @apply bg-gray-200 h-8 px-3 flex items-center;
}

.tab.root.route-link-exact-active,
.tab:not(.root).router-link-active,
.tab:hover {
  @apply bg-black text-white;
}
</style>
