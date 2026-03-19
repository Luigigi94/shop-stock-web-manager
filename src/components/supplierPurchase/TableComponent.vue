<script setup lang="ts">
import DataTable from "primevue/datatable";
import {ref} from "vue";
import {SupplierPurchaseUiState} from "@/types/ui/SupplierPurchaseUiState";

const expandedRows = ref([])

const props = defineProps<{
  datos: SupplierPurchaseUiState
}>()

function expandAll() {
  expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
}

function collapseAll() {
  expandedRows.value = null;
}
</script>

<template>
  <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="id" tableStyle="min-width: 60rem">
  </DataTable>
</template>

<style scoped>

</style>