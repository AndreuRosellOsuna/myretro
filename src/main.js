/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

app.directive('hidden', (el, binding) => {
  // this will be called for both `mounted` and `updated`
  if(binding.value === true) {
    el.style.visibility = "hidden"
  } else {
    el.style.visibility = "visible"
  }
})

app.mount('#app')
