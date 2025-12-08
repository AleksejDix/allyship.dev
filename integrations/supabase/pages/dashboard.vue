<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <!-- Connected Integrations Section -->
    <div class="integrations-section">
      <div class="section-header">
        <h2>Connected Integrations</h2>
        <NuxtLink to="/" class="connect-btn">+ Connect New Integration</NuxtLink>
      </div>

      <p v-if="integrationsLoading">Loading integrations...</p>

      <div v-else-if="integrationsError" class="error">
        {{ integrationsError }}
      </div>

      <div v-else-if="integrations.length === 0" class="empty-state">
        <p>No integrations connected yet.</p>
        <NuxtLink to="/" class="connect-btn">Connect Supabase</NuxtLink>
      </div>

      <div v-else class="integrations-grid">
        <div
          v-for="integration in integrations"
          :key="integration.id"
          class="integration-card"
          :class="{ 'status-error': integration.status === 'error' }"
        >
          <div class="card-header">
            <div>
              <h3>{{ integration.name }}</h3>
              <p class="integration-type">{{ integration.integration_type }}</p>
            </div>
            <span class="status-badge" :class="`status-${integration.status}`">
              {{ integration.status }}
            </span>
          </div>

          <div class="card-body">
            <p class="created-at">
              Connected {{ formatDate(integration.created_at) }}
            </p>

            <p v-if="integration.error_message" class="error-message">
              ⚠️ {{ integration.error_message }}
            </p>

            <p v-if="integration.last_checked_at" class="last-checked">
              Last checked: {{ formatDate(integration.last_checked_at) }}
            </p>
          </div>

          <div class="card-actions">
            <button
              v-if="integration.status === 'error'"
              @click="reconnect(integration.id)"
              class="btn btn-primary"
            >
              Reconnect
            </button>
            <button
              v-else
              @click="refreshToken(integration.id)"
              class="btn btn-secondary"
              :disabled="refreshing[integration.id]"
            >
              {{ refreshing[integration.id] ? 'Refreshing...' : 'Refresh Token' }}
            </button>
            <button
              @click="deleteIntegration(integration.id)"
              class="btn btn-danger"
              :disabled="deleting[integration.id]"
            >
              {{ deleting[integration.id] ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Section (if any integration is connected) -->
    <div v-if="integrations.length > 0" class="projects-section">
      <h2>Your Projects</h2>
      <p v-if="projectsLoading">Loading your Supabase projects...</p>

      <div v-else-if="projectsError" class="error">
        {{ projectsError }}
      </div>

      <div v-else class="projects-grid">
        <div v-for="project in projects" :key="project.id" class="project-card">
          <h3>{{ project.name }}</h3>
          <p class="region">{{ project.region }}</p>
          <NuxtLink :to="`/scan/${project.id}`" class="scan-btn">
            Run Security Scan
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const integrationsLoading = ref(true)
const integrationsError = ref<string | null>(null)
const integrations = ref([])

const projectsLoading = ref(true)
const projectsError = ref<string | null>(null)
const projects = ref([])

const refreshing = ref<Record<string, boolean>>({})
const deleting = ref<Record<string, boolean>>({})

// Fetch integrations
async function fetchIntegrations() {
  try {
    integrationsLoading.value = true
    const response = await fetch('/api/integrations')
    if (!response.ok) throw new Error('Failed to fetch integrations')
    const data = await response.json()
    integrations.value = data.integrations
  } catch (e: any) {
    integrationsError.value = e.message
  } finally {
    integrationsLoading.value = false
  }
}

// Fetch projects (if integrations exist)
async function fetchProjects() {
  if (integrations.value.length === 0) return

  try {
    projectsLoading.value = true
    const response = await fetch('/api/projects')
    if (!response.ok) throw new Error('Failed to fetch projects')
    projects.value = await response.json()
  } catch (e: any) {
    projectsError.value = e.message
  } finally {
    projectsLoading.value = false
  }
}

// Refresh token for an integration
async function refreshToken(integrationId: string) {
  refreshing.value[integrationId] = true
  try {
    const response = await fetch(`/api/integrations/${integrationId}/refresh`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to refresh token')
    await fetchIntegrations() // Reload integrations
    alert('Token refreshed successfully!')
  } catch (e: any) {
    alert(`Failed to refresh token: ${e.message}`)
  } finally {
    refreshing.value[integrationId] = false
  }
}

// Delete an integration
async function deleteIntegration(integrationId: string) {
  if (!confirm('Are you sure you want to delete this integration?')) return

  deleting.value[integrationId] = true
  try {
    const response = await fetch(`/api/integrations/${integrationId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete integration')
    await fetchIntegrations() // Reload integrations
    alert('Integration deleted successfully')
  } catch (e: any) {
    alert(`Failed to delete integration: ${e.message}`)
  } finally {
    deleting.value[integrationId] = false
  }
}

// Reconnect (redirect to OAuth flow)
function reconnect(integrationId: string) {
  // Delete old integration and start new OAuth flow
  navigateTo('/api/auth/login')
}

// Format date helper
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

onMounted(async () => {
  await fetchIntegrations()
  await fetchProjects()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.integrations-section {
  margin-bottom: 3rem;
}

.projects-section {
  margin-top: 3rem;
}

.error {
  color: #dc2626;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
}

.integrations-grid {
  display: grid;
  gap: 1.5rem;
}

.integration-card {
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.integration-card:hover {
  border-color: #3ECF8E;
}

.integration-card.status-error {
  border-color: #fca5a5;
  background: #fef2f2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.integration-type {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  text-transform: capitalize;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
}

.status-paused {
  background: #fef3c7;
  color: #92400e;
}

.card-body {
  margin-bottom: 1rem;
}

.created-at,
.last-checked {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3ECF8E;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2fb574;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.btn-danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background: #fecaca;
}

.connect-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3ECF8E;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
}

.connect-btn:hover {
  background: #2fb574;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.project-card {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.project-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.region {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.scan-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3ECF8E;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
}

.scan-btn:hover {
  background: #2fb574;
}
</style>
