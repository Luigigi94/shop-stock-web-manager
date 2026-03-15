<script setup lang="ts">
import {onMounted, onUnmounted, watch} from 'vue'
import { useProductStore } from "@/store/ProductStore";
import { useCategoryStore } from "@/store/CategoryStore";
import {useI18n} from "vue-i18n";

import FormComponent from "@/components/products/FormComponent.vue";
import TableDataComponent from "@/components/products/TableDataComponent.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const productStore = useProductStore();
const stateProduct = productStore.productUiState
const categoryStore = useCategoryStore();
const {t} = useI18n();

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
    <Dialog v-model:visible="productStore.productUiState.isModalVisible" :style="{ width: '450px' }" header="Product Details" :modal="true">
      <section>
        <FormComponent />
      </section>
    </Dialog>
    <section>
      <TableDataComponent :datos="productStore.productsWithCategoryName" />
    </section>
</template>


<style scoped>

</style>