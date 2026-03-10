<script setup lang="ts">
import {onMounted, onUnmounted, watch} from 'vue'
import {useCategoryStore} from "@/store/CategoryStore";
import TableDataComponent from "@/components/categories/TableDataComponent.vue";
import FormComponent from "@/components/categories/FormComponent.vue";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState

watch(() => stateCategory.success, (isSuccess) => {
  if (isSuccess) {
    categoryStore.clearForm();
  }
});

onMounted(() =>{
  categoryStore.getAllCategories()
})

onUnmounted(() => {
  categoryStore.clear()
})
</script>

<template>
  <div class="container">
    <h1>{{ t("viewsGeneric.list", {entity: t("entityName.category")}) }}</h1>
    <Button
        :label="t('formsGeneric.new_f', {item: t('entityName.category')})"
        icon="pi pi-plus"
        @click="categoryStore.openNewCategory()"
        class="btn-new"
    />
    <Dialog
        v-model:visible="categoryStore.categoryUiState.isModalVisible"
        modal
    >
      <section>
        <FormComponent/>
      </section>
    </Dialog>
    <hr>

    <hr>
    <section class="data-section">
      <TableDataComponent :datos="categoryStore.allCategories"/>
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
