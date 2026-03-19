<script setup lang="ts">
import { useSupplierPurchaseStore } from "@/store/SupplierPurchaseStore";
import {useProductStore} from "@/store/ProductStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {useSupplierCartStore} from "@/store/SupplierCartStore";
import TableComponent from "@/components/supplierPurchase/TableComponent.vue";
import {onMounted, onUnmounted} from "vue";
import FormComponent from "@/components/supplierPurchase/FormComponent.vue";
import Dialog from "primevue/dialog";
import {useSupplierStore} from "@/store/SupplierStore";

const supplierPurchaseStore = useSupplierPurchaseStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const supplierCartStore = useSupplierCartStore();
const supplierStore = useSupplierStore();

onMounted(() => {
  productStore.getAllProducts()
  categoryStore.getAllCategories()
  supplierPurchaseStore.getAllSupplierPurchases()
  supplierCartStore.observeSupplierCart()
  supplierStore.getAllSuppliers()
})

onUnmounted(() => {
  productStore.clear()
  categoryStore.clear()
  supplierStore.clear()
})
</script>

<template>
  <Dialog v-model:visible="supplierCartStore.state.isCartOpen" :style="{ width: '450px' }">
    <section>
      <FormComponent :productsCatalog="productStore.productsWithCategoryName" :suppliersCatalog="supplierStore.allSuppliers" />
    </section>
  </Dialog>
  <div class="card">
    <div v-if="supplierCartStore.state.items.length > 0" class="font-semibold text-xl mb-4">Accordion</div>
    <TableComponent :datos="supplierPurchaseStore.purchasesGroupedBySupplier" />
  </div>
</template>

<style scoped>

</style>