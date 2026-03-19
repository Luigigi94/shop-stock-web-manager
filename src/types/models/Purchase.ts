import {PurchaseItem} from "@/types/models/PurchaseItem";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface Purchase {
    id:  string
    clientId: string
    clientName: string
    items: PurchaseItem[]
    total: number
    createdAt: Timestamp
    userId:  string
}