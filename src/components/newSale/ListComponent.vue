<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useCartStore} from "@/store/CartStore";
import {computed, onBeforeMount, ref} from "vue";
import Button from "primevue/button";
import DataView from 'primevue/dataview';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { DataTableFilterMeta } from 'primevue/datatable';
import InputText from 'primevue/inputtext'; // ¡No olvides esta importación!

const cartStore = useCartStore();
const currentState = cartStore.cartUiState
interface ProductFilter {
  nameProduct?: string;
  categoryName?: string;
  stock?: number;
}

// 3. Tipar los filtros
const filters1 = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const options = ref(['list', 'grid']);
const layout = ref('list');
const {t} = useI18n();

const props = defineProps<{
  datos: ProductFilter[]
}>();

/*const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})*/

onBeforeMount(() => {
  initFilters1()
})
function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nameProduct: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    categoryName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    /*'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }*/
  };
}
const filteredItems = computed(() => {
  // Accedemos a la referencia de forma segura
  const globalFilter = filters1.value['global'] as { value: any };
  const search = globalFilter?.value;

  if (!search) {
    return props.datos;
  }

  const lowSearch = search.toLowerCase();

  return props.datos.filter((dato: ProductFilter) => {
    return (
        dato.nameProduct?.toLowerCase().includes(lowSearch) ||
        dato.categoryName?.toLowerCase().includes(lowSearch)
    );
  });
});

function getSeverity(stock: number) {
  switch (true) {
    case stock > 20:
      return 'success';

    case stock ==0 :
      return 'warning';

    default:
      return 'danger';
  }
}

function getStatus(stock: number) {
  switch (true) {
    case stock > 20:
      return 'Stock';

    case stock ==0 :
      return 'Sin Stock';

    default:
      return 'Stock Bajo';
  }
}
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

      <DataView :value="filteredItems" :layout="layout">
<!--      <DataView :value="props.datos" :layout="layout">-->
        <template #header>
          <div class="header-toolbar">
            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
              </template>
            </SelectButton>
          </div>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                  v-model="filters1['global'].value"
                  @input="() => {}"
                  placeholder="Buscar producto..."
              />
            </span>
          </div>
        </template>

        <template #list="slotProps">
          <div class="list-container">
            <div v-for="(item, index) in slotProps.items" :key="index" class="list-item">
              <div class="item-image-wrapper">
                <img src="@/assets/images/bamboo-watch.jpg" :alt="item.nameProduct" class="product-img" />
                <Tag :value="getStatus(item.stock)" :severity="getSeverity(item.stock)" class="status-tag" />
              </div>
              <div class="item-details">
                <div class="info">
                  <span class="category">{{ item.categoryName }}</span>
                  <div class="name">{{ item.nameProduct }}</div>
                </div>
                <div class="actions">
                  <span class="price">${{ item.priceProduct }}</span>
                  <div class="button-group">
                    <Button icon="pi pi-heart" outlined />
                    <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.stock === 0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid-container">
            <div v-for="(item, index) in slotProps.items" :key="index" class="grid-item">
              <div class="grid-image-wrapper">
                <img src="@/assets/images/black-watch.jpg" :alt="item.nameProduct" class="product-img-grid" />
                <Tag :value="getStatus(item.stock)" :severity="getSeverity(item.stock)" class="status-tag" />
              </div>
              <div class="grid-info">
                <span class="category">{{ item.categoryName }}</span>
                <div class="name">{{ item.nameProduct }}</div>
                <div class="grid-actions">
                  <span class="price">${{ item.priceProduct }}</span>
                  <div class="button-group-grid">
                    <Button icon="pi pi-shopping-cart" :disabled="item.stock === 0" />
                    <Button icon="pi pi-heart" outlined />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<style scoped>
/* Contenedores Generales */
.header-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

/* --- ESTILOS DE LISTA --- */
.list-container {
  display: flex;
  flex-direction: column;
}

.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.5rem;
  gap: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.item-image-wrapper {
  position: relative;
  width: 150px;
}

.product-img {
  width: 100%;
  border-radius: 8px;
}

.item-details {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

/* --- ESTILOS DE GRID (Aquí está el cambio real) --- */
.grid-container {
  display: grid;
  /* Esto crea 3 columnas si hay espacio, sino 2 o 1 */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.grid-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
}

.grid-image-wrapper {
  position: relative;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.product-img-grid {
  max-width: 100%;
  height: auto;
}

.grid-info {
  margin-top: 1rem;
}

.category {
  font-size: 0.875rem;
  color: #64748b;
}

.name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.grid-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
}

.status-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.button-group, .button-group-grid {
  display: flex;
  gap: 0.5rem;
}
</style>