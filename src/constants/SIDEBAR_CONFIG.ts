import {OptionsMenu} from "@/models/OptionsMenu";
import {NAVIGATE_MENU} from "@/constants/NavigateMenus";

export const SIDEBAR_CONFIG: Record<string, OptionsMenu[]> = {
    POS: [
        {
            label: 'entityName.cart',
            icon: 'pi pi-shopping-cart',
            route: NAVIGATE_MENU.PURCHASE,
            role: null,
            state: true,
            contentDescription: 'Icon New Purchase'
        },
        {
            label: 'entityName.reserves',
            icon: 'pi pi-ticket',
            route: NAVIGATE_MENU.RESERVES,
            role: null,
            state: true,
            contentDescription: 'Icon New Order'
        },
        {
            label: 'entityName.sales',
            icon: 'pi pi-chart-bar',
            route: NAVIGATE_MENU.SALESBYUSER,
            role: null,
            state: true,
            contentDescription: 'Icon Sales by User'
        }
    ],
    CATALOG: [
        {
            label: 'entityName.product',
            icon: 'pi pi-plus-circle',
            route: NAVIGATE_MENU.PRODUCT,
            role: null,
            state: true,
            contentDescription: 'Icon Add Product'
        },
        {
            label: 'entityName.category',
            icon: 'pi pi-folder',
            route: NAVIGATE_MENU.CATEGORY,
            role: null,
            state: true,
            contentDescription: 'Icon Add Category'
        },
        {
            label: 'entityName.client',
            icon: 'pi pi-user-plus',
            route: NAVIGATE_MENU.CLIENT,
            role: null,
            state: true,
            contentDescription: 'Icon Add Client'
        },
        {
            label: 'entityName.supplier',
            icon: 'pi pi-user',
            route: NAVIGATE_MENU.SUPPLIER,
            role: null,
            state: true,
            contentDescription: 'Icon Sales by User'
        }
    ],
    STOCK: [
        {
            label: 'entityName.supplierPurchases',
            icon: 'pi pi-truck',
            route: NAVIGATE_MENU.SUPPLIER_PURCHASES,
            role: null,
            state: true,
            contentDescription: 'Icon Sales by User'
        },
        {
            label: 'entityName.inventoryListed',
            icon: 'pi pi-box',
            route: NAVIGATE_MENU.INVENTORY_LIST,
            role: null,
            state: true,
            contentDescription: 'Icon Sales by User'
        }
    ],/*
    SETTINGS: [
        {
            label: 'menu_label_profile',
            icon: 'pi pi-user-edit',
            route: NAVIGATE_MENU.PROFILE,
            role: null,
            state: true,
            contentDescription: ''
        },
        {
            label: 'menu_label_app_settings',
            icon: 'pi pi-cog',
            route: NAVIGATE_MENU.SETTINGS,
            role: null,
            state: true,
            contentDescription: ''
        }
    ]*/
};