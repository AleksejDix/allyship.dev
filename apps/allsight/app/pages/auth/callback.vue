<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  // Nuxt Supabase module handles the OAuth callback automatically
  // We just need to check if the user is authenticated and redirect
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Successfully authenticated, redirect to home
    router.push("/")
  } else {
    // Something went wrong, redirect to signin
    router.push("/signin-google")
  }
})
</script>

<template>
  <div>
    <h1>Completing sign in...</h1>
    <p>Please wait while we sign you in.</p>
  </div>
</template>
