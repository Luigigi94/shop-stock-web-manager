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
/* Estilos globales para asegurar que no haya scrolls fantasmas */
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Evita scroll en el body, lo manejamos internamente */
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
  background-color: #f9fafb; /* Un gris muy ligero para contrastar con el blanco */
}

.top-nav {
  height: 60px; /* Altura fija para el nav para mejor control */
  padding: 0 1.5rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.main-content {
  flex: 1;
  overflow-y: auto; /* El scroll ocurre solo aquí */
  padding: 2rem;
}

/* Estilo para los links activos (opcional pero recomendado) */
.router-link-active {
  color: var(--primary-color, #3b82f6);
  font-weight: bold;
}
/*.sidebar {
  width: 260px;
  height: 100vh;
  flex-shrink: 0;
}*/
</style>
