
export type id = string;
export interface ID {
    getId(): id;
}

export interface Initializable {
    /**
     * init - Initializes the creation of required tables and establishes a connection.
     * 
     * @throws InitializationException - If initialization fails due to any error.
     * 
     * @returns A promise that resolves when initialization is complete.
    */
    init(): Promise<void>;
}

/**
 * Interface for a generic repository that handles CRUD operations for entities of type T.
 * 
 * @template T - The entity type, which must extend `ID`.
 */
export interface IRepository<T extends ID> {
    /**
     * Creates a new item in the repository.
     *
     * @param item - The item to be created.
     * @returns A promise that resolves to the ID of the newly created item.
     * @throws {InvalidItemException} When an invalid item is passed to `create`.
     * @throws {DbException} When a database error occurs during creation.
     */
    create(item: T): Promise<id>;

    /**
     * Retrieves an item by its ID.
     * 
     * @param id - The ID of the item to retrieve.
     * @returns A promise that resolves to the item with the specified ID.
     * @throws {ItemNotFoundException} When an item with the specified ID does not exist.
     * @throws {DbException} When a database error occurs during retrieval.
     */
    get(id: id): Promise<T>;

    /** 
     * Retrieves all items in the repository.
     * 
     * @returns A promise that resolves to an array of all items.
     * @throws {DbException} When a database error occurs during retrieval.
    */
    getAll(): Promise<T[]>;

    /**
     * Updates an existing item in the repository.
     * 
     * @param item - The item to be updated.
     * @returns A promise that resolves when the update is complete.
     * @throws {ItemNotFoundException} When an item with the specified ID does not exist.
     * @throws {InvalidItemException} When an invalid item is passed to `update`. 
     * @throws {DbException} When a database error occurs during the update.
     */
    update(item: T): Promise<void>;

    /**
     * Deletes an item by its ID.
     * 
     * @param id - The ID of the item to delete.
     * @returns A promise that resolves when the deletion is complete.
     * @throws {ItemNotFoundException} When an item with the specified ID does not exist. 
     * @throws {DbException} When a database error occurs during deletion.
     */
    delete(id: id): Promise<void>;
}

export interface InitializableRepository<T extends ID> extends IRepository<T>, Initializable {

}