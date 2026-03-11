<script setup>
import Menu from 'primevue/menu';
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ToggleSwitch from 'primevue/toggleswitch';
import { SIDEBAR_CONFIG } from "@/constants/SIDEBAR_CONFIG.ts";

const { t, locale } = useI18n();
const router = useRouter();

const toggleLanguage = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es';
};

const menuItems = computed(() => {
  return Object.entries(SIDEBAR_CONFIG).map(([section, items]) => ({
    label: t(`menu.${section.toLowerCase()}`),
    items: items.map(item => ({
      label: t(item.label),
      icon: item.icon,
      visible: item.state,
      command: () => router.push(item.route)
    }))
  }));
});
</script>

<template>
  <div class="sidebar">
    <Menu :model="menuItems" class="w-full border-none h-full">
      <template #start>
        <div class="lang-wrapper">
          <span :class="{ 'active-lang': locale === 'es' }">ES</span>
          <ToggleSwitch
              :modelValue="locale === 'en'"
              @update:modelValue="toggleLanguage"
          />
          <span :class="{ 'active-lang': locale === 'en' }">EN</span>
        </div>
      </template>

      <template #item="{ item, props }">
        <a v-ripple class="flex items-center p-menuitem-link" v-bind="props.action">
          <span :class="[item.icon, 'mr-2']" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  flex-shrink: 0;
  padding: 0;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
}

:deep(.p-menu) {
  height: 100% !important;
  width: 100% !important;
  border: none;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

:deep(.p-menu-list) {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  margin: 0;
  padding: 0;
}

/* Empujamos el último bloque (Settings/Logout) al fondo */
:deep(.p-menu-item-content:has(.logout-item)),
:deep(.p-menu-list > .p-focus:last-child),
:deep(.p-menuitem:last-child) {
  margin-top: auto !important;
}

/* Estilo para los encabezados de grupo */
:deep(.p-submenu-header) {
  background: transparent;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.5rem 1rem 0.5rem 1rem;
}

.lang-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 10px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 10px;
}

.lang-wrapper span {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.lang-wrapper .active-lang {
  color: #3b82f6;
}

:deep(.p-toggleswitch) {
  transform: scale(0.8);
}
</style>