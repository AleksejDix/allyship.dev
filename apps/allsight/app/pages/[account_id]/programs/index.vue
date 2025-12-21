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

// Fetch featured frameworks
const { data: featuredFrameworks } = await useFetch("/api/frameworks", {
  query: { featured: "true" },
  server: true,
  default: () => [],
})

// Get framework IDs that are already started
const startedFrameworkIds = computed(() =>
  programs.value?.map((p: any) => p.framework.id) || []
)

// Filter available frameworks (not yet started)
const availableFrameworks = computed(() =>
  featuredFrameworks.value?.filter(
    (f: any) => !startedFrameworkIds.value.includes(f.id)
  ) || []
)

// State for starting a program
const startingProgramId = ref<string | null>(null)

// Function to start a program
const startProgram = async (frameworkId: string) => {
  startingProgramId.value = frameworkId

  try {
    await $fetch(`/api/accounts/${accountId}/programs`, {
      method: "POST",
      body: {
        framework_id: frameworkId,
      },
    })

    // Refresh the programs list
    await refreshNuxtData(FETCH_KEYS.accounts.programs(accountId))
  } catch (error: any) {
    console.error("Failed to start program:", error)
    alert(error.data?.message || "Failed to start program. Please try again.")
  } finally {
    startingProgramId.value = null
  }
}
</script>

<template>
  <div class="py-8 space-y-8">
    <div v-if="pending">
      <h1 class="text-2xl font-bold mb-6">Programs</h1>
      <div class="text-gray-600">Loading programs...</div>
    </div>

    <div v-else-if="error">
      <h1 class="text-2xl font-bold mb-6">Programs</h1>
      <div class="text-red-600">Error loading programs</div>
    </div>

    <template v-else>
      <!-- Active Programs -->
      <div v-if="programs && programs.length > 0">
        <h2 class="text-xl font-bold mb-4">Active Programs</h2>
        <div class="space-y-4">
          <div
            v-for="program in programs"
            :key="program.id"
            class="bg-white border-2 border-black hover:bg-gray-50 transition-colors"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2">
                    {{ program.framework.display_name }}
                  </h3>
                  <p class="text-gray-600 mb-4">{{ program.framework.description }}</p>

                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium">Jurisdiction:</span>
                      <span class="capitalize ml-1">{{ program.framework.jurisdiction }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Compliance Type:</span>
                      <span class="capitalize ml-1">{{ program.framework.compliance_type }}</span>
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
                  class="text-blue-600 hover:underline text-sm ml-4"
                  @click.stop
                >
                  Official URL →
                </a>
              </div>

              <NuxtLink
                :to="`/${program.id}`"
                class="text-sm text-blue-600 hover:underline inline-block"
              >
                View Details →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Programs to Start -->
      <div v-if="availableFrameworks && availableFrameworks.length > 0">
        <h2 class="text-xl font-bold mb-4">Start a New Program</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="framework in availableFrameworks"
            :key="framework.id"
            class="bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors"
          >
            <h3 class="text-lg font-semibold mb-2">
              {{ framework.display_name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4">{{ framework.description }}</p>

            <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span class="capitalize">{{ framework.compliance_type }}</span>
              <span class="capitalize">{{ framework.jurisdiction }}</span>
            </div>

            <button
              @click="startProgram(framework.id)"
              :disabled="startingProgramId === framework.id"
              class="w-full bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{
                startingProgramId === framework.id
                  ? "Starting..."
                  : "Start Program"
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!programs?.length && !availableFrameworks?.length" class="bg-white border-2 border-black p-6">
        <p class="text-gray-600">No programs available.</p>
      </div>
    </template>
  </div>
</template>
