<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import {useCartStore} from "@/store/CartStore";
import {useI18n} from "vue-i18n";
import Button from "primevue/button";
import {ref} from "vue";

const cartStore = useCartStore();
const currentState = cartStore.cartUiState

const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})
const {t} = useI18n();
</script>

<template>
  <div class="inventory-container">
    <div class="inventory-card">
      <div class="header-section">
        <div class="title-wrapper">
          <i class="pi pi-tags icon-magenta"></i>
          <h2>Ventas</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>