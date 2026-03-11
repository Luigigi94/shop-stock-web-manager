import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface InventoryCountItem {
    idProduct:  string
    productName:  string
    systemQuantity:  number
    countedQuantity:  number
    updatedAt?: Timestamp
}