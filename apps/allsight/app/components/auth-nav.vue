<script setup lang="ts">
import Button from "./Button.vue"

const user = useSupabaseUser()
</script>

<template>
  <nav>
    <div v-if="user">
      <NuxtLink to="/account">{{ user.email }}</NuxtLink>
      <Button asChild>
        <signout-link />
      </Button>
    </div>

    <div v-else>
      <Button asChild>
        <NuxtLink to="/signin-password">Sign in</NuxtLink>
      </Button>
    </div>
  </nav>
</template>
