<script setup lang="ts">
import DataTable from "primevue/datatable";
import { FilterMatchMode } from '@primevue/core/api';
import Column from "primevue/column";
import {useCartStore} from "@/store/CartStore";
import {useI18n} from "vue-i18n";
import Button from "primevue/button";
import {ref} from "vue";

const cartStore = useCartStore();
const currentState = cartStore.cartUiState

const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})

const {t} = useI18n();
const handleAddToCart = () => {
}
const handleRemoveFromCart = () => {
}
const selectedProducts = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
</script>

<template>
  <div class="inventory-container">
    <div class="inventory-card">
      <div class="header-section">
        <div class="title-wrapper"><i class="pi pi-tags icon-magenta"></i>
          <h2>Ventas</h2>
        </div>
      </div>
      <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="props.datos"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          :currentPageReportTemplate="t('tableGeneric.currentPageReportTemplate')"
      >
        <Column field="nameProduct" header="Producto" sortable style="calc(55% - 15rem)">
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
              ><i class="pi pi-pencil"></i></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <!--          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />-->
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2"/>
          <!--          <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />-->
          <Button label="Delete" icon="pi pi-trash" severity="secondary"/>
        </template>
      </Toolbar>
    </div>
  </div>
</template>

<style scoped>

</style>