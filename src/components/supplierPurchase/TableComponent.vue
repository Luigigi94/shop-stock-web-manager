<script setup lang="ts">
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import {ref} from "vue";
import {SupplierPurchaseUiState} from "@/types/ui/SupplierPurchaseUiState";
import { SupplierPurchase } from "@/types/models/SupplierPurchase";
import {useSupplierCartStore} from "@/store/SupplierCartStore";
import {useI18n} from "vue-i18n";
import Column from "primevue/column";

const expandedSuppliers = ref<Record<string, boolean>>({});
const expandedPurchases = ref<Record<string, boolean>>({});
const cartStore = useSupplierCartStore();
const {t} = useI18n();

const props = defineProps<{
  datos: SupplierPurchase[]
}>()

function expandAll() {
  expandedSuppliers.value = props.datos.reduce((acc, supplier) => {
    acc[supplier.id] = true;
    return acc;
  }, {} as Record<string, boolean>);
}

function collapseAll() {
  expandedSuppliers.value = {};
  expandedPurchases.value = {};
}
function formatCurrency(value: any) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-end gap-3 mb-6 w-full">
    <Button
        v-if="cartStore.state.items.length === 0"
        :label="t('formsGeneric.new_f', {item: t('formsGeneric.supplier.purchase')})"
        icon="pi pi-plus"
        @click="cartStore.openNewSupplierPurchase()"
        class="p-button-primary w-auto"
    />
  </div>
  <DataTable
      :value="datos"
      v-model:expandedRows="expandedSuppliers"
      dataKey="id"
  >
    <Column expander style="width: 3rem" />
    <Column field="supplierName" :header="t('entityName.supplier')" />
    <Column field="totalAccumulated" :header="t('tableGeneric.totalExpense')">
      <template #body="sp">{{ formatCurrency(sp.data.totalAccumulated) }}</template>
    </Column>

    <template #expansion="supplierSlot">
      <div class="p-3 surface-100 border-round">
        <h4 class="mb-3">{{ t('tableGeneric.historyName', {"supplierName": supplierSlot.data.supplierName}) }}</h4>

        <DataTable
            :value="supplierSlot.data.purchaseHistory"
            v-model:expandedRows="expandedPurchases"
            dataKey="id"
        >
          <Column expander style="width: 3rem" />
          <Column :header="t('tableGeneric.purchaseDate')">
            <template #body="p">
              {{ p.data.createdAt?.toDate().toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' }) }}
            </template>
          </Column>
          <Column field="totalCost" :header="t('tableGeneric.amount')">
            <template #body="p">{{ formatCurrency(p.data.totalCost) }}</template>
          </Column>

          <template #expansion="purchaseSlot">
            <div class="p-3 surface-card border-round shadow-2">
              <h5 class="mt-0">{{ `${t("tableGeneric.listedProd")} ${purchaseSlot.data.createdAt?.toDate().toLocaleDateString()}` }}</h5>
              <DataTable :value="purchaseSlot.data.items">
                <Column :header="t('formsGeneric.product.img')">
                  <template #body="item">
                    <img :src="item.data.productImageUrl" style="width: 40px" class="border-round" />
                  </template>
                </Column>
                <Column field="productName" :header="t('entityName.product')" />
                <Column field="quantity" :header="t('formsGeneric.product.qty')" />
                <Column field="subtotal" :header="t('tableGeneric.subtotal')" />
                <Column :header="t('tableGeneric.actions')">
                  <template #body="item">
                    <Button
                        icon="pi pi-ban"
                        class="p-button-rounded p-button-danger p-button-text"
                        @click="cancelarProducto(item.data)"
                        v-tooltip="'Cancelar producto'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </DataTable>
      </div>
    </template>
  </DataTable>
</template>

<style scoped>

</style>