<script setup lang="ts">
import { useSupplierPurchaseStore } from "@/store/SupplierPurchaseStore";
import {useProductStore} from "@/store/ProductStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {onMounted, onUnmounted} from "vue";

const supplierPurchaseStore = useSupplierPurchaseStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

onMounted(() => {
  productStore.getAllProducts()
  categoryStore.getAllCategories()
  supplierPurchaseStore.getAllSupplierPurchases()
})

onUnmounted(() => {
  productStore.clear()
  categoryStore.clear()
  supplierPurchaseStore.clear()
})
</script>

<template>

</template>

<style scoped>

</style>