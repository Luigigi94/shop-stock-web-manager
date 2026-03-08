<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue'
import { useCategoryStore } from "@/store/CategoryStore";
import TableDataComponent from "@/components/categories/TableDataComponent.vue";
import FormComponent from "@/components/categories/FormComponent.vue";
import Dialog from 'primevue/dialog';

const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState
const visibleDialog = ref(false);

const openModal = () => {
  visibleDialog.value = true;
};

watch(() => stateCategory.success, (isSuccess) => {
  if (isSuccess) {
    visibleDialog.value = false;
    categoryStore.clearForm();
  }
});

onMounted(() =>{
  categoryStore.getAllCategories()
})

onUnmounted(() => {
  categoryStore.clear()
})
</script>

<template>
  <div class="container">
    <h1>Lista de Categorías</h1>
    <Button
        label="Nueva Categoría"
        icon="pi pi-plus"
        @click="openModal"
        class="btn-new"
    />
    <Dialog
        v-model:visible="visibleDialog"
        modal
        :header="stateCategory.isEdit ? 'Editar Categoría' : 'Nueva Categoría'"
        :style="{ width: '30vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <section class="form-section">
        <FormComponent/>
      </section>
    </Dialog>
    <hr>

    <hr>
    <section class="data-section">
      <TableDataComponent :datos="categoryStore.allCategories"/>
    </section>
  </div>
</template>

<style scoped>
/* Contenedor principal: ahora ocupa casi toda la pantalla */
.inventory-view {
  max-width: 1200px; /* O usa 95% si quieres más ancho */
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', sans-serif; /* O la que uses */
}

/* El formulario: lo mantenemos centrado y no tan ancho */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 3rem;
  max-width: 500px; /* El formulario no necesita ser gigante */
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
  background: #fdfdfd;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* La sección de la tabla: ¡Aquí es donde liberamos el espacio! */
.table-section {
  width: 100%;
  margin-top: 2rem;
}

/* Estilos de inputs para que se vean mejor con PrimeVue */
input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #d946ef; /* Magenta al foco */
  outline: none;
}

button {
  padding: 12px;
  background: #8b5cf6; /* Morado para combinar con la tabla */
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #7c3aed;
}

button:disabled {
  background: #ccc;
}

.error { color: #ef4444; font-size: 0.9rem; margin-top: -10px; }
</style>