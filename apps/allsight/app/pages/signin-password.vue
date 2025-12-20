<script setup lang="ts">
type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
  email: "",
  password: ""
})

const state = ref<State>({ type: "idle" })

const signInWithPassword = async () => {
  state.value = { type: "loading" }

  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })

  if (error) {
    state.value = { type: "error", error: error.message }
    console.error(error)
  } else {
    state.value = { type: "success" }
    // Redirect to home after successful login
    router.push("/")
  }
}
</script>

<template>
  <div>
    <h1>Sign In</h1>

    <form @submit.prevent="signInWithPassword">
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

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          :disabled="state.type === 'loading'"
        />
      </div>

      <div v-if="state.type === 'error'" style="color: red">
        {{ state.error }}
      </div>

      <button type="submit" :disabled="state.type === 'loading'">
        {{ state.type === "loading" ? "Signing in..." : "Sign In" }}
      </button>

      <p>
        <NuxtLink to="/password/forgot">Forgot password?</NuxtLink>
      </p>

      <p>
        <NuxtLink to="/signin-otp">Sign in with magic link instead</NuxtLink>
      </p>

      <p>
        <NuxtLink to="/signin-google">Sign in with Google instead</NuxtLink>
      </p>
    </form>
  </div>
</template>
