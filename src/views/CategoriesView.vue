<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCategoryStore } from "@/store/CategoryStore";
import TableDataComponent from "@/components/categories/TableDataComponent.vue";
import FormComponent from "@/components/categories/FormComponent.vue";

const categoryStore = useCategoryStore();

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

    <section class="form-section">
      <FormComponent/>
    </section>
    <hr>

    <hr>
    <section class="data-section">
      <TableDataComponent :datos="categoryStore.allCategories"/>
    </section>
  </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 2rem auto; font-family: sans-serif; }
.form-section { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px; background: #42b883; color: white; border: none; cursor: pointer; }
button:disabled { background: #ccc; }
.error { color: red; font-size: 0.9rem; }
</style>