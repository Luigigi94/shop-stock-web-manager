<script setup lang="ts">
import DataTable, {DataTableFilterMeta} from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from "primevue/inputtext";
import {useCategoryStore} from "@/store/CategoryStore";
import {useI18n} from "vue-i18n";
import {computed, onBeforeMount, ref} from "vue";
import {FilterMatchMode, FilterOperator} from "@primevue/core/api";

const categoryStore = useCategoryStore();
const { t } = useI18n();
interface CategoryFilter {
  idCategory?: string;
  nameCategory?: string;
  descriptionCategory?: string;
}
const props = defineProps<{
  datos: CategoryFilter[]
}>();

const filters1 = ref<DataTableFilterMeta>({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS}
})

onBeforeMount(() =>{
  initFilters1()
})

function initFilters1() {
  filters1.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    nameCategory: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
  }
}

const filteredItems = computed(() => {
  const globalFilter = filters1.value['global'] as {value: any};
  const search = globalFilter?.value

  if(!search){
    return props.datos
  }
  const lowSearch = search.toLowerCase()

  return props.datos.filter((dato: CategoryFilter) => {
    return (
        dato.nameCategory?.toLowerCase().includes(lowSearch)
    )
  })
})
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
const clearFilter = () => {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

  }
}
</script>

<template>
  <div class="card">
    <div class="flex flex-warp items-center justify-between gap-3 mb-6 w-full">
      <div class="flex items-center">
        <i class="pi pi-tags mr-3 text-primary" style="font-size: 2rem"></i>
        <h2 class="m-0 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ t("tableGeneric.management", {item: t("entityName.category")}) }}</h2>
      </div>
      <Button
          :label="t('formsGeneric.new_f', {item: t('entityName.category')})"
          icon="pi pi-plus"
          @click="categoryStore.openNewCategory()"
          class="p-button-primary w-auto"
      />
    </div>
    <div class="stats-badge">
      {{ `${props.datos.length} ${t('tableGeneric.records')}` }}
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
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters1.global.value" :placeholder="t('listsGeneric.search')" />
          </IconField>
        </div>
      </template>
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
</template>

<style scoped>
</style>
