<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useProductStore } from "@/store/ProductStore";

const productStore = useProductStore();

onMounted(() => {
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

    </section>
    <hr>
    <section class="data-section">

    </section>
  </div>
</template>

<style scoped>

</style>