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

const resetPassword = async () => {
  state.value = { type: "loading" }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    form.email,
    {
      redirectTo: "http://localhost:3000/password/update",
    }
  )

  if (resetError) {
    state.value = { type: "error", error: resetError.message }
    console.error(resetError)
  } else {
    state.value = { type: "success" }
  }
}
</script>

<template>
  <div>
    <h1>Forgot Password</h1>

    <div v-if="state.type === 'success'">
      <p>✉️ Check your email! We've sent you a password reset link.</p>
      <p>
        <NuxtLink to="/signin-password">Back to sign in</NuxtLink>
      </p>
    </div>

    <form v-else @submit.prevent="resetPassword">
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
        {{ state.type === "loading" ? "Sending..." : "Send Reset Link" }}
      </button>

      <p>
        <NuxtLink to="/signin-password">Back to sign in</NuxtLink>
      </p>
    </form>
  </div>
</template>
