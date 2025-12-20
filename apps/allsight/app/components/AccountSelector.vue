<script setup lang="ts">
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

const route = useRoute()

// Get current account from route
const currentAccountId = computed(() => route.params.account_id as string)

// Fetch accounts
const {
  data: accounts,
  error,
  pending,
} = await useFetch<Account[]>("/api/accounts", {
  server: true,
  default: () => [],
  headers: useRequestHeaders(["cookie"]),
})

// Get current account
const currentAccount = computed(() =>
  accounts.value?.find(
    (account) => account.account_id === currentAccountId.value
  )
)

// Get other accounts (excluding current)
const otherAccounts = computed(
  () =>
    accounts.value?.filter(
      (account) => account.account_id !== currentAccountId.value
    ) || []
)
</script>

<template>
  <div
    v-if="!pending && accounts && accounts.length > 0"
    class="flex items-center gap-2"
  >
    <!-- Current account selector -->
    <div class="relative">
      <button
        class="flex items-center gap-2 px-3 py-1 h-8 border-2 border-black"
        @click="isOpen = !isOpen"
      >
        <span class="text-sm font-medium">
          {{ currentAccount?.name || "Select Account" }}
        </span>
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Dropdown -->
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-1 w-64 bg-white border-2 border-black shadow-lg z-50"
        @click.stop
      >
        <!-- Current account -->
        <div v-if="currentAccount" class="p-3 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-sm">{{ currentAccount.name }}</p>
              <p class="text-xs text-gray-500">
                {{ currentAccount.account_role }}
              </p>
            </div>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
              >Current</span
            >
          </div>
        </div>

        <!-- Other accounts -->
        <div v-if="otherAccounts.length > 0" class="py-1">
          <div
            v-for="account in otherAccounts"
            :key="account.account_id"
            class="px-3 py-2 hover:bg-gray-50 cursor-pointer"
            @click="navigateTo(`/${account.account_id}`)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">{{ account.name }}</p>
                <p class="text-xs text-gray-500">{{ account.account_role }}</p>
              </div>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Manage accounts link -->
        <div class="border-t border-gray-100">
          <NuxtLink
            to="/"
            class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="isOpen = false"
          >
            Manage Accounts
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Overlay to close dropdown -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isOpen: false,
    }
  },
}
</script>
