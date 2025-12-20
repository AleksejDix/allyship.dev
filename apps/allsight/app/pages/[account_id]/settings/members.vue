<template>
  <h1>Members</h1>
  <pre>
    {{ data }}
  </pre>
</template>

<script setup lang="ts">
const route = useRoute()
const accountId = route.params.account_id as string

// Fetch members data using account ID from route params
const { data, error, pending } = await useFetch(
  `/api/accounts/${accountId}/members`,
  {
    server: true,
    default: () => [],
    headers: useRequestHeaders(["cookie"]),
  }
)
</script>
