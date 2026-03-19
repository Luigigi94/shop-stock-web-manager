import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
export interface UserSession {
    uuid:  string
    userName:  string
    role:  string
    email:  string,
    photoUrl:  string,
    lastLogin: Timestamp
}