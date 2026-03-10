import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

const i18n = createI18n({
    legacy: false,
    locale: navigator.language.split('-')[0] || 'es', // Autodetecta el idioma del navegador
    fallbackLocale: 'en',
    messages: {
        es,
        en
    }
});

export default i18n;