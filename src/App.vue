<script setup>
import DrawerMenu from "@/components/DrawerMenu.vue";
</script>

<template>

  <div class="layout-wrapper">
    <DrawerMenu />
    <div class="main-layout">
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>

</template>

<style>
/* Estilos globales */
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  /* Usamos variables de texto y fondo globales de PrimeVue */
  background-color: var(--p-content-background);
  color: var(--p-text-color);
}

.layout-wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: stretch;
}

.main-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100vh;
  /* CAMBIO: Usamos surface-950 para un fondo negro profundo profesional en dark */
  background-color: var(--p-surface-100);
  transition: background-color 0.3s ease;
}

.top-nav {
  height: 60px;
  padding: 0 1.5rem;
  /* CAMBIO: De #ffffff a fondo de contenido del tema */
  background: var(--p-content-background);
  display: flex;
  align-items: center;
  gap: 20px;
  /* CAMBIO: Borde variable */
  border-bottom: 1px solid var(--p-content-border-color);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  /* Aseguramos que no haya fondos blancos heredados */
  background-color: transparent;
}

/* Estilo para los links activos usando tu color primario del MyPreset */
.router-link-active {
  color: var(--p-primary-500);
  font-weight: bold;
}
</style>