import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)
app.use(pinia)
app.mount('#app')
