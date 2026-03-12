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
  </div>
</template>

<style scoped>
/* Contenedor externo para dar aire en la página */
.inventory-container {
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

/* El Card que contiene todo */
.inventory-card {
  background: var(--surface-card, #ffffff);
  width: 100%;
  max-width: 1400px; /* Evita que se estire infinito en monitores ultra-wide */
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--surface-border, #ececec);
}

/* Header estilizado */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-magenta {
  font-size: 1.5rem;
  color: #d946ef; /* Magenta */
}

h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #4b5563;
}

.stats-badge {
  background: #f5f3ff;
  color: #7c3aed; /* Morado */
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Estilos de la tabla */
.custom-table :deep(.p-datatable-thead > tr > th) {
  background: #f9fafb;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.text-magenta {
  color: #c026d3;
}

.actions-wrapper {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.edit-btn:hover {
  color: #8b5cf6 !important; /* Morado al pasar el mouse */
  background: #f5f3ff !important;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}

/* Responsividad */
@media screen and (max-width: 960px) {
  .inventory-card {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>