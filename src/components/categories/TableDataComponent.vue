<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {useCategoryStore} from "@/store/CategoryStore";

const categoryStore = useCategoryStore();

const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
});

const handleEdit = async (id: string) => {
  categoryStore.categoryUiState.success = false;
  const category = await categoryStore.categoryById(id)

  if (category) {
    categoryStore.categoryUiState.idCategory = category.idCategory;
    categoryStore.categoryUiState.nameCategory = category.nameCategory;
    categoryStore.categoryUiState.descriptionCategory = category.descriptionCategory || "";
  }
}

const handleDelete = async (id: string) => {
  categoryStore.categoryUiState.success = false;
  const category = await categoryStore.deleteCategory(id)
}

</script>

<template>
  <div class="card">
    <h2>Categorías</h2>
    <DataTable :value="props.datos" paginator :rows="5" tableStyle="min-width: 40rem">
      <Column field="nameCategory" header="Categoria"></Column>
      <Column field="descriptionCategory" header="Descripción">
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button
                severity="info"
                rounded
                @click="handleEdit(slotProps.data.idCategory)"
            ><i class="pi pi-pencil"></i></Button>

            <Button
                severity="danger"
                rounded
                @click="handleDelete(slotProps.data.idCategory)"
            ><i class="pi pi-trash"></i></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
card {
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
}
</style>