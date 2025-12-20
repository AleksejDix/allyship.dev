<script setup lang="ts">
import { FETCH_KEYS } from "~/lib/fetchKeys"

const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

// Fetch account details
const { data: account, error, pending } = await useFetch(
  `/api/accounts/${accountId}`,
  {
    key: FETCH_KEYS.accounts.byId(accountId),
    server: true,
    default: () => null,
    headers: useRequestHeaders(["cookie"]),
  }
)
</script>

<template>
  <div class="py-8">
    <h1 class="text-2xl font-bold mb-6">General</h1>

    <div v-if="pending" class="text-gray-600">Loading account...</div>
    <div v-else-if="error" class="text-red-600">Error loading account</div>
    <div v-else-if="account" class="space-y-6">
      <div class="bg-white border-2 border-black p-6">
        <h2 class="text-lg font-semibold mb-4">Account Information</h2>
        
        <div class="space-y-3">
          <div>
            <span class="font-medium">Account ID:</span>
            <p class="text-gray-600 font-mono text-sm mt-1">{{ accountId }}</p>
          </div>
          
          <div v-if="account.name">
            <span class="font-medium">Name:</span>
            <p class="text-gray-600 mt-1">{{ account.name }}</p>
          </div>
          
          <div v-if="account.slug">
            <span class="font-medium">Slug:</span>
            <p class="text-gray-600 mt-1">{{ account.slug }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
