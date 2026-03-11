<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import {useSupplierStore} from '@/store/SupplierStore'
import {useI18n} from "vue-i18n";

const supplierStore = useSupplierStore()
const supplierState = supplierStore.supplierUiState
const {t} = useI18n()
const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})

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
</script>

<template>
  <div class="inventory-container">
    <div class="inventory-card">
      <div class="header-section">
        <div class="title-wrapper">
          <i class="pi pi-tags icon-magenta"></i>
          <h2>{{ t('tableGeneric.management', {item: t('entityName.supplier')}) }}</h2>
        </div>
        <div class="stats-badge">
          {{ `${props.datos.length} ${t('tableGeneric.records')}` }}
        </div>
      </div>

      <DataTable
          :value="props.datos"
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
        <template #empty>
          <div class="empty-state">{{ t("tableGeneric.emptyState") }}</div>
        </template>

        <Column field="name" :header="t('formsGeneric.name')" sortable style="width: 50%">
          <template #body="slotProps">
            <span class="font-bold text-magenta">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column field="phone" :header="t('formsGeneric.supplier.phone')" style="width: 20%">
          <template #body="slotProps">
            <span class="text-description">{{ slotProps.data.phone || t('tableGeneric.emptyState') }}</span>
          </template>
        </Column>

        <Column field="identifierAccount" :header="t('formsGeneric.supplier.idAccount')" style="width: 20%">
          <template #body="slotProps">
            <span class="text-description">{{ slotProps.data.identifierAccount || t('tableGeneric.emptyState') }}</span>
          </template>
        </Column>

        <Column field="idBank" :header="t('formsGeneric.supplier.bank')" style="width: 20%">
          <template #body="slotProps">
            <span class="text-description">{{ slotProps.data.idBank || t('tableGeneric.emptyState') }}</span>
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
  </div>
</template>

<style scoped>

</style>