<script setup lang="ts">
type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const router = useRouter()
const state = ref<State>({ type: "idle" })

const signOut = async () => {
  state.value = { type: "loading" }

  const { error } = await supabase.auth.signOut()

  if (error) {
    state.value = { type: "error", error: error.message }
    console.error(error)
  } else {
    // Successfully signed out, redirect to signin
    router.push("/signin-password")
  }
}

// Auto sign out when page loads
onMounted(() => {
  signOut()
})
</script>

<template>
  <div>
    <h1>Signing Out</h1>

    <div v-if="state.type === 'loading'">
      <p>Please wait while we sign you out...</p>
    </div>

    <div v-else-if="state.type === 'error'">
      <p style="color: red">{{ state.error }}</p>
      <button @click="signOut">Try again</button>
      <p>
        <NuxtLink to="/">Go to home</NuxtLink>
      </p>
    </div>
  </div>
</template>
