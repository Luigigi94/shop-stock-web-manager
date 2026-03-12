<script setup lang="ts">
import CartDrawer from "@/components/layout/CartDrawer.vue";
import { useCartStore } from "@/store/CartStore";
import { useProductStore } from "@/store/ProductStore";
import {useCategoryStore} from "@/store/CategoryStore";
import TableDataComponent from "@/components/newSale/TableDataComponent.vue";
import {onMounted, onUnmounted} from "vue";
import ListComponent from "@/components/newSale/ListComponent.vue";


const cartStore = useCartStore();
const cartState = cartStore.cartUiState

const productStore = useProductStore();
const categoryStore = useCategoryStore();

onMounted(() => {
  productStore.getAllProducts()
  categoryStore.getAllCategories()
})
onUnmounted(() => {
  productStore.clear()
})
</script>

<template>
  <div class="card">
    <div class="flex gap-2 justify-center">
      <Button icon="pi pi-arrow-left" @click="cartStore.openCart()">
        open modal
      </Button>
    </div>
  </div>
  <CartDrawer v-model:visible="cartState.isCartOpen" header="Right Drawer" position="right" />
  <div class="container">
    <h1>Productos Para Vender</h1>
  </div>
  <hr>
  <hr>
  <section class="data-section">
<!--    <TableDataComponent :datos="productStore.productsWithCategoryName" />-->
    <ListComponent :datos="productStore.productsWithCategoryName"/>
  </section>
</template>

<style scoped>

</style>