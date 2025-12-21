<template>
  <div class="flex gap-8 py-8">
    <!-- Left Sidebar Navigation -->
    <aside class="w-64 flex-shrink-0">
      <nav class="sticky top-6">
        <ul class="space-y-1">
          <li>
            <NuxtLink
              :to="`/${programId}/settings`"
              class="block px-4 py-2 text-sm font-medium"
              exact-active-class="bg-gray-100"
            >
              General
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 max-w-3xl">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const programId = route.params.program_id as string
</script>
