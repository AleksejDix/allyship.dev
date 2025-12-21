<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="loading">Loading program...</div>

    <div v-else-if="error" class="error">
      <h2>
        {{
          error.statusCode === 403
            ? "Access Denied"
            : error.statusCode === 404
              ? "Program Not Found"
              : "Error Loading Program"
        }}
      </h2>
      <p>
        {{
          error.statusCode === 403
            ? "You do not have permission to access this program."
            : error.statusCode === 404
              ? `The program with ID "${programId}" could not be found.`
              : error.statusMessage || "An unexpected error occurred."
        }}
      </p>
      <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block">
        ← Back to accounts
      </NuxtLink>
    </div>

    <div v-else-if="program" class="program-content">
      <!-- Header with account link -->
      <div class="mb-4">
        <NuxtLink
          v-if="program.account_id"
          :to="`/${program.account_id}/programs`"
          class="text-sm text-gray-600 hover:text-black"
        >
          ← Back to programs
        </NuxtLink>
      </div>

      <!-- Program title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold">{{ program.framework.display_name }}</h1>
        <p class="text-gray-600 mt-1">{{ program.framework.shorthand_name }}</p>
      </div>

      <!-- Navigation tabs -->
      <div class="flex border-b-2 border-black">
        <NuxtLink exact :to="`/${accountId}/programs/${programId}`" class="tab root">
          Overview
        </NuxtLink>
        <NuxtLink :to="`/${accountId}/programs/${programId}/settings`" class="tab">
          Settings
        </NuxtLink>
      </div>

      <NuxtPage />
    </div>

    <div v-else class="not-found">
      <h2>Program not found</h2>
      <p>The program with ID "{{ programId }}" could not be found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FETCH_KEYS } from "~/lib/fetchKeys"

const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

const programId = Array.isArray(route.params.program_id)
  ? route.params.program_id[0]
  : (route.params.program_id as string)

if (!accountId || !programId) {
  throw createError({
    statusCode: 400,
    statusMessage: "Invalid account ID or program ID",
  })
}

const {
  data: program,
  error,
  pending: loading,
} = await useFetch(`/api/accounts/${accountId}/programs/${programId}`, {
  key: FETCH_KEYS.accounts.programById(accountId, programId),
  server: true,
  default: () => null,
  headers: useRequestHeaders(["cookie"]),
})
</script>

<style scoped>
.tab {
  @apply bg-gray-200 h-8 px-3 flex items-center;
}

.tab.root.router-link-exact-active,
.tab:not(.root).router-link-active,
.tab:hover {
  @apply bg-black text-white;
}
</style>
