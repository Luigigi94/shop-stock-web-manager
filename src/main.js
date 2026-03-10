// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from './router'
import Primevue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import 'primeicons/primeicons.css';
import '@/assets/formsStyles/formStyles.css'
import '@/assets/formsStyles/viewStyles.css'
import '@/assets/formsStyles/tableStyles.css'


// createApp(App).mount('#app')
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.use(Primevue,{
    theme: {
        preset: Aura, // Aquí aplicas el estilo
        options: {
            darkModeSelector: '.my-app-dark', // Opcional: para modo oscuro
        }
    }
})
app.mount('#app')