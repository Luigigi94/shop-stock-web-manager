import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface Products{
    idProduct: string
    nameProduct: string
    imageProduct?: string
    descriptionProduct?: string
    priceProduct: number
    statusProduct?: boolean
    idCategory: string
    createdAt?: Timestamp
    updatedAt?: Timestamp
    stock: number
    isValid: boolean
}