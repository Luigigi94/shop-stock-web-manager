<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useClientStore } from "@/store/ClientStore";
import TableDataComponent from "@/components/clients/TableDataComponent.vue";
import FormComponent from "@/components/clients/FormComponent.vue";
import Dialog from 'primevue/dialog'
import Button from "primevue/button";

const clientStore = useClientStore();
const stateClient = clientStore.clientUiState

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
  <h1>Lista de Clientes</h1>
  <Button
      label="Nuevo Cliente"
      icon="pi pi-plus"
      @click="clientStore.openNewClient()"
  />
  <Dialog
  v-model:visible="stateClient.isModalVisible"
  modal
  :header="stateClient.isEdit ? 'Editar Cliente' : 'Nuevo Cliente'"
  >
    <section class="form-section">
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
.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 3rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
  background: #fdfdfd;
  border-radius: 8px;
  border: 1px solid #eee;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #d946ef;
  outline: none;
}

button {
  padding: 12px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #7c3aed;
}

button:disabled {
  background: #ccc;
}

</style>