<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import { useCategoryStore } from "@/store/CategoryStore";
const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState


const handleByStateAction = async () => {
  if (stateCategory.isEdit){
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
  <div class="form-container shadow-sm border border-surface-200 p-6 rounded-xl bg-surface-0">

    <div class="flex items-center gap-2 mb-6">
      <i :class="stateCategory.isEdit ? 'pi pi-pencil text-blue-500' : 'pi pi-plus-circle text-primary'" style="font-size: 1.5rem"></i>
      <h2 class="text-xl font-semibold text-surface-900">
        {{ stateCategory.isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
      </h2>
    </div>

    <div class="flex flex-col gap-8">
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateCategory.nameCategory"
              class="w-full py-3"
              :class="{ 'p-invalid': stateCategory.nameError }"
          />
          <label for="name">Nombre de la Categoría</label>
        </FloatLabel>
        <small v-if="stateCategory.nameError" class="text-red-500 ml-2">
          {{ stateCategory.nameError }}
        </small>
      </div>

      <div class="field">
<!--        <FloatLabel>
          <Textarea
              id="description"
              v-model="stateCategory.descriptionCategory"
              rows="4"
              class="w-full resize-none"
          />
          <label for="description">Descripción detallada (Opcional)</label>
        </FloatLabel>-->
        <InputText
            id="name"
            v-model="stateCategory.nameCategory"
            class="w-full py-3"
            :class="{ 'p-invalid': stateCategory.nameError }"
        />
        <label for="name">Nombre de la Categoría</label>
      </div>

      <div class="flex gap-3 mt-2">
        <Button
            type="button"
            :label="stateCategory.isEdit ? 'Actualizar' : 'Guardar Categoria'"
            :icon="stateCategory.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="stateCategory.isLoading"
            @click="handleByStateAction"
            class="flex-1 p-button-raised"
        />

        <Button
            v-if="stateCategory.isEdit"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            variant="text"
            @click="cancelUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Si no usas Tailwind, estos ajustes manuales ayudan mucho */
.form-container {
  max-width: 500px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

/* Efecto de elevación cuando el usuario se enfoca en el formulario */
.form-container:focus-within {
  //border-color: var(--p-primary-color);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>