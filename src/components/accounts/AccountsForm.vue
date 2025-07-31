<script setup lang="ts">
import { onMounted } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import { useNotificationStore } from '@/stores/notificationStore';
import AccountItem from './AccountItem.vue';

const accountStore = useAccountStore();
const notificationStore = useNotificationStore();

// Initialize the store when the component is mounted
onMounted(() => {
  // The store is already initialized in its definition
  // This is just a placeholder in case we need to do something on mount
});

const addAccount = () => {
  const newAccount = accountStore.addAccount();
  
  // Show a success notification when a new account is created
  notificationStore.addNotification({
    message: 'Новая учетная запись успешно создана',
    type: 'success',
    timeout: 3000
  });
};

const deleteAccount = (id: string) => {
  accountStore.deleteAccount(id);
};
</script>

<template>
  <div class="accounts-form">
    <div class="header">
      <h1>Управление учетными записями</h1>
      <button class="add-button" @click="addAccount">+</button>
    </div>
    
    <div v-if="accountStore.accounts.length > 0" class="accounts-list">
      <AccountItem
        v-for="account in accountStore.accounts"
        :key="account.id"
        :account="account"
        @delete="deleteAccount"
      />
    </div>
    
    <div v-else class="no-accounts">
      <p>Нет учетных записей. Нажмите "+" чтобы добавить новую запись.</p>
    </div>
  </div>
</template>

<style scoped>
.accounts-form {
  width: 100%;
  min-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

h1 {
  margin: 0;
  font-size: 24px;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
}

.add-button:hover {
  background-color: #45a049;
}

.accounts-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 70vh; /* Set maximum height to 70% of viewport height */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Hide horizontal scrollbar */
  padding: 20px; /* Add padding inside the container */
  width: 100%; /* Ensure it takes full width */
  box-sizing: border-box; /* Include padding in width calculation */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Add subtle shadow for depth */
}

/* Remove margin from the last account item */
.accounts-list > :last-child {
  margin-bottom: 0;
}

.account-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 60px;
  background-color: #f5f5f5;
  padding: 10px 16px;
  font-weight: bold;
}

.no-accounts {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

@media (max-width: 768px) {
  .account-labels {
    display: none;
  }
}
</style>