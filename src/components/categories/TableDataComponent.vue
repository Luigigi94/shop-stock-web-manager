<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import {useCategoryStore} from "@/store/CategoryStore";
import {useI18n} from "vue-i18n";

const categoryStore = useCategoryStore();
const { t } = useI18n();

const props = defineProps({
  datos: {
    type: Array,
    required: true,
    default: () => []
  }
});

const handleEdit = async (id: string) => {
  categoryStore.categoryUiState.success = false;
  categoryStore.categoryUiState.isModalVisible = true;
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
  <div class="inventory-container">
    <div class="inventory-card">
      <div class="header-section">
        <div class="title-wrapper">
          <i class="pi pi-tags icon-magenta"></i>
          <h2>{{ t("tableGeneric.management", {item: t("entityName.category")}) }}</h2>
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

        <Column field="nameCategory" :header="t('entityName.category')" sortable style="calc(70% - 15rem)">
          <template #body="slotProps">
            <span class="font-bold text-magenta">{{ slotProps.data.nameCategory }}</span>
          </template>
        </Column>

        <Column field="descriptionCategory" :header="t('tableGeneric.descHeader')" style="width: 30%">
          <template #body="slotProps">
            <span class="font-bold text-magenta">{{
                slotProps.data.descriptionCategory || t('tableGeneric.emptyState')
              }}</span>
          </template>
        </Column>

        <Column :header="t('tableGeneric.actions')" headerStyle="width: 15rem; text-align: center" bodyStyle="text-align: center">
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
