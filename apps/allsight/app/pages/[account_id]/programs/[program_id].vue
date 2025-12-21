<script setup lang="ts">
import { FETCH_KEYS } from "~/lib/fetchKeys"

const route = useRoute()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

const programId = Array.isArray(route.params.program_id)
  ? route.params.program_id[0]
  : (route.params.program_id as string)

// Fetch program details with controls
const { data: program, error, pending } = await useFetch(
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
  <div class="py-8">
    <div v-if="pending" class="text-gray-600">Loading program...</div>
    <div v-else-if="error" class="text-red-600">
      <h1 class="text-2xl font-bold mb-4">Error</h1>
      <p>{{ error.statusMessage || "Failed to load program" }}</p>
      <NuxtLink
        :to="`/${accountId}/programs`"
        class="text-blue-600 hover:underline mt-4 inline-block"
      >
        ← Back to programs
      </NuxtLink>
    </div>
    <div v-else-if="program">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink
          :to="`/${accountId}/programs`"
          class="text-sm text-gray-600 hover:text-black mb-2 inline-block"
        >
          ← Back to programs
        </NuxtLink>
        <h1 class="text-2xl font-bold">{{ program.framework.display_name }}</h1>
        <p class="text-gray-600 mt-2">{{ program.framework.description }}</p>
      </div>

      <!-- Framework Details -->
      <div class="bg-white border-2 border-black p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Framework Details</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium">Jurisdiction:</span>
            <span class="capitalize ml-1">{{
              program.framework.jurisdiction
            }}</span>
          </div>
          <div>
            <span class="font-medium">Compliance Type:</span>
            <span class="capitalize ml-1">{{
              program.framework.compliance_type
            }}</span>
          </div>
          <div>
            <span class="font-medium">Status:</span>
            <span class="capitalize ml-1">{{ program.framework.status }}</span>
          </div>
          <div v-if="program.framework.has_penalties">
            <span class="font-medium">Max Penalty:</span>
            <span class="ml-1">{{ program.framework.max_penalty }}</span>
          </div>
        </div>

        <div
          v-if="
            program.framework.tags && program.framework.tags.length > 0
          "
          class="mt-4"
        >
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

        <a
          v-if="program.framework.official_url"
          :href="program.framework.official_url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline text-sm mt-4 inline-block"
        >
          Official Documentation →
        </a>
      </div>

      <!-- Controls Checklist -->
      <div class="bg-white border-2 border-black">
        <div class="border-b-2 border-black p-6">
          <h2 class="text-lg font-semibold">
            Controls Checklist
            <span class="text-sm font-normal text-gray-600 ml-2">
              ({{ program.controls?.length || 0 }} controls)
            </span>
          </h2>
        </div>

        <div v-if="program.controls && program.controls.length > 0">
          <div
            v-for="(item, index) in program.controls"
            :key="item.id"
            class="border-b border-gray-200 last:border-0"
          >
            <div class="p-4 hover:bg-gray-50">
              <div class="flex items-start gap-3">
                <input
                  type="checkbox"
                  :id="`control-${item.id}`"
                  class="mt-1 h-4 w-4"
                />
                <label :for="`control-${item.id}`" class="flex-1 cursor-pointer">
                  <div class="font-medium">
                    {{ item.control.id }}
                    <span
                      v-if="!item.control.is_production_ready"
                      class="ml-2 text-xs text-yellow-600"
                    >
                      (Draft)
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">
                    {{ item.control.name }}
                  </div>
                  <div
                    v-if="item.control.description"
                    class="text-xs text-gray-500 mt-1"
                  >
                    {{ item.control.description }}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-6 text-gray-600">
          No controls found for this program.
        </div>
      </div>
    </div>
  </div>
</template>
