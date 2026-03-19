import {defineStore} from "pinia";
import {CartRepository} from "@/repositories/CartRepository";
import {Timestamp, Unsubscribe} from "firebase/firestore";
import { Cart }from "@/types/models/Cart";
import {computed, ref} from "vue";
import {PurchaseItem} from "@/types/models/PurchaseItem";
import {useProductStore} from "@/store/ProductStore";
import {Purchase} from "@/types/models/Purchase";
import {InventoryMovement} from "@/types/models/InventoryMovements";
import {MovementType} from "@/constants/MovementType";


export const useCartStore = defineStore("CartStore", () => {
    const productStore = useProductStore();

    const allCartProducts = ref<Cart[]>([]);

    interface CartUiState extends Cart {
        isCartOpen: boolean;
    }

    const cartUiState = ref<CartUiState>({
        id: 'Luis Hernández' as string,
        userId: 'Luis Hernández' as string | null,
        clientId: '' as string | null,
        clientName: '' as string | null,
        items: [] as PurchaseItem[],
        total: 0 as number,
        updatedAt: null,
        createdAt: null,
        isCartOpen: false,
    })

    function openCart(){
        cartUiState.value.isCartOpen = true;
    }

    function clearCartState(){
        cartUiState.value.id = 'Luis Hernández' as string;
        cartUiState.value.userId = 'Luis Hernández' as string | null;
        cartUiState.value.clientId = '' as string | null;
        cartUiState.value.clientName = '' as string | null;
        cartUiState.value.items = [] as PurchaseItem[];
        cartUiState.value.total = 0 as number;
        cartUiState.value.updatedAt = null;
        cartUiState.value.createdAt = null;
        cartUiState.value.isCartOpen = false;
    }

    let stopListener: Unsubscribe | null = null;

    function getAllCartProducts() {
        if (stopListener) stopListener();

        stopListener = CartRepository.getAllCartProducts((newList) => {
            // newList es Cart[], pero nosotros solo queremos el carrito de este usuario
            // Supongamos que es el primero o lo filtramos por el ID del usuario
            // const myCart = newList[0];
            allCartProducts.value = newList;
            console.log("Valor de newList: "+newList.toString());
            const myCart = newList.find(c => c.id === 'Luis Hernández');
            console.log(myCart);

            if (myCart) {
                /*cartUiState.value = {
                    ...cartUiState.value, // mantenemos valores por defecto como isCartOpen
                    id: "Luis Hernández",
                    userId: "Luis Hernández",
                    clientId: myCart.clientId,
                    clientName: myCart.clientName,
                    items: myCart.items,
                    total: myCart.total,
                };*/
                cartUiState.value.items = myCart.items;
                cartUiState.value.total = myCart.total;
                cartUiState.value.userId = myCart.userId;
                cartUiState.value.id = myCart.id;
            }
        });
        console.log("currentState", cartUiState.value);
    }

    async function removeItem(productId: string): Promise<void> {
        // 1. Buscamos en el estado ACTUAL lo que queremos quitar
        const lengthCart = cartUiState.value.items.length;
        console.log("revisando longitud del carrito "+lengthCart)
        if (lengthCart > 1) {
            const currentItems = cartUiState.value.items;
            const updatedItems = currentItems.filter(item => item.productId !== productId);
            // LOG DE SEGURIDAD: Si esto sale 0, el ID enviado está mal
            console.log("Items después del filtro:", updatedItems.length);

            const nuevoTotal = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);

            const updatedCart: Cart = {
                // Usa 'id' y 'userId' exactamente como están en el documento de Firebase
                id: "Luis Hernández",
                userId: "Luis Hernández",
                clientId: cartUiState.value.clientId || '',
                clientName: "Luis Hernández",
                items: updatedItems,
                total: nuevoTotal
            };

            try {
                await CartRepository.saveCart(updatedCart);
                console.log("Firebase actualizado correctamente");
            } catch (e: any) {
                console.error("Error al borrar:", e.message);
            }
        } else {
            try {
                await CartRepository.deleteCart(cartUiState.value.id);
                clearCartState()
            } catch (error) {
                console.error("Error al borrar:", error);
            }
        }
    }
    async function addItemToCart(productId: string):Promise<void> {
        const prodStock = productStore.allProducts.find((p) => p.idProduct === productId);
        if (!prodStock) return
        const existingItem = cartUiState.value.items.findIndex(item => item.productId === productId);
        const currentQty = existingItem !== -1 ? cartUiState.value.items[existingItem].quantity : 0;

        const newTotalQty = currentQty + 1;
        console.log("Valor de newTotalQty "+newTotalQty);

        if (newTotalQty > prodStock.stock){
            console.log("Stock insuficiente")
            return
        }

        if (existingItem !== -1) {
            cartUiState.value.items = cartUiState.value.items.map((item, i) => {
                if (i === existingItem) {
                    const updatedQuantity = newTotalQty;
                    return {
                        ...item,
                        quantity: updatedQuantity,
                        subtotal: updatedQuantity * item.price, // Actualizamos subtotal
                    };
                }
                return item;
            });
            cartUiState.value.updatedAt = Timestamp.now();

        } else {
            const addedItem: PurchaseItem = {
                id: crypto.randomUUID(),
                productId: productId,
                productName: prodStock.nameProduct,
                imageProduct: prodStock.imageProduct ?? 'assets/no-image.png',
                price: prodStock.priceProduct,
                quantity: 1,
                subtotal: prodStock.priceProduct,
            }
            const updatedItems = [...cartUiState.value.items, addedItem];
            cartUiState.value = {
                ...cartUiState.value,
                items: updatedItems,
                // Recalculamos el total de forma segura
                total: updatedItems.reduce((acc, item) => acc + item.subtotal, 0),
                createdAt: Timestamp.now(), // Usar updatedAt es mejor que createdAt al añadir items
            };
        }
        try {
            await CartRepository.saveCart(cartUiState.value);
        } catch (error) {
            console.error(error);
        }
    }
    async function cleanCart(){
        try {
            await CartRepository.deleteCart(cartUiState.value.id);
            clearCartState()
        } catch (e: any) {
            console.log("Error al borrar:", e.message);
        }
    }

    function buildMovements(cart: Cart, purchaseId: string): Array<InventoryMovement>{
        return cart.items.map(item => ({
            id: crypto.randomUUID(),
            productId: item.productId,
            quantity: item.quantity,
            type: MovementType.SALE,
            reason: "Venta",
            referenceId: purchaseId,
            userId: cart.userId ?? "",
            createdAt: Timestamp.now(),
            amount: 0
        }))
    }

    async function confirmCart(): Promise<void> {
        const currentCart = cartUiState.value
        const purchaseId = crypto.randomUUID()
        let transaction: string = ""

        const purchase: Purchase = {
            id: purchaseId,
            clientId: currentCart.clientId ?? "",
            clientName: currentCart.clientName ?? "",
            createdAt: Timestamp.now(),
            items: currentCart.items ?? [],
            total: currentCart.total ?? 0,
            userId: currentCart.userId ?? "Luis Hernández",

        }

        const movements = buildMovements(currentCart, purchaseId);
        console.log("userId passed: "+purchase.userId)
        transaction = await CartRepository.confirmCartSale(currentCart, purchase, movements, purchase.userId.length != 0 ? purchase.userId : "Luis Hernández")

        if (transaction) {
            try {
                await cleanCart()
            } catch (error) {
                console.error("Error al borrar:", error);
            } finally {
            clearCartState()
                }
        }
    }

    return {
        allCartProducts,
        getAllCartProducts,
        cartUiState,
        openCart,
        removeItem,
        addItemToCart,
        clearCartState,
        cleanCart,
        confirmCart,
    }
})