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
  <DataTable :value="props.datos" paginator :rows="5" table-style="min-width: 40 rem">
    <Column field="nameProduct" header="Nombre"></Column>
    <Column field="descriptionProduct" header="Descripción"></Column>
    <Column field="priceProduct" header="Precio"></Column>
    <Column field="stock" header="Stock"></Column>
    <Column field="categoryName" header="Categoria"></Column>
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

</style>