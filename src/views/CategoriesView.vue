<script setup lang="ts">
import {onMounted, onUnmounted, watch} from 'vue'
import {useCategoryStore} from "@/store/CategoryStore";
import TableDataComponent from "@/components/categories/TableDataComponent.vue";
import FormComponent from "@/components/categories/FormComponent.vue";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState

watch(() => stateCategory.success, (isSuccess) => {
  if (isSuccess) {
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
        @click="categoryStore.openNewCategory()"
        class="btn-new"
    />
    <Dialog
        v-model:visible="categoryStore.categoryUiState.isModalVisible"
        modal
        :header="stateCategory.isEdit ? 'Editar Categoría' : 'Nueva Categoría'"
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
button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>
<!--
<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 3rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
  background: #fdfdfd;
  border-radius: 8px;
  border: 1px solid #eee;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #d946ef;
  outline: none;
}

button {
  padding: 12px;
  background: #8b5cf6;
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

</style>-->
