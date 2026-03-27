import {defineStore} from "pinia";
import {ReserveRepository} from "@/repositories/ReserveRepository";
import {useProductStore} from "@/store/ProductStore";
import type {Unsubscribe} from "firebase/firestore";
import {Reserves} from "@/types/models/Reserves";
import {Timestamp} from "firebase/firestore";
import {computed, ref} from "vue";
import {useClientStore} from "@/store/ClientStore";
import {getInitialReserveState, ReserveUiState} from "@/types/ui/ReserveUiState";

export const useReservesStore = defineStore("ReservesStore", () => {
    const productStore = useProductStore();

    let stopListener: Unsubscribe | null = null;
    const enrichedReservesData = computed(() => {
        return allReserves.value.map(reserve => {
            const client = useClientStore().allClients.find(
                (cli) => cli.idClient === reserve.idClient
            )
            const product = reserve.items.map((item) =>{
                const infoProduct = productStore.productsWithCategoryName.find( productWC => productWC.idProduct === item.idProduct)

                return{
                    nameProduct: infoProduct?.nameProduct || 'Not Found',
                    imageProduct: infoProduct?.imageProduct || '',
                    category: infoProduct?.categoryName || '',
                }
            })

            return {
                ...reserve,
                clientData: client,
                productData: product,
            }
        })
    })
    const allReserves = ref<Reserves[]>([])
    const reserveUiState = ref<ReserveUiState>(getInitialReserveState())

    const clearState = () =>{
        reserveUiState.value = getInitialReserveState()
    }
    function openModalReserve(){
        reserveUiState.value.isCartOpen = true;

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
        const state = reserveUiState.value;

        return {
            idReserves: idReserveGenerated || state.id || "",
            idClient: state.clientId || "",
            items: [...state.items],
            reservedAt: idReserveGenerated.length > 0 ? Timestamp.now() : state.reservedAt,
            endReserve: state.endReserve,
            totalAmount: state.totalAmount,
            totalCostAtReserve: state.totalCostAtReserve,
            isPaid: state.isPaid,
            isDelivered: state.isDelivered,
            isActive: state.isActive
        };
    }

    function initialRequest() {
        reserveUiState.value.isLoading = true;
        reserveUiState.value.errorMessage = null;
        reserveUiState.value.success = false
    }
    function requestOk() {
        reserveUiState.value.isLoading = false;
        reserveUiState.value.isCartOpen = false;
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
                reserveUiState.value.id = reserve.idReserves
                reserveUiState.value.clientId = reserve.idClient
                reserveUiState.value.items = [...reserve.items]
                reserveUiState.value.reservedAt = reserve.reservedAt
                reserveUiState.value.endReserve = reserve.endReserve
                reserveUiState.value.totalAmount = reserve.totalAmount
                reserveUiState.value.totalCostAtReserve = Number(reserve.totalCostAtReserve)
                reserveUiState.value.isPaid = reserve.isPaid
                reserveUiState.value.isDelivered = reserve.isDelivered
                reserveUiState.value.isActive = reserve.isActive
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