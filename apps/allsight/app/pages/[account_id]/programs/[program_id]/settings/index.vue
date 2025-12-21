<script setup lang="ts">
import { FETCH_KEYS } from "~/lib/fetchKeys"

const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

const programId = Array.isArray(route.params.program_id)
  ? route.params.program_id[0]
  : (route.params.program_id as string)

// Fetch program details
const { data: program } = await useFetch(
  `/api/accounts/${accountId}/programs/${programId}`,
  {
    key: FETCH_KEYS.accounts.programById(accountId, programId),
    server: true,
    default: () => null,
    headers: useRequestHeaders(["cookie"]),
  }
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Program Settings</h1>

    <div class="space-y-6" v-if="program">
      <!-- Program ID Section -->
      <div class="bg-white border-2 border-black p-6">
        <h2 class="text-lg font-semibold mb-4">Program Information</h2>
        <div class="space-y-3">
          <div>
            <span class="font-medium">Program ID:</span>
            <p class="text-gray-600 font-mono text-sm mt-1">{{ programId }}</p>
          </div>
          <div>
            <span class="font-medium">Framework:</span>
            <p class="text-gray-600 mt-1">{{ program.framework.display_name }}</p>
          </div>
          <div>
            <span class="font-medium">Created:</span>
            <p class="text-gray-600 mt-1">
              {{ new Date(program.created_at).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
