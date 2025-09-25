import { IIdentifiableOrderItem } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
import { IIdentifiableItem } from "../../model/IItem";
import { ConnectionManager } from "./ConnectionManager";
import { SQLiteOrder, SQLiteOrderMapper } from "../../mappers/order.mapper";

const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        item_category TEXT NOT NULL,
        item_id TEXT NOT NULL
    );
`;

const INSERT_ORDER = `
    INSERT INTO orders (id, quantity, price, item_category, item_id)
    VALUES (?, ?, ?, ?, ?);
`;

const SELECT_ORDER_BY_ID = `
    SELECT * FROM orders WHERE id = ?;
`;

const SELECT_ALL_ORDERS = `
    SELECT * FROM orders WHERE item_category = ?;
`;

const UPDATE_ORDER_BY_ID = `
    UPDATE orders SET quantity = ?, price = ? WHERE id = ?;
`;

const DELETE_ORDER_BY_ID = `
    DELETE FROM orders WHERE id = ?;
`;

export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {
    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable) {
        
    }

    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE)
            this.itemRepository.init();
            logger.info("Order table ensured in database.");
        } catch (error: unknown) {
            logger.error("Failed to initialize Order table:", error as Error);
            throw new InitializationException("Failed to initialize Order table", error as Error);
        }
    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        // Transaction:
            // Insert data into cake table
            // Insert data into order table
        // Commit transaction
        // Return the order ID
        // If error, log and rollback transaction
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.exec("BEGIN TRANSACTION");
            const item_id = await this.itemRepository.create(order.getItem());
            conn.run(INSERT_ORDER, [order.getId(), order.getQuantity(), order.getPrice(), order.getItem().getCategory(), item_id]);
            conn.exec("COMMIT");
            return order.getId();
        } catch (error: unknown) {
            logger.error("Failed to create order:", error);
            conn && conn.exec("ROLLBACK");
            throw new DbException("Failed to create order", error as Error);
        }
    }

    async get(id: id): Promise<IIdentifiableOrderItem> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLiteOrder>(SELECT_ORDER_BY_ID, id);
            if (!result) {
                logger.error(`Order with id ${id} not found`);
                throw new Error(`Order with id ${id} not found`);
            }
            const item = await this.itemRepository.get(result.item_id);
            return new SQLiteOrderMapper().map({data: result, item}); 
        } catch (error: unknown) {
            logger.error("Failed tp get order of id", id, ":", error as Error);
            throw new DbException(`Failed to get order of id ${id}:`, error as Error);
        }
    }

    async getAll(): Promise<IIdentifiableOrderItem[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();
            if (items.length === 0) {
                return [];
            }
            const orders = await conn.all<SQLiteOrder[]>(SELECT_ALL_ORDERS, items[0].getCategory());
            // Bind orders to items
            const bindedOrders = orders.map(order => {
                const item = items.find(i => i.getId() === order.item_id);
                if (!item) {
                    throw new Error(`Item with id ${order.item_id} not found for order ${order.id}`);
                }
                return {order, item};
            });

            // For each binded order and item, map it into an identifiable order
            const mapper = new SQLiteOrderMapper();
            const identifiableOrders = bindedOrders.map(({order, item}) => {
                return mapper.map({data: order, item});
            });

            return identifiableOrders;
        } catch (error) {
            logger.error("Failed to get all orders:", error as Error);
            throw new DbException("Failed to get all orders", error as Error);
        }
    }

    async update(order: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.update(order.getItem());
            await conn.run(UPDATE_ORDER_BY_ID, [
                order.getQuantity(),
                order.getPrice(),
                order.getId(),
                order.getItem().getId(),
                order.getItem().getCategory()
            ]);
            conn.exec("COMMIT");
        } catch (error) {
            logger.error("Failed to update order of id", order.getId(), ":", error as Error);
            conn && conn.exec("ROLLBACK");
            throw new DbException(`Failed to update order of id ${order.getId()}:`, error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.exec("BEGIN TRANSACTION");
            await this.itemRepository.delete(id);
            await conn.run(DELETE_ORDER_BY_ID, id);
            conn.exec("COMMIT");
        } catch (error) {
            logger.error("Failed to delete order of id", id, ":", error as Error);
            conn && conn.exec("ROLLBACK");
            throw new DbException(`Failed to delete order of id ${id}:`, error as Error);
        }
    }
}