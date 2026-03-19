<script setup lang="ts">
import { useSupplierPurchaseStore } from "@/store/SupplierPurchaseStore";
import {useProductStore} from "@/store/ProductStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {useSupplierCartStore} from "@/store/SupplierCartStore";
import TableComponent from "@/components/supplierPurchase/TableComponent.vue";
import {onMounted, onUnmounted} from "vue";

const supplierPurchaseStore = useSupplierPurchaseStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const supplierCartStore = useSupplierCartStore();

onMounted(() => {
  productStore.getAllProducts()
  categoryStore.getAllCategories()
  supplierPurchaseStore.getAllSupplierPurchases()
  supplierCartStore.observeSupplierCart()
})

onUnmounted(() => {
  productStore.clear()
  categoryStore.clear()
})
</script>

<template>
  <div class="card">
    <TableComponent :datos="supplierPurchaseStore.purchasesGroupedBySupplier" />

  </div>
</template>

<style scoped>

</style>