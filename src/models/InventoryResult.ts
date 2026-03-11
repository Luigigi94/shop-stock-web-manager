export type InventoryResult =
    | { type: 'IDLE' }
    | { type: 'LOADING' }
    | { type: 'SUCCESS' }
    | { type: 'ERROR'; message: string };