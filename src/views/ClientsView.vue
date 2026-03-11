<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useClientStore } from "@/store/ClientStore";
import TableDataComponent from "@/components/clients/TableDataComponent.vue";
import FormComponent from "@/components/clients/FormComponent.vue";
import Dialog from 'primevue/dialog'
import Button from "primevue/button";
import {useI18n} from "vue-i18n";

const clientStore = useClientStore();
const stateClient = clientStore.clientUiState
const {t} = useI18n();
watch(() => stateClient.success, (isSuccess) => {
  if (isSuccess) {
    clientStore.clearForm()
  }
})

onMounted(() => {
  clientStore.getAllClients()
})

onUnmounted(() => {
  clientStore.clear()
})
</script>

<template>
<div class="container">
  <h1>{{ t('viewsGeneric.list', {entity: t("entityName.client")})}}</h1>
  <Button
      :label="t('formsGeneric.new_m', {item: t('entityName.client')})"
      icon="pi pi-plus"
      @click="clientStore.openNewClient()"
  />
  <Dialog
  v-model:visible="stateClient.isModalVisible"
  modal
  >
    <section>
      <FormComponent />
    </section>
  </Dialog>
  <hr>
  <hr>
  <section class="data-section">
    <TableDataComponent :datos="clientStore.allClients"/>
  </section>
</div>
</template>

<style scoped>
button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>