<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCategoryStore } from "@/store/CategoryStore";

const categoryStore = useCategoryStore();

const nameCategory = ref("");
const descCategory = ref("");

onMounted(() =>{
  categoryStore.getAllCategories()
})

onUnmounted(() => {
  categoryStore.clear()
})

const handleSave = async () => {
  await categoryStore.addCategory(nameCategory.value, descCategory.value)

  if (categoryStore.categoryUiState.success) {
    nameCategory.value = ""
    descCategory.value = ""
  }
}
</script>

<template>
  <div class="container">
    <h1>Lista de Categorías</h1>

    <section class="form-section">
      <input v-model="nameCategory" placeholder="Nombre de la Categoría" :disabled="categoryStore.categoryUiState.isLoading"/>
      <input v-model="descCategory" placeholder="Descripción" :disabled="categoryStore.categoryUiState.isLoading">

      <button @click="handleSave" :disabled="categoryStore.categoryUiState.isLoading" type="button">
        {{ categoryStore.categoryUiState.isLoading ? 'Guardando' : 'Agregar Categoría'}}
      </button>

      <p v-if="categoryStore.categoryUiState.errorMessage" class="error">
        {{ categoryStore.categoryUiState.errorMessage }}
      </p>
    </section>
    <hr>

    <section class="list-section">
      <div v-if="categoryStore.categoryUiState.isLoading && categoryStore.allCategories.length === 0">
        Cargando categorías
      </div>

      <ul v-else>
        <li v-for="cat in categoryStore.allCategories" :key="cat.idCategory">
          <strong>{{ cat.nameCategory }}</strong>
          <p>{{ cat.descriptionCategory }}</p>
        </li>
      </ul>
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