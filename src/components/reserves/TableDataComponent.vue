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
      :value="[ { 'idGroup': '82156423-ebab-4f34-8797-eabb8fb4fcca_25/03/2026', 'idClient': '82156423-ebab-4f34-8797-eabb8fb4fcca', 'clientName': 'luigigie luis', 'fecha': '25/03/2026', 'totalDia': 162, 'productos': [ { 'idReserves': '9785695c-10d7-4126-96b2-7802cb61c0bc', 'amount': 108, 'priceAtReserve': 54, 'qtyReserve': 2, 'idProduct': 'prod-001', 'productData': { 'nameProduct': 'San Judas Moneda', 'imageProduct': 'data:image/svg+xml...' }, 'reservedAt': { 'seconds': 1774458684, 'nanoseconds': 0 } }, { 'idReserves': 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'amount': 54, 'priceAtReserve': 54, 'qtyReserve': 1, 'idProduct': 'prod-001', 'productData': { 'nameProduct': 'San Judas Moneda', 'imageProduct': 'data:image/svg+xml...' }, 'reservedAt': { 'seconds': 1774465884, 'nanoseconds': 0 } } ] }, { 'idGroup': '82156423-ebab-4f34-8797-eabb8fb4fcca_26/03/2026', 'idClient': '82156423-ebab-4f34-8797-eabb8fb4fcca', 'clientName': 'luigigie luis', 'fecha': '26/03/2026', 'totalDia': 300, 'productos': [ { 'idReserves': 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'amount': 300, 'priceAtReserve': 150, 'qtyReserve': 2, 'idProduct': 'prod-002', 'productData': { 'nameProduct': 'Cadena de Oro 14k', 'imageProduct': 'data:image/svg+xml...' }, 'reservedAt': { 'seconds': 1774545084, 'nanoseconds': 0 } } ] }, { 'idGroup': 'client-uuid-002_25/03/2026', 'idClient': 'client-uuid-002', 'clientName': 'Juan Perez', 'fecha': '25/03/2026', 'totalDia': 450, 'productos': [ { 'idReserves': 'res-003', 'amount': 450, 'priceAtReserve': 450, 'qtyReserve': 1, 'idProduct': 'prod-003', 'productData': { 'nameProduct': 'Anillo Compromiso', 'imageProduct': 'data:image/svg+xml...' }, 'reservedAt': { 'seconds': 1774458684, 'nanoseconds': 0 } } ] }, { 'idGroup': 'client-uuid-003_20/03/2026', 'idClient': 'client-uuid-003', 'clientName': 'Maria Garcia', 'fecha': '20/03/2026', 'totalDia': 120, 'productos': [ { 'idReserves': 'res-004', 'amount': 60, 'priceAtReserve': 30, 'qtyReserve': 2, 'idProduct': 'prod-004', 'productData': { 'nameProduct': 'Pulsera Plata' } }, { 'idReserves': 'res-005', 'amount': 60, 'priceAtReserve': 60, 'qtyReserve': 1, 'idProduct': 'prod-004', 'productData': { 'nameProduct': 'Pulsera Plata' } } ] }, { 'idGroup': 'client-uuid-004_22/03/2026', 'idClient': 'client-uuid-004', 'clientName': 'Pedro Rodriguez', 'fecha': '22/03/2026', 'totalDia': 85, 'productos': [ { 'idReserves': 'res-006', 'amount': 85, 'priceAtReserve': 85, 'qtyReserve': 1, 'idProduct': 'prod-005', 'productData': { 'nameProduct': 'Reloj Digital' } } ] }, { 'idGroup': 'client-uuid-005_24/03/2026', 'idClient': 'client-uuid-005', 'clientName': 'Ana Martinez', 'fecha': '24/03/2026', 'totalDia': 210, 'productos': [ { 'idReserves': 'res-007', 'amount': 210, 'priceAtReserve': 70, 'qtyReserve': 3, 'idProduct': 'prod-006', 'productData': { 'nameProduct': 'Aretes Perla' } } ] } ]"
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