<script setup>
import Menu from 'primevue/menu';
import { computed } from "vue";
import { useRouter } from "vue-router";
import { NAVIGATE_MENU } from "@/constants/NavigateMenus.ts";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const router = useRouter();

const menuItems = computed(() => [
  {
    label: t("menu.home"),
    items: [
      {
        label: t("menu.home"),
        icon: 'pi pi-home',
        command: () => router.push(NAVIGATE_MENU.HOME)
      }
    ]
  },
  {
    label: t("menu.management"),
    items: [
      {
        label: t("menu.categories"),
        icon: "pi pi-tags",
        command: () => router.push(NAVIGATE_MENU.CATEGORIES)
      },
      {
        label: t("menu.clients"),
        icon: "pi pi-users",
        command: () => router.push(NAVIGATE_MENU.CLIENTS)
      },
      {
        label: t("menu.products"),
        icon: "pi pi-box",
        command: () => router.push(NAVIGATE_MENU.PRODUCTS)
      },
      {
        label: t("menu.suppliers"),
        icon: "pi pi-truck",
        command: () => router.push(NAVIGATE_MENU.SUPPLIERS)
      }
    ]
  },
  {
    items: [
      {
        label: t("menu.logOut"),
        icon: "pi pi-sign-out",
        class: "logout-item"
      }
    ]
  }
])
/*const items = ref([
  { label: 'Dashboard', items: [
      { label: 'Inicio', icon: 'pi pi-home' },
      { label: 'Reportes', icon: 'pi pi-chart-bar' }
    ]},
  { label: 'Configuración', items: [
      { label: 'Ajustes', icon: 'pi pi-cog' }
    ]}
]);*/
</script>

<template>
  <div class="sidebar">
    <Menu :model="menuItems" class="w-full border-none h-full" />
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  flex-shrink: 0;
  /* Eliminamos cualquier padding para que el menú toque los bordes */
  padding: 0;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
}

/* Apuntamos al componente interno de PrimeVue */
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
  height: 100% !important; /* Fundamental para que el flex funcione */
  margin: 0;
  padding: 0;
}

/* 2. Seleccionamos el último grupo (Perfil) y lo empujamos al fondo */
/* El selector :has() es ideal aquí para mover el header y sus hijos */
:deep(.p-menuitem:has([aria-label="Cerrar Session"])),
:deep(.p-submenu-header:last-of-type) {
  margin-top: auto !important;
}

/* 3. Ajuste fino: si el "Cerrar Session" es el último li,
   aseguramos que no tenga margen inferior */
:deep(.p-menuitem:last-child) {
  margin-top: 0;
}

:deep(.logout-item) {
  margin-top: auto !important;
}
</style>