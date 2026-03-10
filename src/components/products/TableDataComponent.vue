<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useProductStore  } from "@/store/ProductStore";

const productStore = useProductStore();
const currentState = productStore.productUiState
const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
})

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
</script>

<template>
<div class="card">
  <h2>Productos</h2>
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
      <div class="empty-state">No hay productos registrados</div>
    </template>

    <Column field="nameProduct" header="Nombre" sortable style="width: 25%">
      <template #body="slotProps">
        <span class="font-bold text-magenta">{{ slotProps.data.nameProduct }}</span>
      </template>
    </Column>

    <Column field="descriptionProduct" header="Descripción" style="width: 50%">
      <template #body="slotProps">
        <span class="font-bold text-magenta">{{ slotProps.data.descriptionProduct || 'Sin descripción' }}</span>
      </template>
    </Column>

    <Column field="priceProduct" header="Precio">
      <template #body="slotProps">
        <span class="font-bold text-magenta">{{ slotProps.data.priceProduct }}</span>
      </template>
    </Column>

    <Column field="stock" header="Stock">
      <template #body="slotProps">
        <span class="font-bold text-magenta">{{ slotProps.data.stock }}</span>
      </template>
    </Column>

    <Column field="categoryName" header="Categoria">
      <template #body="slotProps">
        <span class="font-bold text-magenta">{{ slotProps.data.categoryName }}</span>
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            security="info"
            rounded
            @click="handleEdit(slotProps.data.idProduct)"
          ><i class="pi pi-pencil"></i></Button>
        </div>
        <div class="flex gap-2">
          <Button
            security="danger"
            rounded
            @click="handleDelete(slotProps.data.idProduct)"
            ><i class="pi pi-trash"></i></Button>
        </div>
      </template>
    </Column>
  </DataTable>
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

.text-description {
  color: #6b7280;
  line-height: 1.5;
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