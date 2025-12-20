<script setup lang="ts">
type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()

const form = reactive({
  email: ""
})

const state = ref<State>({ type: "idle" })

const requestResetPassword = async () => {
  state.value = { type: "loading" }

  const { error } = await supabase.auth.resetPasswordForEmail(
    form.email,
    {
      redirectTo: "http://localhost:3000/password/update",
    }
  )

  if (error) {
    state.value = { type: "error", error: error.message }
    console.error(error)
  } else {
    state.value = { type: "success" }
  }
}
</script>

<template>
  <div>
    <h1>Reset Password</h1>

    <div v-if="state.type === 'success'">
      <p>✉️ Check your email! We've sent you a password reset link.</p>
      <p>
        <NuxtLink to="/signin-password">Back to sign in</NuxtLink>
      </p>
    </div>

    <form v-else @submit.prevent="requestResetPassword">
      <div>
        <label for="email">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          :disabled="state.type === 'loading'"
        />
      </div>

      <div v-if="state.type === 'error'" style="color: red">
        {{ state.error }}
      </div>

      <button type="submit" :disabled="state.type === 'loading'">
        {{ state.type === "loading" ? "Sending..." : "Reset Password" }}
      </button>

      <p>
        <NuxtLink to="/signin-password">Back to sign in</NuxtLink>
      </p>
    </form>
  </div>
</template>
