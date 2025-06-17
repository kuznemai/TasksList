// import './assets/main.css'
//
// import { createApp } from 'vue'
// import App from './App.vue'
//
// createApp(App).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'

createApp(App).use(store).mount('#app')