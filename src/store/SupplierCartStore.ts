import { defineStore } from "pinia";
import { ref } from "vue";
import {Timestamp, Unsubscribe} from "firebase/firestore";
import { SupplierPurchase } from "@/types/models/SupplierPurchase";
import { SupplierPurchaseItem } from "@/types/models/SupplierPurchaseItem";
import { getInitialSupplierPurchaseState } from "@/types/ui/SupplierPurchaseUiState";
import { Products } from "@/types/models/Products";
import { SupplierCartRepository } from "@/repositories/SupplierCartRepository";

export const useSupplierCartStore = defineStore("SupplierCartStore", () => {
    const state = ref(getInitialSupplierPurchaseState());
    const currentSupplierCart = ref<SupplierPurchase | null>(null);
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
    function openNewSupplierPurchase(){
        clearForm();
        state.value.isCartOpen = true
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
                        subtotal: newQty * item.cost
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
        }

        state.value.totalCost = state.value.items.reduce((acc, item) => acc + item.subtotal, 0);
        state.value.updatedAt = Timestamp.now();

        try {
            const dataToSave = cleanModelToSave();

            // 4. Guardado en el Repo
            // Aquí dataToSave ya no tiene los campos de UI
            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );

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

    async function removeItem(productId: string): Promise<void> {
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
        } catch (error) {
            console.error("Error al sincronizar tras eliminar item:", error);
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
    }
})