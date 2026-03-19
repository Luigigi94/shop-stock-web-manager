<script setup lang="ts">
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import {useToast} from "primevue/usetoast";
import {useI18n} from "vue-i18n";
import {useSupplierCartStore} from "@/store/SupplierCartStore";
import {storeToRefs} from 'pinia';
import { ref, watch } from 'vue';
import type { Products } from "@/types/models/Products";
import { useSupplierStore } from "@/store/SupplierStore";
import {ProductsRepository} from "@/repositories/ProductRepository";
import Button from "primevue/button";
import Popover from 'primevue/popover';
import {useProductStore} from "@/store/ProductStore";
import {Suppliers} from "@/types/models/Suppliers";
const productStore = useProductStore();
const supplierStore = useSupplierStore();
const op = ref();
const opSupplier = ref();
const quickName = ref('');
const quickSupplierName = ref('');
const toggleQuickAdd = (event: any) => {
  op.value.toggle(event);
};
const toggleQuickSupplier = (event: any) => {
  opSupplier.value.toggle(event);
};
const toast = useToast();
const {t} = useI18n();
const handleQuickSave = async () => {
  if (!quickName.value) return;

  // Seteamos el nombre en la store de productos antes de disparar el add
  productStore.productUiState.nameProduct = quickName.value;
  // Ojo: asegúrate de setear valores por defecto mínimos si tu store los requiere
  productStore.productUiState.stock = "0";
  productStore.productUiState.priceProduct = "0";

  await productStore.addProduct();

  if (productStore.productUiState.success) {
    toast.add({
      severity: 'success',
      summary: t('toastOptions.success'),
      detail: 'Producto creado',
      life: 3000
    });
    quickName.value = '';
    op.value.hide();
  }
};
const props = defineProps<{
  productsCatalog: Products[],
  suppliersCatalog: Suppliers[]
}>();

const cartSupplierStore = useSupplierCartStore();
const { state } = storeToRefs(cartSupplierStore);

const selectedProduct = ref<Products | null>(null);
const quantity = ref<number>(1);
const cost = ref<number>(0);

const handleQuickSupplierSave = async () => {
  if (!quickSupplierName.value) return;

  // Seteamos los valores mínimos requeridos en tu UI State de proveedores
  supplierStore.supplierUiState.name = quickSupplierName.value;
  // Campos por defecto para evitar errores de validación si tu store los pide
  supplierStore.supplierUiState.phone = "";
  supplierStore.supplierUiState.identifierAccount = "";
  supplierStore.supplierUiState.idBank = "";

  await supplierStore.addSupplier();

  if (supplierStore.supplierUiState.success) {
    toast.add({
      severity: 'success',
      summary: t('toastOptions.success'),
      detail: 'Proveedor creado',
      life: 3000
    });
    quickSupplierName.value = '';
    opSupplier.value.hide();

    // Si tu store actualiza el supplierId en el carrito automáticamente:
    // state.value.supplierId = ... (opcional)
  }
};

// 1. DECLARA LAS FUNCIONES PRIMERO
const resetLocalFields = () => {
  selectedProduct.value = null;
  quantity.value = 1;
  cost.value = 0;
};

// 2. LUEGO LOS WATCHERS
watch(() => state.value.editingItemId, (newId) => {
  if (!newId || newId === "") {
    resetLocalFields(); // Ahora sí existe cuando el watch corre al inicio
    return;
  }
  const productInCatalog = props.productsCatalog.find(p => p.idProduct === newId);
  const itemInCart = state.value.items.find(i => i.productId === newId);

  if (productInCatalog && itemInCart) {
    selectedProduct.value = productInCatalog;
    quantity.value = itemInCart.quantity;
    cost.value = itemInCart.cost;
  }
}, { immediate: true });

watch(selectedProduct, (newVal) => {
  if (newVal && !state.value.isEdit) {
    cost.value = Number(newVal.priceProduct) || 0;
    quantity.value = 1;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <label for="supplier" class="block font-bold mb-3">Proveedor</label>
      <div class="flex gap-2">
        <Select
            id="supplier"
            v-model="state.supplierId"
            :options="props.suppliersCatalog"
            optionLabel="name"
            optionValue="idSupplier"
            placeholder="Selecciona el proveedor..."
            :filter="true"
            :disabled="state.isEdit || state.items.length > 0"
            fluid
            class="flex-1"
        />
        <Button
            type="button"
            icon="pi pi-user-plus"
            class="p-button-outlined p-button-info"
            @click="toggleQuickSupplier"
            :disabled="state.isEdit || state.items.length > 0"
        />
      </div>

      <Popover ref="opSupplier">
        <div class="flex flex-col gap-3 w-[20rem]">
          <span class="font-medium block mb-2">Proveedor Rápido</span>
          <div class="flex flex-col gap-2">
            <label for="quickSupName" class="text-sm">Nombre / Razón Social</label>
            <InputText
                id="quickSupName"
                v-model="quickSupplierName"
                @keyup.enter="handleQuickSupplierSave"
                autofocus
                fluid
            />
          </div>
          <Button
              label="Guardar Proveedor"
              icon="pi pi-check"
              size="small"
              @click="handleQuickSupplierSave"
              :loading="supplierStore.supplierUiState.isLoading"
          />
        </div>
      </Popover>
      <small v-if="state.items.length > 0" class="text-gray-400 italic">No puedes cambiar de proveedor con items en el carrito.</small>
    </div>
    <div>
      <label for="product" class="block font-bold mb-3">Producto</label>
      <div class="flex gap-2">
        <Select
            id="product"
            v-model="selectedProduct"
            :options="props.productsCatalog"
            optionLabel="nameProduct"
            placeholder="Busca un producto..."
            :filter="true"
            filterPlaceholder="Filtrar por nombre..."
            :disabled="state.isEdit"
            fluid
            class="flex-1"
        >
          <template #option="slotProps">
            <div class="flex justify-between items-center w-full">
              <span>{{ slotProps.option.nameProduct }}</span>
              <span class="text-sm opacity-60">Stock: {{ slotProps.option.stock }}</span>
            </div>
          </template>
        </Select>

        <Button
            type="button"
            icon="pi pi-plus"
            class="p-button-outlined p-button-success"
            @click="toggleQuickAdd"
            v-tooltip.top="'Nuevo Producto Rápido'"
        />
      </div>

      <Popover ref="op">
        <div class="flex flex-col gap-3 w-[20rem]">
          <span class="font-medium block mb-2">Creación Rápida</span>
          <div class="flex flex-col gap-2">
            <label for="quickName" class="text-sm">Nombre del Producto</label>
            <InputText
                id="quickName"
                v-model="quickName"
                @keyup.enter="handleQuickSave"
                autofocus
                fluid
            />
          </div>
          <Button
              label="Guardar Producto"
              icon="pi pi-check"
              size="small"
              @click="handleQuickSave"
              :loading="productStore.productUiState.isLoading"
          />
        </div>
      </Popover>
    </div>

    <div>
      <label for="qty" class="block font-bold mb-3">Cantidad</label>
      <InputNumber
          id="qty"
          v-model.number="quantity"
          type="number"
          fluid
      />
      <small v-if="!quantity" class="text-red-500">Error quantity</small>
    </div>

    <div>
      <label for="cost" class="block font-bold mb-3">Costo</label>
      <InputNumber
          id="cost"
          v-model.number="cost"
          type="number"
          fluid
      />
      <small v-if="!cost" class="text-red-500">Error Costo</small>
    </div>

    <div class="flex gap-3 justify-end mt-4">
      <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="cartSupplierStore.state.isCartOpen = false"
      />
      <Button
          :label="state.isEdit ? 'Actualizar Item' : 'Agregar al Carrito'"
          icon="pi pi-shopping-cart"
          @click="cartSupplierStore.addSupplierPurchase(selectedProduct!, quantity, cost)"
          :loading="state.isLoading"
          :disabled="!selectedProduct"
      />
    </div>
  </div>
</template>

<style scoped>

</style>