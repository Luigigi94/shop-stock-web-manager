export const COLLECTIONS = {
    CATEGORIES: 'Categories',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];