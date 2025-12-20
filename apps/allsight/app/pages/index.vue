<script setup lang="ts">
import Link from "@/components/Link.vue"

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
  <div class="mx-auto container p-4">
    <h1 class="text-2xl bold">Your Accounts</h1>
    <div class="mb-4">
      <NuxtLink to="/create" class="text-blue-600 underline"
        >Create New Account</NuxtLink
      >
    </div>

    <!-- Show loading state -->
    <div v-if="pending">
      <p>Loading accounts...</p>
    </div>

    <!-- Show error state (non-401 errors) -->
    <div v-else-if="error && error.statusCode !== 401">
      <p>Error loading accounts: {{ error.message || "Unknown error" }}</p>
    </div>

    <!-- Show accounts if successfully loaded -->
    <div
      v-else-if="accounts && accounts.length > 0"
      class="grid grid-cols-3 gap-8"
    >
      <div
        v-for="account in accounts"
        :key="account.account_id"
        class="border-2 border-black p-4"
      >
        <div>
          <h2>{{ account.name || "Unnamed Account" }}</h2>
          <Link asChild>
            <NuxtLink :to="`/${account.account_id}`"> View Space </NuxtLink>
          </Link>
        </div>
        <p>
          <strong>Role:</strong> {{ account.account_role }}
          <span v-if="account.is_primary_owner"> (Primary Owner)</span>
          <span v-if="account.personal_account"> • Personal Account</span>
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
