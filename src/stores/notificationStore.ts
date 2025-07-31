import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timeout?: number;
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([]);
  let nextId = 0;

  // Actions
  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = nextId++;
    const newNotification = {
      id,
      ...notification,
      timeout: notification.timeout || 3000, // Default timeout of 3 seconds
    };
    
    notifications.value.push(newNotification);
    
    // Automatically remove notification after timeout
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.timeout);
    
    return id;
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  return {
    notifications,
    addNotification,
    removeNotification
  };
});