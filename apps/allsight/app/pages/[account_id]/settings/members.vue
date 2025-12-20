<template>
  <div v-if="membersLoading" class="loading">Loading members...</div>

  <div v-else-if="membersError" class="error">
    <p>{{ membersError }}</p>
  </div>

  <div v-else-if="members && members.length > 0">
    <h2>Members</h2>
    <div class="members-list">
      <div v-for="member in members" :key="member.user_id" class="member-item">
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

// Fetch members data using account ID from route params
const {
  data: members,
  error: membersError,
  pending: membersLoading,
} = await useFetch(`/api/accounts/${accountId}/members`, {
  server: true,
  default: () => [],
  headers: useRequestHeaders(["cookie"]),
})

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
</script>
