import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface InventoryHeader{
    idHeaderInventory:  string
    userId:  string
    userName:  string
    createdAt?: Timestamp
    finishedAt?: Timestamp
    totalItemsCounted:  number
    totalDiscrepancies:  number
    notes:  string
}