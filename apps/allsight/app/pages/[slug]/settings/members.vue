<template>
  <div class="space-settings">
    <header class="page-header">
      <h1>{{ space?.name || 'Space' }} Settings</h1>
      <NuxtLink :to="`/${space?.slug}`" class="back-link">← Back to space</NuxtLink>
    </header>

    <div v-if="loading" class="loading">
      Loading space settings...
    </div>

    <div v-else-if="error" class="error">
      <h2>Error loading space</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="space" class="settings-content">
      <nav class="settings-nav">
        <ul>
          <li>
            <NuxtLink :to="`/${space.slug}/settings`" exact-path-class="active">
              General
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="`/${space.slug}/settings/members`" exact-path-class="active">
              Members
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="`/${space.slug}/settings/billing`" exact-path-class="active">
              Billing
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="`/${space.slug}/settings/danger`" exact-path-class="active">
              Danger Zone
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <main class="settings-main">
        <div class="settings-section">
          <h2>Members</h2>

          <div v-if="membersLoading" class="loading">
            Loading members...
          </div>

          <div v-else-if="membersError" class="error">
            <p>{{ membersError }}</p>
          </div>

          <div v-else-if="members && members.length > 0">
            <div class="members-list">
              <div
                v-for="member in members"
                :key="member.user_id"
                class="member-item"
              >
                <div class="member-info">
                  <strong>{{ member.user_id }}</strong>
                  <span class="member-role">{{ member.account_role }}</span>
                </div>
                <div class="member-meta">
                  <span>Joined: {{ formatDate(member.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <p>No members found.</p>
          </div>
        </div>
      </main>
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

// Reactive members data
const members = ref([])
const membersError = ref(null)
const membersLoading = ref(false)

// Fetch members when space data is available
const fetchMembers = async () => {
  if (!space.value?.account_id) return

  try {
    membersLoading.value = true
    membersError.value = null

    const { data } = await $fetch(`/api/accounts/${space.value.account_id}/members`, {
      headers: useRequestHeaders(["cookie"]),
    })

    members.value = data || []
  } catch (err) {
    console.error('Error fetching members:', err)
    membersError.value = err.message || 'Failed to load members'
  } finally {
    membersLoading.value = false
  }
}

// Watch for space data and fetch members
watch(space, (newSpace) => {
  if (newSpace?.account_id) {
    fetchMembers()
  }
}, { immediate: true })

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
</script>

<style scoped>
.space-settings {
  max-width: 900px;
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
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.settings-nav {
  width: 200px;
  flex-shrink: 0;
}

.settings-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.settings-nav li {
  margin-bottom: 0.25rem;
}

.settings-nav a {
  display: block;
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.settings-nav a:hover,
.settings-nav a.active {
  background: #f3f4f6;
  color: #374151;
}

.settings-main {
  flex: 1;
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

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.member-item {
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.member-role {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 4px;
  font-size: 0.875rem;
}

.member-meta {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>