import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {SupplierPurchaseItem} from "@/types/models/SupplierPurchaseItem";

export interface SupplierPurchase {
    id:  string
    supplierId:  string
    supplierName:  string
    items: SupplierPurchaseItem[]
    totalCost: number
    createdAt?: Timestamp
    updatedAt?: Timestamp
    userId: string
    isActive: boolean
}