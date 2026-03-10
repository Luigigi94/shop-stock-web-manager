<script setup lang="ts">
import {onMounted, onUnmounted, watch} from 'vue'
import { useProductStore } from "@/store/ProductStore";
import { useCategoryStore } from "@/store/CategoryStore";

import FormComponent from "@/components/products/FormComponent.vue";
import TableDataComponent from "@/components/products/TableDataComponent.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const productStore = useProductStore();
const stateProduct = productStore.productUiState
const categoryStore = useCategoryStore();

watch( () => stateProduct.success, (isSuccess) => {
  if(isSuccess) {
    productStore.clear()
  }
})

onMounted(() => {
  categoryStore.getAllCategories();
  productStore.getAllProducts()
})

onUnmounted(() => {
  productStore.clear()
})
</script>

<template>
  <div class="container">
    <h1>Lista de Productos</h1>
    <Button
        label="Nuevo producto"
        icon="pi pi-plus"
        @click="productStore.openNewProduct()"
        class="btn-new"
    />
    <Dialog
        v-model:visible="productStore.productUiState.isModalVisible"
        modal
        :header="stateProduct.isEdit ? 'Editar Categoría' : 'Nueva Categoría'"
    >
      <section class="form-section">
        <FormComponent />
      </section>
    </Dialog>
    <hr>
    <hr>
    <section class="data-section">
      <TableDataComponent :datos="productStore.productsWithCategoryName" />
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