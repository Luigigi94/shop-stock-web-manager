import firebase from "firebase/compat/app"
import Timestamp = firebase.firestore.Timestamp
import type { ReserveItem } from "@/types/models/ReserveItem";

export interface ReserveUiState {
    // Control de UI
    isLoading: boolean;
    isEdit: boolean;
    errorMessage: string | null;
    success: boolean;
    isCartOpen: boolean;       // Para el Drawer/Sidebar de los productos apartados
    isClientModalOpen: boolean; // Para cuando vas a elegir al cliente
    editingItemId: string | null;

    // Datos del Modelo (Reflejo de interface Reserves)
    id: string | null;
    clientId: string | null;
    clientName: string | null; // Metadata para la UI
    items: ReserveItem[];
    totalAmount: number;
    totalCostAtReserve: number; // El que dijimos para la auditoría
    isPaid: boolean;
    isDelivered: boolean;

    // Tiempos
    reservedAt: Timestamp | null;
    endReserve: Date | null;

    // Auditoría de Usuario
    userId: string | null;
    isActive: boolean;
}

export const getInitialReserveState = (): ReserveUiState => ({
    isLoading: false,
    isEdit: false,
    errorMessage: '',
    success: false,
    isCartOpen: false,
    isClientModalOpen: false,
    editingItemId: "",

    id: '',
    clientId: '',
    clientName: '',
    items: [],
    totalAmount: 0,
    totalCostAtReserve: 0,
    isPaid: false,
    isDelivered: false,

    reservedAt: null,
    endReserve: null,

    userId: '',
    isActive: true,
});