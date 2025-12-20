<script setup lang="ts">
const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">General Settings</h1>

    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Account ID
          </label>
          <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded border">
            {{ accountId }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
