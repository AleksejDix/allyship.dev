<template>
  <div class="text-sm">
    <header class="container mx-auto flex p-4 gap-2">
      <NuxtLink to="/">
        <div class="bg-black size-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-green-400"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </NuxtLink>
      <AccountSelector />
      <AuthNav class="ml-auto" />
    </header>
    <slot />
  </div>
</template>
