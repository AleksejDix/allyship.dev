<script setup lang="ts">
type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const router = useRouter()
const user = useSupabaseUser()

const form = reactive({
  fullName: user.value?.user_metadata?.full_name || "",
  avatarUrl: user.value?.user_metadata?.avatar_url || "",
})

const state = ref<State>({ type: "idle" })

const updateProfile = async () => {
  state.value = { type: "loading" }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: form.fullName,
      avatar_url: form.avatarUrl,
    },
  })

  if (error) {
    state.value = { type: "error", error: error.message }
    console.error(error)
  } else {
    state.value = { type: "success" }
    setTimeout(() => {
      router.push("/account")
    }, 1500)
  }
}
</script>

<template>
  <div>
    <h1>Edit Profile</h1>

    <div v-if="state.type === 'success'">
      <p>✅ Profile updated successfully! Redirecting...</p>
    </div>

    <form v-else @submit.prevent="updateProfile">
      <div>
        <label for="fullName">Full Name</label>
        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          placeholder="John Doe"
          :disabled="state.type === 'loading'"
        />
      </div>

      <div>
        <label for="avatarUrl">Avatar URL</label>
        <input
          id="avatarUrl"
          v-model="form.avatarUrl"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          :disabled="state.type === 'loading'"
        />
      </div>

      <div v-if="state.type === 'error'" class="error-message">
        {{ state.error }}
      </div>

      <button type="submit" :disabled="state.type === 'loading'">
        {{ state.type === "loading" ? "Updating..." : "Update Profile" }}
      </button>

      <p>
        <NuxtLink to="/account">Cancel</NuxtLink>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
