<script setup lang="ts"></script>

<template>
  <div>
    <h1>Account Settings</h1>

    <nav>
      <ul>
        <li><NuxtLink to="/account">Overview</NuxtLink></li>
        <li><NuxtLink to="/account/edit">Edit Profile</NuxtLink></li>
        <li><NuxtLink to="/password/update">Change Password</NuxtLink></li>
      </ul>
    </nav>

    <div class="account-content">
      <section>
        <h2>Account Information</h2>

        <dl class="account-details">
          <div class="detail-row">
            <dt>Email:</dt>
            <dd>{{ user.email }}</dd>
          </div>

          <div class="detail-row">
            <dt>User ID:</dt>
            <dd>{{ user.id }}</dd>
          </div>

          <div v-if="user.user_metadata" class="detail-row">
            <dt>Full Name:</dt>
            <dd>{{ user.user_metadata.full_name || "Not set" }}</dd>
          </div>

          <div v-if="user.user_metadata?.avatar_url" class="detail-row">
            <dt>Avatar:</dt>
            <dd>
              <img
                :src="user.user_metadata.avatar_url"
                alt="User avatar"
                width="100"
              />
            </dd>
          </div>

          <div class="detail-row">
            <dt>Provider:</dt>
            <dd>{{ user.app_metadata.provider || "email" }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <div v-if="!user">
      <p>Please sign in to access account settings.</p>
      <NuxtLink to="/signin-password">Sign in</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0;
}

nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: inline-block;
}

nav a:hover,
nav a.router-link-active {
  background-color: #f5f5f5;
}

.account-content {
  margin-top: 2rem;
}

.account-details {
  display: grid;
  gap: 1rem;
}

.detail-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.detail-row dt {
  font-weight: bold;
  min-width: 120px;
  flex-shrink: 0;
}

.detail-row dd {
  margin: 0;
  word-break: break-word;
}

.detail-row img {
  max-width: 100px;
  height: auto;
}
</style>
