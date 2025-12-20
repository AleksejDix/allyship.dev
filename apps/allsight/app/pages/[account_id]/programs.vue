<script setup lang="ts">
import { FETCH_KEYS } from "~/lib/fetchKeys"

const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

// Fetch programs for this account
const { data: programs, error, pending } = await useFetch(
  `/api/accounts/${accountId}/programs`,
  {
    key: FETCH_KEYS.accounts.programs(accountId),
    server: true,
    default: () => [],
    headers: useRequestHeaders(["cookie"]),
  }
)
</script>

<template>
  <div class="py-8">
    <h1 class="text-2xl font-bold mb-6">Programs</h1>

    <div v-if="pending" class="text-gray-600">Loading programs...</div>
    <div v-else-if="error" class="text-red-600">Error loading programs</div>
    <div v-else-if="programs && programs.length > 0" class="space-y-4">
      <div
        v-for="program in programs"
        :key="program.id"
        class="bg-white border-2 border-black p-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold mb-2">
              {{ program.framework.display_name }}
            </h2>
            <p class="text-gray-600 mb-4">{{ program.framework.description }}</p>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">Jurisdiction:</span>
                {{ program.framework.jurisdiction }}
              </div>
              <div>
                <span class="font-medium">Compliance Type:</span>
                {{ program.framework.compliance_type }}
              </div>
              <div>
                <span class="font-medium">Status:</span>
                <span class="capitalize">{{ program.framework.status }}</span>
              </div>
              <div v-if="program.framework.has_penalties">
                <span class="font-medium">Max Penalty:</span>
                {{ program.framework.max_penalty }}
              </div>
            </div>

            <div v-if="program.framework.tags && program.framework.tags.length > 0" class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in program.framework.tags"
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <a
            v-if="program.framework.official_url"
            :href="program.framework.official_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline text-sm"
          >
            Official URL →
          </a>
        </div>
      </div>
    </div>
    <div v-else class="bg-white border-2 border-black p-6">
      <p class="text-gray-600">No programs found for this account.</p>
      <p class="text-sm text-gray-500 mt-2">
        Programs are frameworks that your organization can implement for compliance.
      </p>
    </div>
  </div>
</template>
