<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Account, AccountType, AccountFormErrors } from '@/types/account';
import { useAccountStore } from '@/stores/accountStore';

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
}>();

const accountStore = useAccountStore();

// Local state
const localAccount = ref<Account>({ ...props.account });
const errors = ref<AccountFormErrors>({});
const labelsString = ref<string>(
  props.account.labels.map(label => label.text).join('; ')
);

// Computed properties
const showPassword = computed(() => localAccount.value.type === 'Локальная');
const isValid = computed(() => !errors.value.login && (!showPassword.value || !errors.value.password));

// Watch for changes in the account prop
watch(
  () => props.account,
  (newAccount) => {
    localAccount.value = { ...newAccount };
    labelsString.value = newAccount.labels.map(label => label.text).join('; ');
  }
);

// Methods
const validateLogin = () => {
  if (!localAccount.value.login.trim()) {
    errors.value.login = 'Логин обязателен';
    return false;
  } else if (localAccount.value.login.length > 100) {
    errors.value.login = 'Максимальная длина логина - 100 символов';
    return false;
  }
  errors.value.login = undefined;
  return true;
};

const validatePassword = () => {
  if (localAccount.value.type === 'Локальная') {
    if (!localAccount.value.password) {
      errors.value.password = 'Пароль обязателен';
      return false;
    } else if (localAccount.value.password.length > 100) {
      errors.value.password = 'Максимальная длина пароля - 100 символов';
      return false;
    }
  }
  errors.value.password = undefined;
  return true;
};

const validateLabels = () => {
  if (labelsString.value.length > 50) {
    return false;
  }
  return true;
};

const handleTypeChange = () => {
  if (localAccount.value.type === 'LDAP') {
    localAccount.value.password = null;
  } else {
    localAccount.value.password = '';
  }
  saveAccount();
};

const handleLabelsChange = () => {
  if (validateLabels()) {
    localAccount.value.labels = accountStore.parseLabels(labelsString.value);
    saveAccount();
  }
};

const handleLoginBlur = () => {
  if (validateLogin()) {
    saveAccount();
  }
};

const handlePasswordBlur = () => {
  if (validatePassword()) {
    saveAccount();
  }
};

const saveAccount = () => {
  if (isValid.value) {
    accountStore.updateAccount(localAccount.value);
  }
};

const deleteAccount = () => {
  emit('delete', props.account.id);
};
</script>

<template>
  <div class="account-item">
    <div class="account-fields">
      <div class="field">
        <label>Метка</label>
        <input
          v-model="labelsString"
          type="text"
          placeholder="Введите метки через ;"
          maxlength="50"
          @blur="handleLabelsChange"
        />
        <div class="hint">Необязательное поле. Максимум 50 символов. Метки вводятся через знак ;</div>
      </div>
      
      <div class="field">
        <label>Тип записи</label>
        <select v-model="localAccount.type" @change="handleTypeChange">
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>
      
      <div class="field">
        <label>Логин</label>
        <input
          v-model="localAccount.login"
          type="text"
          placeholder="Введите логин"
          maxlength="100"
          :class="{ 'error': errors.login }"
          @blur="handleLoginBlur"
        />
        <div v-if="errors.login" class="error-message">{{ errors.login }}</div>
      </div>
      
      <div v-if="showPassword" class="field">
        <label>Пароль</label>
        <input
          v-model="localAccount.password"
          type="password"
          placeholder="Введите пароль"
          maxlength="100"
          :class="{ 'error': errors.password }"
          @blur="handlePasswordBlur"
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>
    </div>
    
    <button class="delete-button" @click="deleteAccount">Удалить</button>
  </div>
</template>

<style scoped>
.account-item {
  display: flex;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px; /* Increased spacing between account items */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.account-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-fields {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Increased minimum width for better utilization of wider container */
  gap: 20px; /* Increased gap */
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
}

input, select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

input.error, select.error {
  border-color: #f44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 6px;
  font-weight: 500;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  line-height: 1.4;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  cursor: pointer;
  height: fit-content;
  margin-left: 20px;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  align-self: center;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.delete-button:active {
  transform: scale(0.98);
}
</style>