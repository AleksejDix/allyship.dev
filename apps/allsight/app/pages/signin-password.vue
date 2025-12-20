<script setup lang="ts">
import Input from "~/components/Input.vue"
import Link from "~/components/Link.vue"

type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
  email: "",
  password: "",
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
  <div class="mx-auto max-w-xs">
    <h1 class="text-2xl bold">Sign In</h1>

    <form
      @submit.prevent="signInWithPassword"
      :disabled="state.type === 'loading'"
      class="p-4 border-2 border-black bg-gray-100 space-y-2"
    >
      <div>
        <label for="email">Email address</label>
        <Input
          id="email"
          v-model="form.email"
          type="text"
          name="username"
          placeholder="your@account.com"
          required
        />
      </div>

      <div>
        <label for="password">Password</label>
        <Input
          id="password"
          v-model="form.password"
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <div v-if="state.type === 'error'" style="color: red">
        {{ state.error }}
      </div>

      <div class="pt-2 flex justify-between items-center">
        <Link>
          <NuxtLink to="/password/forgot">Forgot password?</NuxtLink>
        </Link>
        <Button
          class="w-1/2"
          type="submit"
          :disabled="state.type === 'loading'"
        >
          {{ state.type === "loading" ? "Signing in..." : "Sign In" }}
        </Button>
      </div>
    </form>
  </div>
</template>
