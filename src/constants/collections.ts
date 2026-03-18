export const COLLECTIONS = {
    CATEGORIES: 'Categories',
    PRODUCTS: 'Products',
    CLIENTS: 'Clients',
    SUPPLIERS: 'Supplier',
    CART: 'Carts',
    PURCHASES: 'Purchases',
    INVENTORY_MOVEMENTS: "InventoryMovements"
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];