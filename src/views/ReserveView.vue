<script setup lang="ts">
import {onMounted, onUnmounted, watch} from "vue";
import {useReservesStore} from "@/store/ReservesStore";
import {useClientStore} from "@/store/ClientStore";
import {useProductStore} from "@/store/ProductStore";
import {useI18n} from "vue-i18n";

import Dialog from "primevue/dialog";
import TableDataComponent from "@/components/reserves/TableDataComponent.vue";

const reserveStore = useReservesStore();
const productStore = useProductStore();
const clientStore = useClientStore();
const { t } = useI18n();

onMounted(() => {
  reserveStore.getAllReserves()
  productStore.getAllProducts()
  clientStore.getAllClients()
})

onUnmounted(() => {
  reserveStore.clearState()
})
</script>

<template>
<div class="card">
  <TableDataComponent :datos="reserveStore.enrichedReservesData"/>
</div>
</template>

<style scoped>

</style>