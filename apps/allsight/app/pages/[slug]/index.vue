<template>
  <div class="space-page">
    <div v-if="loading" class="loading">Loading space...</div>

    <div v-else-if="error" class="error">
      <h2>Error loading space</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="space" class="space-content">
      <header class="space-header">
        <h1>{{ space.name }}</h1>
        <p class="space-slug">@{{ space.slug }}</p>
        <div v-if="space.personal_account" class="personal-badge">
          Personal Account
        </div>
      </header>

      <div class="space-actions">
        <NuxtLink :to="`/${space.slug}/settings`" class="action-btn">
          ⚙️ Settings
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
        <div class="detail-item">
          <strong>Created:</strong> {{ formatDate(space.created_at) }}
        </div>
        <div class="detail-item">
          <strong>Updated:</strong> {{ formatDate(space.updated_at) }}
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Space not found</h2>
      <p>The space with slug "{{ $route.params.slug }}" could not be found.</p>
      <NuxtLink to="/" class="home-link">Go back home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch space data with SSR support and cookie headers
const {
  data: space,
  error,
  pending: loading,
} = await useFetch(`/api/accounts?slug=${slug}`, {
  server: true,
  default: () => null,
  // Pass cookies from the request during SSR so authentication works
  headers: useRequestHeaders(["cookie"]),
})

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
</script>

<style scoped>
.space-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.space-content {
  margin: 1rem 0;
}

.space-header {
  text-align: center;
  margin-bottom: 1rem;
}

.space-actions {
  margin: 1rem 0;
}

.action-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}

.space-details {
  margin: 1rem 0;
}

.detail-item {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
}

.not-found {
  text-align: center;
  padding: 2rem;
}

.home-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}
</style>
