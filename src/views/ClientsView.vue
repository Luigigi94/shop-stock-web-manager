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
  <Dialog v-model:visible="stateClient.isModalVisible" :style="{width: '450px'}" header="Client Details" :modal="true">
    <section>
      <FormComponent />
    </section>
  </Dialog>
  <section>
    <TableDataComponent :datos="clientStore.allClients"/>
  </section>
</template>

<style scoped>
</style>