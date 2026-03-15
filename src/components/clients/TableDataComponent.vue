<script setup lang="ts">
import DataTable, {type DataTableFilterMeta} from "primevue/datatable";
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Column from "primevue/column";
import Button from "primevue/button";
import {useI18n} from "vue-i18n";
import { useClientStore } from "@/store/ClientStore";
import {computed, onBeforeMount, ref} from "vue";
import {FilterMatchMode, FilterOperator} from "@primevue/core/api";

const {t} = useI18n();
const clientStore = useClientStore();
const currentState = clientStore.clientUiState

interface ClientFilter {
  idClient?: string,
  nameClient?: string,
  apePClient?: string,
  apeMClient?: string,
  telephone?: string,
}

const filters1 = ref<DataTableFilterMeta>({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS}
})

const props = defineProps<{
  datos: ClientFilter[]
}>()

onBeforeMount(() => {
  initFilters1()
})

function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nameClient: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    apePClient: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    apeMClient: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  }
}

const filteredItems = computed( () =>{
  const globalFilter = filters1.value['global'] as { value: any };
  const search = globalFilter?.value;

  if (!search) {
    return props.datos
  }

  const lowSearch = search.toLowerCase();

  return props.datos.filter( (dato: ClientFilter) => {
    return (
        dato.nameClient?.toLocaleLowerCase().includes(lowSearch) ||
        dato.apePClient?.toLocaleLowerCase().includes(lowSearch) ||
        dato.apeMClient?.toLocaleLowerCase().includes(lowSearch)
    )
  })
})

const handleEdit = async (id: string) => {
  currentState.success = false
  currentState.isModalVisible = true

  const client = await clientStore.clientById(id)

  if (client) {
    currentState.idClient = client.idClient
    currentState.nameClient = client.nameClient
    currentState.apeMClient = client.apeMClient
    currentState.apePClient = client.apePClient
    currentState.telephone = client.telephone
  }
}

const handleDelete = async (id: string) => {
  currentState.success = false
  const client = await clientStore.clientById(id)
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
        <i class="pi pi-tags mr-3 text-primary" style="font-size: 2rem"/>
        <h2 class="m-0 text-2xl font-semibold text-surface-900 dark:text-surface-0">
          {{ t("tableGeneric.management", {item: t("entityName.client")}) }}
        </h2>
      </div>
      <Button
          :label="t('formsGeneric.new_m', {item: t('entityName.client')})"
          icon="pi pi-plus"
          @click="clientStore.openNewClient()"
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
            <InputText v-model="filters1.global.value" :placeholder="t('listsGeneric.search')" />

          </IconField>
        </div>
      </template>
      <template #empty>
        <div class="empty-state">{{ t("tableGeneric.emptyState") }}</div>
      </template>
      <Column field="nameClient" :header="t('formsGeneric.name')"  sortable style="calc(55% - 15rem)">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.nameClient }}</span>
        </template>
      </Column>
      <Column field="apePClient" :header="t('formsGeneric.client.lastName')"  style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.apePClient }}</span>
        </template>
      </Column>
      <Column field="apePClient" :header="t('formsGeneric.client.secondLastName')"  style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.apeMClient }}</span>
        </template>
      </Column>
      <Column field="telephone" :header="t('formsGeneric.client.phone')"  style="width: 16%">
        <template #body="slotProps">
          <span class="font-bold text-magenta">{{ slotProps.data.telephone }}</span>
        </template>
      </Column>
      <Column :header="t('tableGeneric.actions')" headerStyle="width: 15rem; text-align: center" bodyStyle="text-align: center">
        <template #body="slotProps">
          <div class="actions-wrapper">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-secondary edit-btn"
                @click="handleEdit(slotProps.data.idClient)"
            />
            <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="handleDelete(slotProps.data.idClient)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
/* Contenedor externo para dar aire en la página */
/*.inventory-container {
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

!* El Card que contiene todo *!
.inventory-card {
  background: var(--surface-card, #ffffff);
  width: 100%;
  max-width: 1400px; !* Evita que se estire infinito en monitores ultra-wide *!
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--surface-border, #ececec);
}

!* Header estilizado *!
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
  color: #d946ef; !* Magenta *!
}

h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #4b5563;
}

.stats-badge {
  background: #f5f3ff;
  color: #7c3aed; !* Morado *!
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

!* Estilos de la tabla *!
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
  color: #8b5cf6 !important; !* Morado al pasar el mouse *!
  background: #f5f3ff !important;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}

!* Responsividad *!
@media screen and (max-width: 960px) {
  .inventory-card {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}*/
</style>