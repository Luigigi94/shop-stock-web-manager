<script setup lang="ts">
import {onMounted, onUnmounted, watch} from "vue";
import {useReservesStore} from "@/store/ReservesStore";
import {useI18n} from "vue-i18n";

import Dialog from "primevue/dialog";
import TableDataComponent from "@/components/reserves/TableDataComponent.vue";

const reserveStore = useReservesStore();
const { t } = useI18n();

onMounted(() => {
  reserveStore.getAllReserves()
})

onUnmounted(() => {
  reserveStore.clearState()
})
</script>

<template>
<div class="card">
  <TableDataComponent :datos="reserveStore.allReserves"/>
</div>
</template>

<style scoped>

</style>