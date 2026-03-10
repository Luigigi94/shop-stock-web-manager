<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import {useCategoryStore} from "@/store/CategoryStore";

const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState


const handleByStateAction = async () => {
  if (stateCategory.isEdit) {
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await categoryStore.updateCategory()

  if (stateCategory.success) {
    stateCategory.idCategory = ""
    stateCategory.nameCategory = ""
    stateCategory.descriptionCategory = ""
    stateCategory.isEdit = false
  }
}

const handleSave = async () => {
  await categoryStore.addCategory()

  if (stateCategory.success) {
    stateCategory.nameCategory = ""
    stateCategory.descriptionCategory = ""
    stateCategory.isEdit = false
  }
}

const cancelUpdate = () => {
  categoryStore.clearForm()
}
</script>

<template>
  <div class="form-card">
    <div class="form-header">
      <div class="title-wrapper">
        <i :class="stateCategory.isEdit ? 'pi pi-pencil icon-edit' : 'pi pi-plus-circle icon-add'"></i>
        <h2>{{ stateCategory.isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
      </div>
    </div>

    <div class="form-body">
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateCategory.nameCategory"
              class="w-full custom-input"
              :class="{ 'p-invalid': stateCategory.nameError }"
          />
          <label for="name">Nombre de la Categoría</label>
        </FloatLabel>
        <small v-if="stateCategory.nameError" class="error-msg">
          {{ stateCategory.nameError }}
        </small>
      </div>

      <div class="field mt-5">
        <FloatLabel>
          <Textarea
              id="description"
              v-model="stateCategory.descriptionCategory"
              rows="3"
              class="w-full custom-textarea"
              autoResize
          />
          <label for="description">Descripción (Opcional)</label>
        </FloatLabel>
      </div>

      <div class="actions-group">
        <Button
            type="button"
            :label="stateCategory.isEdit ? 'Actualizar' : 'Guardar Categoría'"
            :icon="stateCategory.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="stateCategory.isLoading"
            @click="handleByStateAction"
            class="btn-submit w-full"
        />
        <Button
            v-if="stateCategory.isEdit"
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

</style>

<!--
<style scoped>
/* Estructura del Card similar a la tabla */
.form-card {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  background: var(&#45;&#45;surface-card, #ffffff);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid var(&#45;&#45;surface-border, #ececec);
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
.custom-input, .custom-textarea {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.75rem;
}

.custom-input:focus, .custom-textarea:focus {
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

.btn-cancel {
  border-radius: 8px;
  color: #6b7280;
}

.error-msg {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  margin-left: 0.2rem;
}

/* Espaciado extra */
.mt-5 {
  margin-top: 2rem; /* Espacio extra para que el FloatLabel no choque */
}
</style>-->
