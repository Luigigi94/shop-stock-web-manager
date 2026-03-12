export const NAVIGATE_MENU = {
    // HOME
    HOME: '/',

    // POS_OPTIONS
    SALES: '/pos/new-sale',
    PURCHASE: '/pos/purchase',
    RESERVES: '/pos/reserves',
    SALESBYUSER: '/pos/sales-by-user',

    // CATALOG_GROUP
    PRODUCT: '/catalog/products',
    CATEGORY: '/catalog/categories',
    CLIENT: '/catalog/clients',
    SUPPLIER: '/catalog/suppliers',

    // STOCK_GROUP
    SUPPLIER_PURCHASES: '/stock/supplier-purchases',
    INVENTORY_LIST: '/stock/inventory-list',

    // MORE_OPTIONS
    PROFILE: '/settings/profile',
    SETTINGS: '/settings/app-config'
} as const;

export type NavigateMenus = typeof NAVIGATE_MENU[keyof typeof NAVIGATE_MENU];