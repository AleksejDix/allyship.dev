<template>
  <div class="space-settings">
    <header class="page-header">
      <h1>{{ space?.name || "Space" }} Settings</h1>
    </header>

    <div v-if="loading" class="loading">Loading space settings...</div>

    <div v-else-if="error" class="error">
      <h2>Error loading space</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="space" class="settings-content">
      <nav>
        <ul>
          <li>
            <NuxtLink :to="`/${accountId}/settings`" exact-path-class="active">
              General
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="`/${accountId}/settings/members`"
              exact-path-class="active"
            >
              Members
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="`/${accountId}/settings/billing`"
              exact-path-class="active"
            >
              Billing
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="`/${accountId}/settings/danger`"
              exact-path-class="active"
            >
              Danger Zone
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <main class="settings-main">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const accountId = route.params.account_id as string

// Fetch space data with SSR support and cookie headers
const {
  data: space,
  error,
  pending: loading,
} = await useFetch(`/api/accounts?id=${accountId}`, {
  server: true,
  default: () => null,
  // Pass cookies from the request during SSR so authentication works
  headers: useRequestHeaders(["cookie"]),
})
</script>
