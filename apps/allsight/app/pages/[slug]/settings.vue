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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e5e9;
}

.page-header h1 {
  margin: 0;
  color: #2d3748;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #5a67d8;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.error h2 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section h2 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item span {
  color: #2d3748;
  font-size: 1rem;
}

.coming-soon {
  color: #718096;
  font-style: italic;
  margin: 0;
}
</style>