<script setup lang="ts">
import { FETCH_KEYS } from "~/lib/fetchKeys"

const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

// Fetch members data using account ID from route params
const { data, error, pending } = await useFetch(
  `/api/accounts/${accountId}/members`,
  {
    key: FETCH_KEYS.accounts.members(accountId),
    server: true,
    default: () => [],
    headers: useRequestHeaders(["cookie"]),
  }
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Members</h1>

    <div class="bg-white border-2 border-black">
      <div v-if="pending" class="p-6 text-gray-600">Loading members...</div>
      <div v-else-if="error" class="p-6 text-red-600">
        Error loading members
      </div>
      <div v-else-if="data && data.length > 0">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-black">
              <th class="text-left px-4 py-3 font-semibold">Name</th>
              <th class="text-left px-4 py-3 font-semibold">Email</th>
              <th class="text-left px-4 py-3 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in data"
              :key="member.user_id"
              class="border-b border-gray-200 last:border-0"
            >
              <td class="px-4 py-3">
                {{ member.name }}
                <span
                  v-if="member.is_primary_owner"
                  class="ml-2 text-xs text-gray-500"
                >
                  (Owner)
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ member.email }}</td>
              <td class="px-4 py-3">
                <span class="capitalize">{{ member.account_role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 text-gray-600">No members found</div>
    </div>
  </div>
</template>
