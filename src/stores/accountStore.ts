import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Account, AccountType, LabelItem } from '../types/account';
import { v4 as uuidv4 } from 'uuid';

export const useAccountStore = defineStore('account', () => {
  // State
  const accounts = ref<Account[]>([]);

  // Getters
  const getAccounts = computed(() => accounts.value);

  // Actions
  function initializeStore() {
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts);
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(accounts.value));
  }

  function addAccount() {
    const newAccount: Account = {
      id: uuidv4(),
      labels: [],
      type: 'Локальная' as AccountType,
      login: '',
      password: '',
    };
    accounts.value.push(newAccount);
    saveToLocalStorage();
    return newAccount;
  }

  function updateAccount(updatedAccount: Account) {
    const index = accounts.value.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      accounts.value[index] = { ...updatedAccount };
      
      // If account type is LDAP, set password to null
      if (accounts.value[index].type === 'LDAP') {
        accounts.value[index].password = null;
      }
      
      saveToLocalStorage();
    }
  }

  function deleteAccount(id: string) {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
    saveToLocalStorage();
  }

  function parseLabels(labelsString: string): LabelItem[] {
    if (!labelsString.trim()) return [];
    
    return labelsString
      .split(';')
      .map(label => label.trim())
      .filter(label => label !== '')
      .map(label => ({ text: label }));
  }

  // Initialize store when created
  initializeStore();

  return {
    accounts,
    getAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    parseLabels
  };
});