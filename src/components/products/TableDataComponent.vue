<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useProductStore  } from "@/store/ProductStore";

const productStore = useProductStore();
const currentState = productStore.productUiState
const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})

const handleEdit = async (id: string) => {
  currentState.success = false;
  const product = await productStore.productById(id)
  if (product) {
    currentState.idProduct = product.idProduct
    currentState.nameProduct = product.nameProduct
    currentState.stock = product.stock.toString()
    currentState.descriptionProduct = product.descriptionProduct ?? ''
    currentState.priceProduct = product.priceProduct.toString()
    currentState.idCategory = product.idCategory
  }
}

const handleDelete = async (id: string) => {
  currentState.success = false;
  const product = await productStore.deleteProduct(id)

}
</script>

<template>

</template>

<style scoped>

</style>