<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import { useClientStore } from "@/store/ClientStore";

const clientStore = useClientStore();
const stateClient = clientStore.clientUiState

const handleByStateAction = async () => {
  if (stateClient.isEdit){
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await clientStore.updateClient()

  if (stateClient.success){
    clientStore.clearForm()
  }
}

const handleSave = async () => {
  await clientStore.createClient()

  if (stateClient.success){
    clientStore.clearForm()
  }
}

const cancelUpdate = () => {
  clientStore.clearForm()
}
</script>

<template>
  <div class="form-card">
    <div class="form-header">
      <div class="title-wrapper">
        <i :class="stateClient.isEdit ? 'pi pi-pencil icon-edit' : 'pi pi-plus-circle icon-add'"></i>
        <h2>{{ stateClient.isEdit ? 'Editar Cliente' : 'Crear Cliente' }}</h2>
      </div>
    </div>

    <div class="form-body">
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateClient.nameClient"
              class="w-full custom-input"
              :class="{ 'p-invalid': stateClient.nameError }"
          />
          <label for="name">Nombre del Cliente</label>
        </FloatLabel>
        <small v-if="stateClient.nameError" class="error-msg">
          {{ stateClient.nameError }}
        </small>
      </div>

      <div class="field">
        <FloatLabel>
          <InputText
            id="apePClient"
            v-model="stateClient.apePClient"
            class="w-full custom-input"
            :class="{ 'p-invalid': stateClient.apePError }"
          />
          <label for="apePClient">Apellido Paterno</label>
        </FloatLabel>
        <small class="error-msg" v-if="stateClient.apePError">
          {{ stateClient.apePError }}
        </small>
      </div>
      <div class="field">
        <FloatLabel>
          <InputText
            id="apeMClient"
            v-model="stateClient.apeMClient"
            class="w-full custom-input"
          />
          <label for="apeMClient">Apellido Materno</label>
        </FloatLabel>
      </div>

      <div class="field">
        <FloatLabel>
          <InputText
              id="telephone"
              v-model="stateClient.telephone"
              class="w-full custom-input"
              :class="{ 'p-invalid': stateClient.telephoneError }"
          />
          <label for="telephone">Telefono</label>
        </FloatLabel>
        <small class="error-msg" v-if="stateClient.telephoneError">
          {{ stateClient.telephoneError }}
        </small>
      </div>

      <div class="actions-group">
        <Button
            type="button"
            :label="stateClient.isEdit ? 'Actualizar' : 'Guardar Cliente'"
            :icon="stateClient.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="stateClient.isLoading"
            @click="handleByStateAction"
            class="btn-submit w-full"
        />
        <Button
            v-if="stateClient.isEdit"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            text
            @click="cancelUpdate"
            class="w-full mt-2"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estructura del Card similar a la tabla */
.form-card {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  background: var(--surface-card, #ffffff);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--surface-border, #ececec);
}

.form-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #4b5563;
}

/* Colores de iconos homologados */
.icon-add {
  color: #d946ef;
  font-size: 1.5rem;
}

/* Magenta */
.icon-edit {
  color: #8b5cf6;
  font-size: 1.5rem;
}

/* Morado */

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

/* Inputs con el toque de la marca */
.custom-input{
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.75rem;
}

.custom-input:focus{
  border-color: #d946ef !important; /* Magenta al foco */
  box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.1) !important;
}

/* Botones */
.actions-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-direction: column;
}

.btn-submit {
  flex: 1;
  background: #d946ef; /* Magenta principal */
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-submit:hover {
  background: #c026d3 !important;
  transform: translateY(-1px);
}

.error-msg {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  margin-left: 0.2rem;
}
</style>