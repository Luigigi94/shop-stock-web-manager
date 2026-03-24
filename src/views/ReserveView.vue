<script setup lang="ts">
import {onMounted, onUnmounted, watch} from "vue";
import {useReservesStore} from "@/store/ReservesStore";
import {useI18n} from "vue-i18n";

import Dialog from "primevue/dialog";

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

</template>

<style scoped>

</style>