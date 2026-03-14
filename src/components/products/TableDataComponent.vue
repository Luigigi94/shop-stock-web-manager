<script setup lang="ts">
import DataTable, {type DataTableFilterMeta} from "primevue/datatable";
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Column from "primevue/column";
import {useProductStore} from "@/store/ProductStore";
import {useI18n} from "vue-i18n";
import Button from "primevue/button";
import {computed, onBeforeMount, ref} from "vue";
import {FilterMatchMode, FilterOperator} from "@primevue/core/api";

const productStore = useProductStore();
const currentState = productStore.productUiState
interface ProductFilter {
  idProduct: string; // Añadido para los métodos de edición/borrado
  nameProduct?: string;
  categoryName?: string;
  stock?: number;
  image?: string;
  descriptionProduct?: string;
  priceProduct?: number;
}

// 3. Tipar los filtros
const filters1 = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
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
const {t} = useI18n();
const handleEdit = async (id: string) => {
  currentState.success = false;
  const product = await productStore.productById(id)
  if (product) {
    currentState.idProduct = product.idProduct
    currentState.nameProduct = product.nameProduct
    currentState.stock = product.stock.toString()
    currentState.descriptionProduct = product.descriptionProduct ?? ''
    currentState.priceProduct = product.priceProduct.toString()
    currentState.idCategory = product.idCategory
    currentState.isEdit = true
    currentState.isModalVisible = true
  }
}

const handleDelete = async (id: string) => {
  currentState.success = false;
  const product = await productStore.deleteProduct(id)

}

const clearFilter = () => {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  }
}
</script>

<template>
  <div class="card">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6 w-full">

      <div class="flex items-center">
        <i class="pi pi-tags mr-3 text-primary" style="font-size: 2rem"></i>
        <h2 class="m-0 text-2xl font-semibold text-surface-900 dark:text-surface-0">
          {{ t("tableGeneric.management", {item: t("entityName.product")}) }}
        </h2>
      </div>

      <Button
          :label="t('formsGeneric.new_m', {item: t('entityName.product')})"
          icon="pi pi-plus"
          @click="productStore.openNewProduct()"
          class="p-button-primary w-auto"
      />
    </div>
    <div class="stats-badge">
      {{ `${props.datos.length} ${t("tableGeneric.records")}` }}
    </div>
    <DataTable
        :value="filteredItems"
        paginator
        :rows="10"
        responsiveLayout="stack"
        breakpoint="960px"
        class="p-datatable-customers custom-table"
        stripedRows
        removableSort
        :rowsPerPageOptions="[5, 10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :currentPageReportTemplate="t('tableGeneric.currentPageReportTemplate')"
    >
      <template #header>
        <div class="flex justify-between">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters1.global.value" :placeholder="t('listsGeneric.search')" />

          </IconField>
        </div>
      </template>
      <template #empty>
        <div class="empty-state">{{ t("tableGeneric.emptyState") }}</div>
      </template>

      <Column :header="t('formsGeneric.product.img')">
        <template #body="slotProps">
          <img
              v-if="slotProps.data.imageProduct"
              :src="`${slotProps.data.imageProduct}`"
              :alt="slotProps.data.imageProduct"
              class="w-16 shadow-md rounded-md"
          />
          <i v-else class="pi pi-image text-surface-400" style="font-size: 2rem"></i>
        </template>
      </Column>
      <Column field="nameProduct" :header="t('formsGeneric.name')" sortable style="calc(55% - 15rem)">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.nameProduct }}</span>
        </template>
      </Column>

      <Column field="descriptionProduct" :header="t('tableGeneric.descHeader')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{
              slotProps.data.descriptionProduct || t('tableGeneric.emptyState')
            }}</span>
        </template>
      </Column>

      <Column field="priceProduct" :header="t('formsGeneric.product.price')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.priceProduct }}</span>
        </template>
      </Column>

      <Column field="stock" :header="t('formsGeneric.product.qty')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.stock }}</span>
        </template>
      </Column>

      <Column field="categoryName" :header="t('entityName.category')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.categoryName }}</span>
        </template>
      </Column>
      <Column :header="t('tableGeneric.actions')" headerStyle="width: 15rem; text-align: center"
              bodyStyle="text-align: center">
        <template #body="slotProps">
          <div class="actions-wrapper">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-secondary edit-btn"
                @click="handleEdit(slotProps.data.idProduct)"
            ><i class="pi pi-pencil"></i></Button>
            <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="handleDelete(slotProps.data.idProduct)"
            ><i class="pi pi-trash"></i></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>