export const COLLECTIONS = {
    CATEGORIES: 'Categories',
    PRODUCTS: 'Products',
    CLIENTS: 'Clients',
    SUPPLIERS: 'Suppliers',
    CART: 'Cart',
    PURCHASES: 'Purchases',
    INVENTORY_MOVEMENTS: "InventoryMovements",
    SUPPLIER_PURCHASES: "SupplierPurchases",
    SUPPLIER_CART: "SupplierCart"
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];