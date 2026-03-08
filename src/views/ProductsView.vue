<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useProductStore } from "@/store/ProductStore";
import { useCategoryStore } from "@/store/CategoryStore";

import FormComponent from "@/components/products/FormComponent.vue";
import TableDataComponent from "@/components/products/TableDataComponent.vue";

const productStore = useProductStore();
const categoryStore = useCategoryStore();

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
    <section class="form-section">
      <FormComponent />
    </section>
    <hr>
    <section class="data-section">
      <TableDataComponent :datos="productStore.productsWithCategoryName" />
    </section>
  </div>
</template>

<style scoped>

</style>