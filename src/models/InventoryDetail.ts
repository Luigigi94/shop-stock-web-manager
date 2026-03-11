import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface InventoryDetail {
    id:  string
    referenceId:  string
    productId:  string
    productName:  string
    systemQuantity:  number
    countedQuantity:  number
    difference:  number
    timestamp?: Timestamp
}