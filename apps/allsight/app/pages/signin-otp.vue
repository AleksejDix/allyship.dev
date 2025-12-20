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

const signInWithOtp = async () => {
  state.value = { type: "loading" }

  const { error: signInError } = await supabase.auth.signInWithOtp({
    email: form.email,
    options: {
      emailRedirectTo: "http://localhost:3000/confirm",
    },
  })

  if (signInError) {
    state.value = { type: "error", error: signInError.message }
    console.error(signInError)
  } else {
    state.value = { type: "success" }
  }
}
</script>
<template>
  <div>
    <h1>Sign In</h1>

    <div v-if="state.type === 'success'">
      <p>✉️ Check your email! We've sent you a magic link to sign in.</p>
    </div>

    <form v-else @submit.prevent="signInWithOtp">
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
        {{ state.type === "loading" ? "Sending..." : "Sign In with E-Mail" }}
      </button>

      <p>
        <NuxtLink to="/password/forgot">Forgot password?</NuxtLink>
      </p>

      <p>
        <NuxtLink to="/signin-password">Sign in with password instead</NuxtLink>
      </p>

      <p>
        <NuxtLink to="/signin-google">Sign in with Google instead</NuxtLink>
      </p>
    </form>
  </div>
</template>
