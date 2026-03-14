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
<!--  <div class="container">
    <h1>{{ t("viewsGeneric.list", {entity: t("entityName.product")}) }}</h1>-->
    <Dialog
        v-model:visible="productStore.productUiState.isModalVisible"
        modal
    >
      <section>
        <FormComponent />
      </section>
    </Dialog>
<!--    <hr>
    <hr>-->
    <section>
      <TableDataComponent :datos="productStore.productsWithCategoryName" />
    </section>
<!--  </div>-->
</template>


<style scoped>

</style>