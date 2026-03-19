import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {PurchaseItem} from "@/types/models/PurchaseItem";

export interface Cart {
    id: string
    userId: string | null
    clientId: string | null
    clientName: string | null
    items: PurchaseItem[]
    total: number,
    updatedAt?: Timestamp | null
    createdAt?: Timestamp | null
}
