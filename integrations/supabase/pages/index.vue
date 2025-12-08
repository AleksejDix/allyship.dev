<template>
  <div class="container">
    <header>
      <h1>AllyShip for Supabase</h1>
      <p>Security scanning for your Supabase projects</p>
    </header>

    <main>
      <section v-if="!isConnected">
        <h2>Get Started</h2>
        <p>Connect your Supabase account to start scanning your projects for security issues.</p>
        <button @click="connectSupabase" class="connect-btn">
          Connect Supabase
        </button>
      </section>

      <section v-else>
        <h2>Your Projects</h2>
        <p>Scanning {{ projectCount }} projects...</p>
        <!-- Dashboard will go here -->
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const isConnected = ref(false)
const projectCount = ref(0)

const connectSupabase = () => {
  // Redirect to OAuth flow
  window.location.href = '/api/auth/login'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.connect-btn {
  background: #3ECF8E;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.connect-btn:hover {
  background: #2fb574;
}
</style>
