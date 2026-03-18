<script setup lang="ts">
import CartDrawer from "@/components/layout/CartDrawer.vue";
import { useCartStore } from "@/store/CartStore";
import { useProductStore } from "@/store/ProductStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {Button} from "primevue";
import {Badge} from "primevue";
import {onMounted, onUnmounted} from "vue";
import ListComponent from "@/components/newSale/ListComponent.vue";


const cartStore = useCartStore();
const cartState = cartStore.cartUiState

const productStore = useProductStore();
const categoryStore = useCategoryStore();

onMounted(() => {
  productStore.getAllProducts()
  categoryStore.getAllCategories()
  cartStore.getAllCartProducts()
})
onUnmounted(() => {
  productStore.clear()
})

</script>

<template>
  <CartDrawer v-model:visible="cartStore.cartUiState.isCartOpen" position="right" :datos="cartStore.allCartProducts" class="w-full md:w-112.5 lg:w-137.5" :style="{ width: '30rem' }"/>
  <section class="p-4">
    <ListComponent :datos="productStore.productsWithCategoryName"/>
  </section>
  <Button
      v-if="cartStore.allCartProducts.length > 0"
      rounded
      raised
      severity="primary"
      @click="cartStore.cartUiState.isCartOpen = true"
  class="fixed z-5 w-12 h-12 shadow-4 p-0"
  style="right: 2rem; bottom: 2rem; position: fixed !important;"
  >
  <div class="relative flex items-center justify-center w-full h-full">
    <i class="pi pi-shopping-cart" style="font-size: 1.2rem"></i>

    <Badge
      v-if="cartStore.allCartProducts.length > 0"
      :value="cartStore.allCartProducts.length"
      severity="danger"
      class="absolute top-0 right-0 transform translate-x-1 -translate-y-1 border border-white w-4 h-4 flex items-center justify-center text-[8px] font-bold"
    />
  </div>
  </Button>
</template>

<style scoped>

</style>