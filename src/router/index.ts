import { createRouter, createWebHistory } from "vue-router";
import { NAVIGATE_MENU } from "@/constants/NavigateMenus";

// Vistas existentes (puedes ir creando las que faltan después)
import HomeView from "@/views/HomeView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import ProductsView from "@/views/ProductsView.vue";
import ClientsView from "@/views/ClientsView.vue";
import SuppliersView from "@/views/SuppliersView.vue";
import NewSaleView from "@/views/NewSaleView.vue";
import SupplierPurchaseView from "@/views/SupplierPurchaseView.vue";
import ReserveView from "@/views/ReserveView.vue";

// Nota: Para las rutas nuevas, puedes usar "Lazy Loading" para no saturar la app al inicio
const routes = [
    {
        path: NAVIGATE_MENU.HOME,
        name: "Home",
        component: HomeView
    },
    // --- GRUPO POS ---
    {
        path: NAVIGATE_MENU.SALES,
        name: "Sales",
        component: NewSaleView
    },
    {
        path: NAVIGATE_MENU.RESERVES,
        name: "Reserves",
        component: ReserveView
    },/*
    {
        path: NAVIGATE_MENU.SALESBYUSER,
        name: "SalesByUser",
        component: () => import("@/views/pos/SalesByUserView.vue")
    },*/
    // --- GRUPO CATALOG ---
    {
        path: NAVIGATE_MENU.CATEGORY,
        name: "Categories",
        component: CategoriesView,
    },
    {
        path: NAVIGATE_MENU.PRODUCT,
        name: "Products",
        component: ProductsView,
    },
    {
        path: NAVIGATE_MENU.CLIENT,
        name: "Clients",
        component: ClientsView,
    },
    {
        path: NAVIGATE_MENU.SUPPLIER,
        name: "Suppliers",
        component: SuppliersView,
    },
    // --- GRUPO STOCK ---
    {
        path: NAVIGATE_MENU.SUPPLIER_PURCHASES,
        name: "SupplierPurchases",
        component: SupplierPurchaseView
    }/*,
    {
        path: NAVIGATE_MENU.INVENTORY_LIST,
        name: "InventoryList",
        component: () => import("@/views/stock/InventoryListView.vue")
    },
    // --- GRUPO SETTINGS ---
    {
        path: NAVIGATE_MENU.PROFILE,
        name: "Profile",
        component: () => import("@/views/settings/ProfileView.vue")
    },
    {
        path: NAVIGATE_MENU.SETTINGS,
        name: "AppSettings",
        component: () => import("@/views/settings/AppSettingsView.vue")
    }*/
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;