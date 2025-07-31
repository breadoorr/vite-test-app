<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
import { computed } from 'vue';

const notificationStore = useNotificationStore();

// Computed property to access notifications from the store
const notifications = computed(() => notificationStore.notifications);

// Function to remove a notification
const removeNotification = (id: number) => {
  notificationStore.removeNotification(id);
};
</script>

<template>
  <div class="notification-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <div class="notification-content">
          <span class="notification-message">{{ notification.message }}</span>
          <button class="close-button" @click="removeNotification(notification.id)">×</button>
        </div>
        <div class="notification-progress" :style="{ animationDuration: `${notification.timeout}ms` }"></div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
}

.notification {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.notification-content {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-message {
  font-size: 14px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin-left: 10px;
}

.close-button:hover {
  color: #666;
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  animation: progress-bar linear forwards;
}

@keyframes progress-bar {
  from { width: 100%; }
  to { width: 0%; }
}

/* Notification types */
.success {
  border-left: 4px solid #4CAF50;
}

.error {
  border-left: 4px solid #F44336;
}

.info {
  border-left: 4px solid #2196F3;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>