<template>
  <div class="space-settings">
    <header class="page-header">
      <h1>{{ space?.name || 'Space' }} Settings</h1>
      <NuxtLink to="/" class="back-link">← Back to spaces</NuxtLink>
    </header>

    <div v-if="loading" class="loading">
      Loading space settings...
    </div>

    <div v-else-if="error" class="error">
      <h2>Error loading space</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="space" class="settings-content">
      <div class="settings-section">
        <h2>Space Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Name:</label>
            <span>{{ space.name }}</span>
          </div>
          <div class="info-item">
            <label>Slug:</label>
            <span>{{ space.slug }}</span>
          </div>
          <div class="info-item">
            <label>Type:</label>
            <span>{{ space.personal_account ? 'Personal' : 'Team' }}</span>
          </div>
          <div class="info-item">
            <label>Your Role:</label>
            <span>{{ space.account_role }}</span>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Space Settings</h2>
        <p class="coming-soon">Additional settings will be available here soon.</p>
      </div>
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
</script>

<style scoped>
.space-settings {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.page-header h1 {
  margin: 0;
}

.back-link {
  color: #6b7280;
  text-decoration: none;
}

.settings-content {
  margin: 1rem 0;
}

.settings-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 4px;
}

.settings-section h2 {
  margin: 0 0 0.5rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.info-item label {
  font-weight: 500;
  color: #6b7280;
}

.coming-soon {
  color: #9ca3af;
  font-style: italic;
}
</style>