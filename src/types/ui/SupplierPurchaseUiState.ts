import { Timestamp } from "firebase/firestore";
import type { SupplierPurchaseItem } from "@/types/models/SupplierPurchaseItem";

export interface SupplierPurchaseUiState {
    isLoading: boolean;
    isEdit: boolean;
    errorMessage: string | null;
    success: boolean;
    id: string | null;
    supplierId: string | null;
    supplierName: string | null;
    items: SupplierPurchaseItem[];
    totalCost: number;
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
    userId: string | null;
    isCartOpen: boolean;
    editingItemId: string | null;
    isActive: boolean;
}
export const getInitialSupplierPurchaseState = (): SupplierPurchaseUiState => ({
    isLoading: false,
    isEdit: false,
    errorMessage: '',
    success: false,
    id: '',
    supplierId: '',
    supplierName: '',
    items: [],
    totalCost: 0,
    createdAt: null,
    updatedAt: null,
    userId: '',
    isCartOpen: false,
    editingItemId: "",
    isActive: true,
});