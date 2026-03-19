import {MovementType} from "@/constants/MovementType";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface InventoryMovement {
    id: string;
    productId: string;
    quantity: number;
    amount: number;
    type: MovementType; // Aquí usamos el Enum
    reason: string;
    referenceId: string;
    userId: string;
    createdAt?: Timestamp | null;
}