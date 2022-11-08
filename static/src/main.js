import { createApp } from 'vue'
import VueClipboard from 'vue-clipboard2'
import water from './water.vue'

createApp(water).use(VueClipboard).mount('#app')