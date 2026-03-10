<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import {useSupplierStore} from '@/store/SupplierStore'

const supplierStore = useSupplierStore()
const supplierState = supplierStore.supplierUiState
const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})

const handleEdit = async (id: string) => {
  supplierState.success = false
  supplierState.isModalVisible = true
  const supplier = await supplierStore.supplierById(id)

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
          <h2>Gestión de Proveedores</h2>
        </div>
        <div class="stats-badge">
          {{ props.datos.length }} Registros
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
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
      >
        <template #empty>
          <div class="empty-state">No hay Proveedores registrados.</div>
        </template>

        <Column field="name" header="Nombre" sortable style="width: 50%">
          <template #body="slotProps">
            <span class="font-bold text-magenta">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column field="phone" header="Teléfono" style="width: 20%">
          <template #body="slotProps">
            <span class="text-description">{{ slotProps.data.phone || 'Sin descripción disponible' }}</span>
          </template>
        </Column>

        <Column field="identifierAccount" header="Teléfono" style="width: 20%">
          <template #body="slotProps">
            <span class="text-description">{{ slotProps.data.identifierAccount || 'Sin CLABE/No. Tarjeta disponible' }}</span>
          </template>
        </Column>

        <Column field="idBank" header="Teléfono" style="width: 20%">
          <template #body="slotProps">
            <span class="text-description">{{ slotProps.data.idBank || 'Sin Banco disponible' }}</span>
          </template>
        </Column>

        <Column header="Acciones" headerStyle="width: 15rem; text-align: center" bodyStyle="text-align: center">
          <template #body="slotProps">
            <div class="actions-wrapper">
              <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-secondary edit-btn"
                  @click="handleEdit(slotProps.data.idCategory)"
              />
              <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="handleDelete(slotProps.data.idCategory)"
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