<template>
  <div class="space-page">
    <div v-if="loading" class="loading">
      Loading space...
    </div>

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

      <div class="space-details">
        <div class="detail-item">
          <strong>Account ID:</strong> {{ space.account_id }}
        </div>
        <div class="detail-item">
          <strong>Role:</strong> {{ space.account_role }}
        </div>
        <div class="detail-item">
          <strong>Primary Owner:</strong> {{ space.is_primary_owner ? 'Yes' : 'No' }}
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

// Reactive data
const space = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch space data
const fetchSpace = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('Fetching space with slug:', slug)
    const response = await $fetch(`/api/accounts?slug=${slug}`)
    console.log('API response:', response)

    if (response) {
      space.value = response
    } else {
      space.value = null
    }
  } catch (err) {
    console.error('Error fetching space:', err)
    console.error('Error details:', err.data || err)
    error.value = err.message || 'Failed to load space'
  } finally {
    loading.value = false
  }
}

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Fetch data on mount
onMounted(() => {
  fetchSpace()
})

// Watch for route changes (in case slug changes)
watch(() => route.params.slug, (newSlug) => {
  if (newSlug && newSlug !== slug) {
    fetchSpace()
  }
})
</script>

<style scoped>
.space-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
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

.space-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.space-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.space-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.space-slug {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.personal-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.space-details {
  padding: 2rem;
}

.detail-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #667eea;
}

.detail-item strong {
  color: #333;
  display: inline-block;
  min-width: 120px;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h2 {
  color: #666;
  margin-bottom: 1rem;
}

.home-link {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.home-link:hover {
  background: #5a67d8;
}
</style>