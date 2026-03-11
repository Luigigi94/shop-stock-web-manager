import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {PurchaseItem} from "@/models/PurchaseItem";

export interface Cart {
    id: string
    userId: string
    clientId: string
    clientName: string
    items: PurchaseItem[]
    total: number,
    updatedAt?: Timestamp
    createdAt?: Timestamp
}
