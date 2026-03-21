<script setup lang="ts">
import {SupplierPurchase} from "@/types/models/SupplierPurchase";
import {Accordion} from "primevue";
import {AccordionPanel} from "primevue";
import {AccordionHeader} from "primevue";
import {AccordionContent} from "primevue";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Column from "primevue/column";
import Button from "primevue/button";
import {Toolbar} from "primevue";
import {useI18n} from "vue-i18n";
import {SupplierPurchaseUiState} from "@/types/ui/SupplierPurchaseUiState";
import {useSupplierCartStore} from "@/store/SupplierCartStore";
import {ref} from "vue";
const cartStore = useSupplierCartStore();

const {t} = useI18n();
const dt = ref();
const selectedProducts = ref();

const props = defineProps<{
  datos: SupplierPurchaseUiState
}>()

function alertaEliminar(){
  alert("Eliminar");
}

const handleSingleDelete = async (id: string) => {
  cartStore.state.success = false
  const cartItems = await cartStore.removeItem(id)


}
</script>

<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>Nota de compra Proveedor: {{props.datos.supplierName}}</AccordionHeader>
      <AccordionContent>
        <Toolbar class="mb-6">
          <template #start>
            <Button :label="t('formsGeneric.supplier.addProd')" icon="pi pi-plus" severity="secondary" class="mr-2" @click="cartStore.openNewSupplierPurchase()" />
            <Button :label="t('formsGeneric.delete', {item: t('entityName.product')})" icon="pi pi-trash" severity="secondary" class="mr-2" @click="alertaEliminar()" />
          </template>
          <template #end>
            <Button :label="t('cart.confirm')" icon="pi pi-check-circle" severity="primary" class="mr-2" @click="alertaEliminar()" />
          </template>
        </Toolbar>
        <DataTable
            ref="dt"
            v-model:selection="selectedProducts"
            :value="datos.items"
            data-key="productId"
            :paginator="true"
            :rows="10"
            responsiveLayout="stack"
            breakpoint="960px"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :currentPageReportTemplate="t('tableGeneric.currentPageReportTemplate')"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">Carrito</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search"></i>
                </InputIcon>
                <InputText placeholder="Searchs"></InputText>
              </IconField>
            </div>
          </template>

          <Column selection-mode="multiple" style="width: 3rem"></Column>
          <Column field="productName" :header="t('formsGeneric.name')" sortable style="min-width: 12rem"></Column>
          <Column field="cost" :header="t('formsGeneric.product.cost')"></Column>
          <Column field="quantity" :header="t('formsGeneric.product.qty')"></Column>
          <Column field="subtotal" :header="t('tableGeneric.subtotal')"></Column>
          <Column style="min-width: 12rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="console.log('Edit: ',slotProps.data.productId)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger" @click="handleSingleDelete(slotProps.data.productId)" />
            </template>
          </Column>
        </DataTable>
<!--

        {{ props.datos.items }}
-->

      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<style scoped>

</style>

<!--        <p class="m-0">
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
                class="p-button-primary w-auto"
            />
          </div>
          <div class="stats-badge">
            {{ `${props.datos.items.length} ${t("tableGeneric.records")}` }}
          </div>
        </p>-->