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
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const cartStore = useCartStore();
const currentState = cartStore.cartUiState
interface ProductFilter {
  idProduct: string;
  nameProduct?: string;
  categoryName?: string;
  stock?: number;
  imageProduct?: string;
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
  };
}
const filteredItems = computed(() => {
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
  <div class="flex flex-col">
    <div class="card">
      <div class="font-semibold text-xl mb-4">{{ t('entityName.newSale') }}</div>

      <DataView :value="filteredItems" :layout="layout">
        <template #header>
          <div class="flex flex-col md:flex-row md:justify-between gap-4">
            <IconField>
              <InputIcon>
                <i class="pi pi-search"/>
              </InputIcon>
              <InputText v-model="filters1.global.value" :placeholder="t('listsGeneric.search', {entity: t('entityName.product')})" />
            </IconField>

            <div class="flex justify-end">
              <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                <template #option="{ option }">
                  <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                </template>
              </SelectButton>
            </div>
          </div>
        </template>

        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                <div class="md:w-40 relative">
                  <img class="block xl:block mx-auto rounded w-full" :src="item.imageProduct" :alt="item.nameProduct" />
                  <Tag :value="getStatus(item.stock)" :severity="getSeverity(item.stock)" class="absolute dark:bg-surface-900!" style="left: 4px; top: 4px"></Tag>
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.categoryName }}</span>
                      <div class="text-lg font-medium mt-2">{{ item.nameProduct }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <span class="text-xl font-semibold">${{ item.priceProduct }}</span>
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <Button
                          icon="pi pi-shopping-cart"
                          :label="t('listsGeneric.buttonAdd')"
                          :disabled="Number(item.stock) <= 0"
                          class="flex-auto md:flex-initial whitespace-nowrap"
                          @click="cartStore.addItemToCart(item.idProduct)"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4">
            <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
              <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                <div class="bg-surface-50 flex justify-center rounded p-4">
                  <div class="relative mx-auto">
                    <img class="rounded w-full h-48 object-cover alt-text-style" :src="item.imageProduct" :alt="item.nameProduct" style="max-width: 200px; min-width: 200px" />
                    <Tag :value="getStatus(item.stock)" :severity="getSeverity(item.stock)" class="absolute dark:bg-surface-900!" style="left: 4px; top: 4px"></Tag>
                  </div>
                </div>
                <div class="pt-6">
                  <div class="flex flex-row justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.categoryName }}</span>
                      <div class="text-lg font-medium mt-1">{{ item.nameProduct }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-6 mt-6">
                    <span class="text-2xl font-semibold">${{ item.priceProduct }}</span>
                    <div class="flex gap-2">
                      <Button
                          icon="pi pi-shopping-cart"
                          :label="t('listsGeneric.buttonAdd')"
                          :disabled="Number(item.stock) <= 0"
                          class="flex-auto whitespace-nowrap"
                      />
                      <Button icon="pi pi-heart" outlined></Button>
                    </div>
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

</style>
