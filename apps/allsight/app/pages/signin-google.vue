<script setup lang="ts">
type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const state = ref<State>({ type: "idle" })

const signInWithGoogle = async () => {
  state.value = { type: "loading" }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  })

  if (error) {
    state.value = { type: "error", error: error.message }
    console.error(error)
  }
  // Note: User will be redirected to Google, no success state needed
}
</script>

<template>
  <div>
    <h1>Sign In with Google</h1>

    <div>
      <p>Click the button below to sign in with your Google account.</p>

      <div v-if="state.type === 'error'" style="color: red">
        {{ state.error }}
      </div>

      <button
        @click="signInWithGoogle"
        :disabled="state.type === 'loading'"
      >
        {{ state.type === "loading" ? "Redirecting to Google..." : "Continue with Google" }}
      </button>

      <p>
        <NuxtLink to="/signin-password">Sign in with password instead</NuxtLink>
      </p>

      <p>
        <NuxtLink to="/signin-otp">Sign in with magic link instead</NuxtLink>
      </p>
    </div>
  </div>
</template>
