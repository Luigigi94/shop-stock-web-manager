import {defineStore} from 'pinia'
import {ProductsRepository} from "@/repositories/ProductRepository";
import {useCategoryStore} from "@/store/CategoryStore";
import type {Unsubscribe} from "firebase/firestore";
import {Products} from "@/models/Products";
import {ref, computed} from "vue";
import {Timestamp} from "firebase/firestore";

export const useProductStore = defineStore("ProductStore", () => {
    const allProducts = ref<Products[]>([]);

    const productsWithCategoryName = computed(() => {
        return allProducts.value.map(product => {
            const category = useCategoryStore().allCategories.find(
                (cat) => cat.idCategory === product.idCategory
            )

            return {
                ...product,
                categoryName: category ? category.nameCategory : "Sin Categories",
            }
        })
    })

    function openNewProduct(){
        clear()
        productUiState.value.isModalVisible = true
    }

    const productUiState = ref({
        isLoading: false,
        isEdit: false,
        success: false,
        errorMessage: '' as string | null,

        idProduct: '' as string | null,
        nameProduct: '' as string | null,
        stock: '' as string | null,
        imageProduct: null as string | null,
        descriptionProduct: null as string | null,
        priceProduct: '' as string | null,
        statusProduct: false,
        idCategory: '' as string | null,
        createdAt: null as Timestamp | null,
        updatedAt: null as Timestamp | null,

        nameError: null as string | null,
        quantityError: null as string | null,
        priceError: null as string | null,
        idCategoryError: null as string | null,

        nameTouched: false,
        quantityTouched: false,
        priceTouched: false,
        idCategoryTouched: false,
        isModalVisible: false,

        isValid: false,
    })

    let stopListener: Unsubscribe | null = null;

    function getAllProducts() {
        const currentState = productUiState.value
        currentState.isLoading = true

        if (stopListener) stop()

        stopListener = ProductsRepository.getAllProducts((newList) => {
            allProducts.value = newList
            currentState.isLoading = false
        })
    }

    function clear() {
        if (stopListener) stopListener()
    }

    async function addProduct() {
        const idProdGenerated = crypto.randomUUID();
        const currentState = productUiState.value

        const product: Products = {
            idProduct: idProdGenerated,
            nameProduct: currentState.nameProduct ?? '',
            stock: Number(currentState.stock || 0),
            descriptionProduct: currentState.descriptionProduct ?? '',
            priceProduct: Number(currentState.priceProduct || 0),
            idCategory: currentState.idCategory ?? '',
            createdAt: Timestamp.now(),
        }
        currentState.isLoading = true
        currentState.errorMessage = null
        currentState.success = false

        try {
            await ProductsRepository.addProduct(product)
            currentState.isLoading = false
            currentState.success = true
            currentState.isModalVisible = false
        } catch (error: any) {
            currentState.isLoading = false
            currentState.errorMessage = error.message || "Error adding product"
        }
    }

    async function productById(id: string) {
        const currentState = productUiState.value
        currentState.isLoading = true
        try {
            const product = await ProductsRepository.getProductById(id)

            if (product) {
                currentState.isLoading = false

                currentState.idProduct = product.idProduct;
                currentState.nameProduct = product.nameProduct;
                currentState.stock = product.stock.toString();
                currentState.descriptionProduct = product.descriptionProduct ?? '';
                currentState.priceProduct = product.priceProduct.toString();
                currentState.idCategory = product.idCategory;

                return product
            }
            return null
        } catch (e: any) {
            currentState.isLoading = false
            currentState.errorMessage = e || "Error adding product";
        } finally {
            currentState.isLoading = false
        }
    }

    async function updateProduct(): Promise<void> {
        const currentState = productUiState.value
        const product: Products = {
            idProduct: currentState.idProduct ?? '',
            nameProduct: currentState.nameProduct ?? '',
            stock: Number(currentState.stock) ?? 0,
            descriptionProduct: currentState.descriptionProduct ?? '',
            priceProduct: Number(currentState.priceProduct) ?? '',
            idCategory: currentState.idCategory ?? '',
        }

        currentState.isLoading = true
        currentState.errorMessage = null
        currentState.success = false

        try {
            await ProductsRepository.updateProduct(product)

            currentState.isLoading = false
            currentState.success = true
        } catch (e: any) {
            currentState.isLoading = false
            currentState.errorMessage = e || "Error updating product"
        }
    }

    async function deleteProduct(id: string): Promise<void> {
        const currentState = productUiState.value
        currentState.isLoading = true
        currentState.errorMessage = null
        currentState.success = false
        try {
            await ProductsRepository.deleteProduct(id)
            currentState.isLoading = false
            currentState.success = true
        } catch (e: any) {
            currentState.isLoading = false
            currentState.errorMessage = e || "Error deleting product"
        }
    }

    function clearState() {
        const currentState = productUiState.value

        currentState.isEdit = false
        currentState.success = false
        currentState.errorMessage = ''
        currentState.idProduct = ''
        currentState.nameProduct = ''
        currentState.stock = ''
        currentState.imageProduct = null
        currentState.descriptionProduct = null
        currentState.priceProduct = ''
        currentState.statusProduct = false
        currentState.idCategory = ''
        currentState.createdAt = null
        currentState.updatedAt = null
        currentState.nameError = null
        currentState.quantityError = null
        currentState.priceError = null
        currentState.idCategoryError = null
        currentState.nameTouched = false
        currentState.quantityTouched = false
        currentState.priceTouched = false
        currentState.idCategoryTouched = false
        currentState.isValid = false
        currentState.isModalVisible = false
    }

    return {
        allProducts,
        clear,
        addProduct,
        productById,
        updateProduct,
        deleteProduct,
        getAllProducts,
        productUiState,
        productsWithCategoryName,
        clearState,
        openNewProduct
    }
})