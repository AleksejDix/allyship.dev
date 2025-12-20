<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="loading">Loading space...</div>

    <div v-else-if="error" class="error">
      <h2>Error loading space</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="space" class="space-content">
      <header class="space-header">
        <h1 class="text-2xl bold">{{ space.name }}</h1>
        <p class="space-slug">@{{ space.slug }}</p>
        <div v-if="space.personal_account" class="personal-badge">
          Personal Account
        </div>
      </header>

      <div class="space-actions">
        <NuxtLink :to="`/${accountId}/settings`" class="action-btn">
          Settings
        </NuxtLink>
      </div>

      <div class="space-details">
        <div class="detail-item">
          <strong>Account ID:</strong> {{ space.account_id }}
        </div>
        <div class="detail-item">
          <strong>Role:</strong> {{ space.account_role }}
        </div>
        <div class="detail-item">
          <strong>Primary Owner:</strong>
          {{ space.is_primary_owner ? "Yes" : "No" }}
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Space not found</h2>
      <p>
        The space with ID "{{ $route.params.account_id }}" could not be found.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

console.log("Account ID from route:", accountId, "type:", typeof accountId)

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
