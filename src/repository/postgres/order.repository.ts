import { PostgresConnection } from "./PostgresConnection";
import { id, InitializableRepository } from "../IRepository";
import { IIdentifiableOrderItem } from "../../model/IOrder";
import { IIdentifiableItem } from "../../model/IItem";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { PostgresOrder, PostgresOrderMapper } from "../../mappers/order.mapper";
import { IRepository } from "../IRepository";

/**
 * OrderRepository works with an item repository (Book, Cake, Toy).
 * Each order has a foreign key to its item.
 */
export class OrderRepository implements InitializableRepository<IIdentifiableOrderItem> {
  private readonly itemRepository: IRepository<IIdentifiableItem> & { init(): Promise<void> };

  constructor(itemRepo: IRepository<IIdentifiableItem> & { init(): Promise<void> }) {
    this.itemRepository = itemRepo;
  }

  async init(): Promise<void> {
    try {
      await this.itemRepository.init(); // make sure item table exists first

      await PostgresConnection.getPool().query(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          quantity INTEGER NOT NULL,
          price INTEGER NOT NULL,
          item_category TEXT NOT NULL,
          item_id TEXT NOT NULL
        )
      `);

      logger.info("Orders table ensured in database.");
    } catch (err) {
      logger.error("Failed to initialize orders table:", err);
      throw new InitializationException("Failed to initialize orders table", err as Error);
    }
  }

  async create(order: IIdentifiableOrderItem): Promise<id> {
    const client = await PostgresConnection.getPool().connect();
    try {
      await client.query("BEGIN");

      // first ensure the item is stored
      const itemId = await this.itemRepository.create(order.getItem());

      await client.query(
        `INSERT INTO orders (id, quantity, price, item_category, item_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.getId(), order.getQuantity(), order.getPrice(), order.getItem().getCategory(), itemId]
      );

      await client.query("COMMIT");
      logger.info("Order created with id:", order.getId());
      return order.getId();
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("Failed to create order:", err);
      throw new DbException("Failed to create order", err as Error);
    } finally {
      client.release();
    }
  }

  async get(id: id): Promise<IIdentifiableOrderItem> {
    try {
      const result = await PostgresConnection.getPool().query<PostgresOrder>(
        `SELECT * FROM orders WHERE id = $1`,
        [id]
      );
      if (!result.rows || result.rows.length === 0) {
        throw new ItemNotFoundException(`Order with id ${id} not found`);
      }


      const row = result.rows[0];
      const item = await this.itemRepository.get(row.item_id);

      return new PostgresOrderMapper().map({ data: row, item });
    } catch (err) {
      if (err instanceof ItemNotFoundException) {
        throw err;  // rethrow so caller can handle this separately
      }
      logger.error("Failed to get order with id", id, err);
      throw new DbException(`Failed to get order with id ${id}`, err as Error);
    }
  }

  async getAll(): Promise<IIdentifiableOrderItem[]> {
    try {
      const result = await PostgresConnection.getPool().query<PostgresOrder>(`SELECT * FROM orders`);
      const mapper = new PostgresOrderMapper();

      // fetch all items from itemRepo
      const items = await this.itemRepository.getAll();

      return result.rows.map((row) => {
        const item = items.find(i => i.getId() === row.item_id);
        if (!item) {
          throw new Error(`Item with id ${row.item_id} not found for order ${row.id}`);
        }
        return mapper.map({ data: row, item });
      });
    } catch (err) {
      logger.error("Failed to get all orders:", err);
      throw new DbException("Failed to get all orders", err as Error);
    }
  }

  async update(order: IIdentifiableOrderItem): Promise<void> {
    const client = await PostgresConnection.getPool().connect();
    try {
      await client.query("BEGIN");

      await this.itemRepository.update(order.getItem());

      await client.query(
        `UPDATE orders
         SET quantity = $1, price = $2
         WHERE id = $3`,
        [order.getQuantity(), order.getPrice(), order.getId()]
      );

      await client.query("COMMIT");
      logger.info("Order updated with id:", order.getId());
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("Failed to update order with id", order.getId(), err);
      throw new DbException(`Failed to update order with id ${order.getId()}`, err as Error);
    } finally {
      client.release();
    }
  }

  async delete(id: id): Promise<void> {
    const client = await PostgresConnection.getPool().connect();
    try {
      await client.query("BEGIN");

      // get the order first to know item_id
      const result = await client.query<PostgresOrder>(
        `SELECT * FROM orders WHERE id = $1`,
        [id]
      );
      if (!result.rows || result.rows.length === 0) {
        throw new ItemNotFoundException(`Order with id ${id} not found`);
      }

      const row = result.rows[0];

      // delete order
      await client.query(`DELETE FROM orders WHERE id = $1`, [id]);

      // delete item (cascade manually)
      await this.itemRepository.delete(row.item_id);

      await client.query("COMMIT");
      logger.info("Order deleted with id:", id);
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("Failed to delete order with id", id, err);

      if (err instanceof ItemNotFoundException) {
        throw err;  // rethrow original error
      }
      throw new DbException(`Failed to delete order with id ${id}`, err as Error);
    } finally {
      client.release();
    }
  }
}
