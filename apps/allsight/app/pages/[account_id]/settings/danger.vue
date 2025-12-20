<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const accountId = Array.isArray(route.params.account_id)
  ? route.params.account_id[0]
  : (route.params.account_id as string)

// State for delete confirmation
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref("")
const isDeleting = ref(false)

// Delete account function
const deleteAccount = async () => {
  if (deleteConfirmText.value !== "DELETE") {
    return
  }

  isDeleting.value = true

  try {
    const response = await $fetch(`/api/accounts/${accountId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Redirect to homepage after successful deletion
    await router.push("/")
  } catch (error) {
    console.error("Failed to delete account:", error)
    alert("Failed to delete account. Please try again.")
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
    deleteConfirmText.value = ""
  }
}

// Cancel delete function
const cancelDelete = () => {
  showDeleteConfirm.value = false
  deleteConfirmText.value = ""
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Danger Zone</h1>

    <div class="bg-white rounded-lg border border-red-200 p-6">
      <h2 class="text-lg font-semibold text-red-900 mb-4">Delete Account</h2>
      <p class="text-sm text-gray-600 mb-4">
        Once you delete this account, there is no going back. This will
        permanently delete the account and remove all associated data.
      </p>

      <button
        @click="showDeleteConfirm = true"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
      >
        Delete Account
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Delete Account</h3>
        <p class="text-sm text-gray-600 mb-4">
          This action cannot be undone. This will permanently delete the account
          <strong>{{ accountId }}</strong> and all associated data.
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Type
            <span class="font-mono bg-gray-100 px-1 rounded">DELETE</span> to
            confirm
          </label>
          <input
            v-model="deleteConfirmText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="DELETE"
          />
        </div>

        <div class="flex space-x-3">
          <button
            @click="cancelDelete"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteAccount"
            :disabled="deleteConfirmText !== 'DELETE' || isDeleting"
            class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium transition-colors"
          >
            {{ isDeleting ? "Deleting..." : "Delete Account" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
