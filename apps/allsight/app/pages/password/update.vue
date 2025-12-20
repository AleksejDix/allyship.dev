<script setup lang="ts">
import Input from "~/components/Input.vue"

type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
  newPassword: "",
  confirmPassword: "",
})

const state = ref<State>({ type: "idle" })

const updateUserPassword = async () => {
  state.value = { type: "loading" }

  const { error: updateError } = await supabase.auth.updateUser({
    password: form.newPassword,
  })

  if (updateError) {
    state.value = { type: "error", error: updateError.message }
    console.error(updateError)
  } else {
    state.value = { type: "success" }
    // User is now logged in with new password, redirect to home
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }
}
</script>

<template>
  <div>
    <h1>Update Password</h1>

    <div v-if="state.type === 'success'">
      <p>✅ Password updated successfully! Redirecting to home...</p>
    </div>

    <form v-else @submit.prevent="updateUserPassword">
      <div>
        <label for="newPassword">New Password</label>
        <Input
          id="newPassword"
          v-model="form.newPassword"
          type="password"
          placeholder="Enter new password"
          required
          :disabled="state.type === 'loading'"
        />
      </div>

      <div>
        <label for="confirmPassword">Confirm Password</label>
        <Input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm new password"
          required
          :disabled="state.type === 'loading'"
        />
      </div>

      <div v-if="state.type === 'error'" style="color: red">
        {{ state.error }}
      </div>

      <button type="submit" :disabled="state.type === 'loading'">
        {{ state.type === "loading" ? "Updating..." : "Update Password" }}
      </button>
    </form>
  </div>
</template>
