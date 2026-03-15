<script setup lang="ts">
import DataTable, {type DataTableFilterMeta} from "primevue/datatable";
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Column from 'primevue/column'
import Button from 'primevue/button'
import {useSupplierStore} from '@/store/SupplierStore'
import {useI18n} from "vue-i18n";
import {computed, onBeforeMount, ref} from "vue";
import {FilterMatchMode, FilterOperator} from "@primevue/core/api";

const supplierStore = useSupplierStore()
const supplierState = supplierStore.supplierUiState

interface SupplierFilter {
  idSupplier?: string,
  name?: string,
  phone?: string,
  identifierAccount?: string,
  idBank?: string,
}
const {t} = useI18n()
const filters1 = ref<DataTableFilterMeta>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const props = defineProps<{
  datos: SupplierFilter[]
}>();
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

  return props.datos.filter((dato: SupplierFilter) => {
    return (
        dato.name?.toLowerCase().includes(lowSearch) ||
        dato.phone?.toLowerCase().includes(lowSearch)
    );
  });
});

const handleEdit = async (id: string) => {
  supplierState.success = false
  supplierState.isEdit = true
  supplierState.isModalVisible = true
  const supplier = await supplierStore.supplierById(id)
  console.log("valor supplier handleEdit", supplier)
  if (supplier) {
    supplierState.idSupplier = supplier.idSupplier
    supplierState.name = supplier.name
    supplierState.phone = supplier.phone
    supplierState.identifierAccount = supplier.identifierAccount
    supplierState.idBank = supplier.idBank
  }
}

const handleDelete = async (id: string) => {
  supplierState.success = false
  const supplier = await supplierStore.supplierById(id)
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
          {{ t("tableGeneric.management", {item: t("entityName.supplier")}) }}
        </h2>
      </div>

      <Button
          :label="t('formsGeneric.new_m', {item: t('entityName.supplier')})"
          icon="pi pi-plus"
          @click="supplierStore.openNewSupplier()"
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
            <InputText v-model="filters1.global.value" :placeholder="t('listsGeneric.search', {entity: t('entityName.supplier')})" />

          </IconField>
        </div>
      </template>
      <template #empty>
        <div class="empty-state">{{ t("tableGeneric.emptyState") }}</div>
      </template>

      <Column field="name" :header="t('formsGeneric.name')" sortable style="calc(55% - 15rem)">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.name }}</span>
        </template>
      </Column>

      <Column field="phone" :header="t('formsGeneric.supplier.phone')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.phone || t('tableGeneric.emptyState') }}</span>
        </template>
      </Column>

      <Column field="identifierAccount" :header="t('formsGeneric.supplier.idAccount')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.identifierAccount || t('tableGeneric.emptyState') }}</span>
        </template>
      </Column>

      <Column field="idBank" :header="t('formsGeneric.supplier.bank')" style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.idBank || t('tableGeneric.emptyState') }}</span>
        </template>
      </Column>

      <Column :header="t('tableGeneric.actions')" headerStyle="width: 15rem; text-align: center" bodyStyle="text-align: center">
        <template #body="slotProps">
          <div class="actions-wrapper">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-secondary edit-btn"
                @click="handleEdit(slotProps.data.idSupplier)"
            />
            <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="handleDelete(slotProps.data.idSupplier)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>