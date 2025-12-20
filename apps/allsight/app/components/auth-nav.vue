<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <nav>
    <div v-if="user">
      <span>{{ user.email }}</span>
      <SignoutLink />
    </div>

    <div v-else>
      <NuxtLink to="/signin-password">Sign in</NuxtLink>
    </div>
  </nav>
</template>
