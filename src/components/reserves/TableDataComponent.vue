<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {Reserves} from "@/types/models/Reserves";
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import {useDateFormatter} from "@/utilities/DateFormater"
import {computed, ref} from "vue";
import {Clients} from "@/types/models/Clients";
import {Products} from "@/types/models/Products";
export interface EnrichedReserve extends Reserves {
  clientData: Clients;
  productData: Products;
  groupName?: string;
}
const dateFormater = useDateFormatter()
const props = defineProps<{
  datos: EnrichedReserve[]
}>()
const expanded = ref([]);
const ordenados = computed(() => {
  if (!props.datos) return [];

  const grupos = new Map();

  props.datos.forEach(item => {
    // 1. Creamos una llave única por Cliente y por Día (sin horas)
    const fechaKey = dateFormater.formatDateOnly(item.reservedAt); // Usamos tu función de fecha
    const groupKey = `${item.idClient}_${fechaKey}`;

    if (!grupos.has(groupKey)) {
      grupos.set(groupKey, {
        idGroup: groupKey, // Para el dataKey
        idClient: item.idClient,
        clientName: `${item.clientData?.nameClient} ${item.clientData?.apePClient}`,
        fecha: fechaKey,
        totalDia: 0,
        productos: []
      });
    }

    const g = grupos.get(groupKey);
    g.productos.push(item);
    g.totalDia += item.amount;
  });

  // Convertimos el Map a Array y ordenamos por nombre de cliente y luego fecha
  return Array.from(grupos.values()).sort((a, b) => {
    if (a.clientName !== b.clientName) return a.clientName.localeCompare(b.clientName);
    return b.fecha.localeCompare(a.fecha); // Fecha más reciente primero
  });
});

</script>

<template>
  <div class="font-semibold text-xl mb-4">Grouping</div>
  <DataTable
      :value="ordenados"
      dataKey="idGroup"
      rowGroupMode="subheader"
      groupRowsBy="clientName"
      sortMode="single"
      sortField="clientName"
      v-model:expandedRows="expanded"
      scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
  >
    <template #groupheader="slotProps">
      <div class="flex items-center gap-2">
        <i class="pi pi-user text-primary"></i>
        <span class="font-bold">{{ slotProps.data.clientName || 'Cargando cliente...' }}</span>
      </div>
    </template>
    <Column expander style="width: 3rem"/>
    <Column header="Fecha de Reserva">
      <template #body="{data}">
        <span>{{data.fecha}}</span>
      </template>
    </Column>
    <Column header="Total del Día">
      <template #body="{ data }">
        <span class="text-green-600 font-bold">$ {{ data.totalDia }}</span>
      </template>
    </Column>


    <template #expansion="slotProps">
      <div class="p-3">
        <DataTable :value="slotProps.data.productos" class="p-datatable-sm">
          <Column field="productData.nameProduct" header="Producto"></Column>
          <Column field="qtyReserve" header="Cant."></Column>
          <Column field="priceAtReserve" header="Precio"></Column>
          <Column field="amount" header="Subtotal"></Column>
        </DataTable>
      </div>
    </template>

    <template #groupfooter="slotProps">
      <div class="flex justify-end w-full font-bold p-2 bg-gray-50">
        Total por Cliente:
      </div>
    </template>
  </DataTable>
</template>

<style scoped>

</style>