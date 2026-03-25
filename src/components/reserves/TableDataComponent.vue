<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {Reserves} from "@/types/models/Reserves";
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import {computed, ref} from "vue";
const props = defineProps<{
  datos: Reserves[]
}>()
const expandedGroups = ref([]);
const ordenados = computed(() => {
  if (!props.datos) return [];
  // Hacemos una copia para no mutar la prop y ordenamos por idClient
  return [...props.datos].sort((a, b) => a.idClient.localeCompare(b.idClient));
});
</script>

<template>
  {{ordenados}}
  ------------------------------
  {{props.datos}}
  <div class="font-semibold text-xl mb-4">Grouping</div>
  <DataTable
      :value="props.datos"
      rowGroupMode="subheader"
      groupRowsBy="idClient"
      sortMode="single"
      sortField="idClient"
  >
    <template #groupheader="slotProps">
      <div class="flex items-center gap-2">
        <i class="pi pi-user text-primary"></i>
        <span class="font-bold">Cliente ID: {{ slotProps.data.idClient }}</span>
      </div>
    </template>
    <Column field="idProduct" header="Producto"></Column>

    <Column field="qtyReserve" header="Cantidad">
      <template #body="slotProps">
        {{ slotProps.data.qtyReserve }} pz
      </template>
    </Column>

    <Column field="priceAtReserve" header="Precio Unit.">
      <template #body="slotProps">
        $ {{ slotProps.data.priceAtReserve }}
      </template>
    </Column>

    <Column field="amount" header="Total">
      <template #body="slotProps">
        <span class="font-semibold text-green-600">
            $ {{ slotProps.data.amount }}
        </span>
      </template>
    </Column>

    <template #groupfooter="slotProps">
      <div class="flex justify-end w-full font-bold p-2 bg-gray-50">
        Total por Cliente:
      </div>
    </template>
  </DataTable>
</template>

<style scoped>

</style>