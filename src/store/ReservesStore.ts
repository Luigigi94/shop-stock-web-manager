import {defineStore} from "pinia";
import {ReserveRepository} from "@/repositories/ReserveRepository";
import {useProductStore} from "@/store/ProductStore";
import type {Unsubscribe} from "firebase/firestore";
import {Reserves} from "@/types/models/Reserves";
import {Timestamp} from "firebase/firestore";
import {computed, ref} from "vue";
import {useClientStore} from "@/store/ClientStore";

export const useReservesStore = defineStore("ReservesStore", () => {
    const productStore = useProductStore();

    let stopListener: Unsubscribe | null = null;
    const enrichedReservesData = computed(() => {
        return allReserves.value.map(reserve => {
            const client = useClientStore().allClients.find(
                (cli) => cli.idClient === reserve.idClient
            )
            const product = useProductStore().productsWithCategoryName.find(
                (prod) => prod.idProduct === reserve.idProduct
            )

            return {
                ...reserve,
                clientData: client,
                productData: product,
            }
        })
    })
    const allReserves = ref<Reserves[]>([])
    interface ReservesUiState extends Reserves {
        isModalOpen: boolean;
        isLoading: boolean,
        isEdit: boolean,
        success: boolean,
        errorMessage: string | null,
    }
    const reserveUiState = ref<ReservesUiState>({
        idReserves: "",
        idClient: "",
        idProduct: "",
        priceAtReserve: 0,
        qtyReserve: 0,
        originalQty: 0,
        amount: 0,
        reservedAt: null,
        endReserve: null,
        isModalOpen: false,
        isLoading: false,
        isEdit: false,
        success: false,
        errorMessage: null
    })
    function openModalReserve(){
        reserveUiState.value.isModalOpen = true;

    }
    function clear() {
        if (stopListener) {
            stopListener();
            stopListener = null;
        }
    }
    function getAllReserves() {
        reserveUiState.value.isLoading = true;

        if(stopListener) {
            clear()
        }

        stopListener = ReserveRepository.getAllReserves((newList) => {
            allReserves.value = newList;
            reserveUiState.value.isLoading = false;
        })
    }

    function createReserveObject(idReserveGenerated: string = "") {
        return {
            idReserves: idReserveGenerated || reserveUiState.value.idReserves,
            idClient: reserveUiState.value.idClient,
            idProduct: reserveUiState.value.idProduct,
            reservedAt: idReserveGenerated.length > 0 ? Timestamp.now() : reserveUiState.value.reservedAt,
            endReserve: reserveUiState.value.endReserve,
            priceAtReserve: reserveUiState.value.priceAtReserve,
            qtyReserve: reserveUiState.value.qtyReserve,
            originalQty: reserveUiState.value.originalQty,
            amount: reserveUiState.value.amount,

        }
    }

    function initialRequest() {
        reserveUiState.value.isLoading = true;
        reserveUiState.value.errorMessage = null;
        reserveUiState.value.success = false
    }
    function requestOk() {
        reserveUiState.value.isLoading = false;
        reserveUiState.value.isModalOpen = false;
        reserveUiState.value.success = true
    }

    async function addReserve(): Promise<Boolean> {
        try {
            const idReserveGenerated = crypto.randomUUID()

            const reserveData = createReserveObject(idReserveGenerated);

            initialRequest();
            const isSaved = await ReserveRepository.addReserve(reserveData)
            if (isSaved) {
                requestOk()
                return true
            }
            return false
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async function reserveById(idReserve: string): Promise< Reserves|null> {
        initialRequest()
        try{
            const reserve = await ReserveRepository.getReserveById(idReserve);
            if (reserve) {
                reserveUiState.value.idReserves = reserve.idReserves;
                reserveUiState.value.idReserves = reserve.idReserves
                reserveUiState.value.idClient = reserve.idClient
                reserveUiState.value.idProduct = reserve.idProduct
                reserveUiState.value.reservedAt = reserve.reservedAt
                reserveUiState.value.endReserve = reserve.endReserve
                reserveUiState.value.priceAtReserve = reserve.priceAtReserve
                reserveUiState.value.qtyReserve = reserve.qtyReserve
                reserveUiState.value.originalQty = reserve.originalQty
                reserveUiState.value.amount = reserve.amount
                requestOk()
                return reserve
            }
            return null
        } catch (e: any) {
            console.error(e.message)
            return null
        }
    }

    async function updateReserve(): Promise<Boolean> {
        initialRequest()
        const reserveUpdated = createReserveObject()

        try {
            const isUpdated = await ReserveRepository.updateReserve(reserveUpdated)
            if (isUpdated) {
                requestOk()
                return true
            }
            return false
        } catch (e: any) {
            console.error(e.message)
            return false
        }
    }

    async function deleteReserve(idReserve: string): Promise<Boolean> {
        try {
            initialRequest()
            const isDeleted = await ReserveRepository.deleteReserve(idReserve);
            if (isDeleted) {
                requestOk()
                return true
            }
            return false
        } catch (e: any) {
            console.error(e.message)
            return false
        }
    }

    function clearState() {
        const currentState = reserveUiState.value;

        // 1. Identificadores y Relaciones
        currentState.idReserves = "";
        currentState.idClient = "";
        currentState.idProduct = "";

        // 2. Fechas (Reseteadas a null como el modelo manda)
        currentState.reservedAt = null;
        currentState.endReserve = null;

        // 3. Valores Numéricos
        currentState.priceAtReserve = 0;
        currentState.qtyReserve = 0;
        currentState.originalQty = 0;
        currentState.amount = 0;

        // 4. Banderas de la Interfaz (UI State)
        currentState.isModalOpen = false;
        currentState.isLoading = false;
        currentState.isEdit = false;
        currentState.success = false;
        currentState.errorMessage = null;

        console.log("🧹 State de Reservas: ¡Tabula Rasa! Todo en default y null.");
    }

    return {
        reserveUiState,
        allReserves,
        enrichedReservesData,
        getAllReserves,
        openModalReserve,
        addReserve,
        updateReserve,
        deleteReserve,
        reserveById,
        clearState
    }
})