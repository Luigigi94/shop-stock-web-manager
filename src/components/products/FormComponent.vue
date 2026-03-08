<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";

import { useProductStore } from "@/store/ProductStore";
const productStore = useProductStore();
const stateProduct = productStore.productUiState;

import { useCategoryStore } from "@/store/CategoryStore";
const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState;

const handleByStateAction = async () => {
  if (stateProduct.isEdit){
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await productStore.updateProduct()

  if (stateProduct.success) {
    productStore.clearState()
  }
}

const handleSave = async () => {
  await productStore.addProduct()

  if (stateProduct.success) {
    productStore.clearState()
  }
}

const cancelUpdate = () => {
  productStore.clearState()
}
</script>

<template>
  <div class="flex flex-column gap-2">
    <label for="category">Categoría</label>

    <Select
        v-model="stateProduct.idCategory"
        :options="categoryStore.allCategories"
        optionLabel="nameCategory"
        optionValue="idCategory"
        placeholder="Selecciona una categoría"
        class="w-full md:w-14rem"
        :loading="categoryStore.categoryUiState.isLoading"
    />

    <small v-if="!productStore.productUiState.idCategory" class="p-error">
      La categoría es obligatoria.
    </small>
  </div>
</template>

<style scoped>

</style>