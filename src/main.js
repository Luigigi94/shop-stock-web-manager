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

import { definePreset } from '@primevue/themes';

// Creamos un "Preset" basado en Aura pero con tus colores
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50:  '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6', // <--- TU MORADO PRINCIPAL
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065'
        },
        rounded: {
            medium: '8px'
        }
    }
});


// createApp(App).mount('#app')
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.use(Primevue,{
    theme: {
        preset: MyPreset, // Aquí aplicas el estilo
        options: {
            darkModeSelector: '.my-app-dark', // Opcional: para modo oscuro
        }
    }
})
app.mount('#app')