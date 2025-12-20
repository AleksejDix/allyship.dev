<script setup lang="ts">
type Account = {
  account_id: string
  account_role: string
  is_primary_owner: boolean
  name: string
  slug: string
  personal_account: boolean
  created_at: string
  updated_at: string
}

// Check authentication status
// const user = useSupabaseUser()

// Server-side data fetching with proper cookie handling for SSR
const {
  data: accounts,
  error,
  pending,
} = await useFetch<Account[]>("/api/accounts", {
  server: true,
  default: () => [],
  // Pass cookies from the request during SSR so authentication works
  headers: useRequestHeaders(["cookie"]),
})
</script>

<template>
  <div>
    <h1>Your Accounts</h1>

    <!-- Show loading state -->
    <div v-if="pending">
      <p>Loading accounts...</p>
    </div>

    <!-- Show error state (non-401 errors) -->
    <div v-else-if="error && error.statusCode !== 401">
      <p>Error loading accounts: {{ error.message || "Unknown error" }}</p>
    </div>

    <!-- Show accounts if successfully loaded -->
    <div v-else-if="accounts && accounts.length > 0">
      <div
        v-for="account in accounts"
        :key="account.account_id"
        class="account-card"
      >
        <div class="account-header">
          <h2>{{ account.name || "Unnamed Account" }}</h2>
          <NuxtLink
            :to="`/${account.account_id}`"
            class="view-space-btn"
          >
            View Space
          </NuxtLink>
        </div>
        <p>
          <strong>Role:</strong> {{ account.account_role }}
          <span v-if="account.is_primary_owner"> (Primary Owner)</span>
          <span v-if="account.personal_account"> • Personal Account</span>
        </p>
        <p v-if="account.slug"><strong>Slug:</strong> {{ account.slug }}</p>
        <p>
          <strong>Created:</strong>
          {{ new Date(account.created_at).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <!-- Show sign-in prompt only when we get a 401 error -->
    <div v-else-if="error?.statusCode === 401">
      <p>Please sign in to view your accounts.</p>
      <NuxtLink to="/signin-password">Sign in</NuxtLink>
    </div>

    <!-- Show empty state when authenticated but no accounts -->
    <div v-else-if="accounts && accounts.length === 0 && !pending">
      <p>You don't have any accounts yet.</p>
    </div>

    <!-- Fallback: show sign-in if nothing else matches -->
    <div v-else-if="!accounts && !pending && !error">
      <p>Please sign in to view your accounts.</p>
      <NuxtLink to="/signin-password">Sign in</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.account-card {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.account-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.account-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.view-space-btn {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.view-space-btn:hover {
  background: #5a67d8;
}

.account-card p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.account-card strong {
  color: #2d3748;
}
</style>
