<script setup lang="ts">
type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; accountId: string }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
  name: "",
  slug: "",
})

const state = ref<State>({ type: "idle" })

const createAccount = async () => {
  state.value = { type: "loading" }

  try {
    const { data, error } = await supabase.rpc("create_account", {
      name: form.name.trim(),
      slug: form.slug.trim(),
    })

    if (error) {
      state.value = { type: "error", error: error.message }
      console.error("Account creation error:", error)
    } else {
      // Extract account ID from response - handle both object and direct string returns
      const accountId =
        typeof data === "object" && data !== null
          ? data.account_id || data.id || data.slug
          : data

      if (!accountId) {
        state.value = {
          type: "error",
          error: "Account created but no ID returned",
        }
        console.error("No account ID found in response:", data)
        return
      }

      state.value = { type: "success", accountId }
      // Refresh all data to update AccountSelector and other components
      await refreshNuxtData()
      // Redirect to the new account immediately
      router.push(`/${accountId}`)
    }
  } catch (err) {
    state.value = { type: "error", error: "An unexpected error occurred" }
    console.error("Unexpected error:", err)
  }
}

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && form.slug.trim().length > 0
})

// Auto-generate slug from name
watch(
  () => form.name,
  (newName) => {
    if (
      !form.slug ||
      form.slug ===
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
    ) {
      form.slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    }
  }
)
</script>

<template>
  <div>
    <h1>Create New Account</h1>

    <div v-if="state.type === 'success'">
      <p>✅ Account created successfully! Redirecting to your new space...</p>
      <p>Account ID: {{ state.accountId }}</p>
    </div>

    <form v-else @submit.prevent="createAccount">
      <div>
        <label for="name">Account Name</label>
        <Input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="My Team"
          :disabled="state.type === 'loading'"
          required
        />
        <small>The display name for your account</small>
      </div>

      <div>
        <label for="slug">Account Slug</label>
        <Input
          id="slug"
          v-model="form.slug"
          type="text"
          placeholder="my-team"
          :disabled="state.type === 'loading'"
          pattern="[a-z0-9-]+"
          required
        />
        <small
          >URL-friendly identifier (lowercase, numbers, hyphens only)</small
        >
      </div>

      <div v-if="state.type === 'error'" class="error-message">
        {{ state.error }}
      </div>

      <Button type="submit" :disabled="state.type === 'loading'">
        {{
          state.type === "loading" ? "Creating Account..." : "Create Account"
        }}
      </Button>

      <p>
        <NuxtLink to="/">Cancel</NuxtLink>
      </p>
    </form>
  </div>
</template>
