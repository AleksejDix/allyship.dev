<script setup lang="ts">
const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

// Fetch members data using account ID from route params
const { data, error, pending } = await useFetch(
  `/api/accounts/${accountId}/members`,
  {
    server: true,
    default: () => [],
    headers: useRequestHeaders(["cookie"]),
  }
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Members</h1>

    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div v-if="pending" class="text-gray-600">Loading members...</div>
      <div v-else-if="error" class="text-red-600">Error loading members</div>
      <div v-else>
        <p class="text-sm text-gray-600 mb-4">
          Manage team members and their permissions.
        </p>
        <pre class="bg-gray-50 p-4 rounded">{{ data }}</pre>
      </div>
    </div>
  </div>
</template>
