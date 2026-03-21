import { defineStore } from "pinia";
import { ref } from "vue";
import {Timestamp, Unsubscribe} from "firebase/firestore";
import { SupplierPurchase } from "@/types/models/SupplierPurchase";
import { SupplierPurchaseItem } from "@/types/models/SupplierPurchaseItem";
import { getInitialSupplierPurchaseState } from "@/types/ui/SupplierPurchaseUiState";
import { Products } from "@/types/models/Products";
import { SupplierCartRepository } from "@/repositories/SupplierCartRepository";
import { SupplierRepository } from "@/repositories/SupplierRepository";

export const useSupplierCartStore = defineStore("SupplierCartStore", () => {
    const state = ref(getInitialSupplierPurchaseState());
    const editingItemId = ref<string | null>(null);
    const currentSupplierCart = ref<SupplierPurchase | null>(null);

    function editItem(item: SupplierPurchaseItem) {
        state.value.isEdit = true;
        editingItemId.value = item.productId;
    }

    let stopListener: Unsubscribe | null = null;
    function observeSupplierCart() {

        if (stopListener) stopListener();

        state.value.isLoading = true;

        const currentUserId = state.value.userId || 'Luis Hernández';

        stopListener = SupplierCartRepository.getAllSupplierCart(currentUserId, (myCart) => {
            if (myCart) {
                state.value = {
                    ...state.value,
                    id: myCart.id,
                    userId: myCart.userId,
                    supplierId: myCart.supplierId,
                    supplierName: myCart.supplierName,
                    items: myCart.items,
                    totalCost: myCart.totalCost,
                };
                console.log("Carrito sincronizado:", state.value);
            } else {
                state.value.items = [];
                state.value.totalCost = 0;
                console.log("No se encontró carrito activo en Firebase.");
            }

            state.value.isLoading = false;
        });
    }

    function stopCartSubscription() {
        if (stopListener) {
            stopListener();
            stopListener = null;
        }
    }
    function openNewSupplierPurchase(productId: string = ""){
        console.log("Abriendo Formulario")
        if (productId === "") {
            state.value.isEdit = false;
            state.value.editingItemId = "";
        } else {
            state.value.isEdit = true;
            state.value.editingItemId = productId;
        }

        state.value.isCartOpen = true;
    }

    const clearForm = () => {
        state.value = getInitialSupplierPurchaseState();
    }
    async function addSupplierPurchase(product: Products, quantity: number, cost: number): Promise<void> {
        // 1. Referencia reactiva (opcional, pero ayuda a la legibilidad)
        const currentState = state.value;

        const existingIndex = currentState.items.findIndex(item => item.productId === product.idProduct);

        if (existingIndex !== -1) {
            // UPDATE: Si ya existe, actualizamos cantidad y subtotal
            state.value.items = currentState.items.map((item, i) => {
                if (i === existingIndex) {
                    const newQty = item.quantity + quantity; // Ojo: ¿era + o -? En compra suele ser +
                    return {
                        ...item,
                        quantity: newQty,
                        cost: cost,
                        subtotal: newQty * cost
                    };
                }
                return item;
            });
        } else {
            const newItem: SupplierPurchaseItem = {
                id: crypto.randomUUID(),
                productId: product.idProduct,
                productName: product.nameProduct,
                quantity: quantity,
                cost: cost,
                subtotal: quantity * cost,
            };
            state.value.items.push(newItem);

            if (state.value.supplierId) {
                const supplierDetails = await SupplierRepository.getSupplierById(state.value.supplierId);
                state.value.supplierName = supplierDetails?.name!
            } else
                return
        }

        state.value.totalCost = state.value.items.reduce((acc, item) => acc + item.subtotal, 0);
        state.value.updatedAt = Timestamp.now();



        try {
            const dataToSave = cleanModelToSave();
            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );

            state.value.isEdit = false;
            state.value.isCartOpen = false;
        } catch (e: any) {
            console.error("Error al guardar el carrito:", e);
        }
    }

    async function updateItemQuantity(productId: string, quantity: number): Promise<void>{
        state.value.items = state.value.items.map (item => {
            if (item.productId === productId) {
                return {
                    ...item,
                    quantity: quantity,
                    subtotal: quantity * item.cost
                };
            }
            return item;
        })
        state.value.totalCost = state.value.items.reduce((acc, i) => acc + i.subtotal, 0);
        state.value.updatedAt = Timestamp.now();
        const dataToSave = cleanModelToSave();

        try {
            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );
        } catch (e) {
            console.error("Fallo al sincronizar con Firebase", e);
        }
    }

    async function removeItem(productId: string): Promise<string> {
        const updatedItems = state.value.items.filter(item => item.productId !== productId)
        state.value.items = updatedItems;
        state.value.totalCost = updatedItems.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
        state.value.updatedAt = Timestamp.now();

        try {
            const { isLoading, isEdit, errorMessage, success, isCartOpen, ...dataToSave } = state.value;

            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );

            return 'confirmed'
        } catch (error) {
            console.error("Error al sincronizar tras eliminar item:", error);
            return 'error'
        }
    }

    function cleanModelToSave() {
        const {
            isLoading, isEdit, errorMessage, success, isCartOpen,
            ...dataToSave
        } = state.value;
        return dataToSave;
    }

    return {
        clearForm,
        addSupplierPurchase,
        updateItemQuantity,
        openNewSupplierPurchase,
        observeSupplierCart,
        removeItem,
        state
    }
})