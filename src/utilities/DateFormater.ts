import {Timestamp} from "firebase/firestore";

export const useDateFormatter = () => {
    const formatDateFull = (timestamp: Timestamp | any): string => {
        if (!timestamp) return "---"
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp.seconds * 1000);

        return date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
    }

    const formatDateOnly = (timestamp: Timestamp | any):string => {
        if (!timestamp) return "---"
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    return{
        formatDateFull,
        formatDateOnly,
    }
}