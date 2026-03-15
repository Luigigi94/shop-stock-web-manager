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
  <Dialog v-model:visible="categoryStore.categoryUiState.isModalVisible" :style="{width: '450px'}" header="Category Details" :modal="true">
    <section>
      <FormComponent />
    </section>
  </Dialog>
  <section>
    <TableDataComponent :datos="categoryStore.allCategories"/>
  </section>
</template>
<style scoped>

</style>
