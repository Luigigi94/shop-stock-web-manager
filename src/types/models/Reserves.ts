import firebase from "firebase/compat/app"
import Timestamp = firebase.firestore.Timestamp

export interface Reserves {
    idReserves: string
    idClient: string
    idProduct: string
    reservedAt: Timestamp | null
    endReserve: Date | null
    priceAtReserve: number
    qtyReserve: number
    originalQty: number
    amount: number
}