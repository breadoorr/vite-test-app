<script setup lang="ts">
import AccountsForm from './components/accounts/AccountsForm.vue'
import NotificationList from './components/notifications/NotificationList.vue'
</script>

<template>
  <div class="app">
    <AccountsForm />
    <NotificationList />
  </div>
</template>

<style>
.app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  min-width: 90vw;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>
