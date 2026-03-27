import firebase from "firebase/compat/app"
import Timestamp = firebase.firestore.Timestamp
import {ReserveItem} from "@/types/models/ReserveItem";

export interface Reserves {
    idReserves: string
    idClient: string
    items: ReserveItem[]
    reservedAt: Timestamp | null
    endReserve: Date | null
    totalAmount: number;
    totalCostAtReserve: number
    isPaid: boolean;
    isDelivered: boolean;
    isActive: boolean
}