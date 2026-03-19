import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface Suppliers {
    idSupplier: string
    name: string
    phone: string 
    identifierAccount: string 
    idBank: string
    createdAt?: Timestamp

}