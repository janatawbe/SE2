import { ID, IRepository } from "../IRepository";
import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";
import { IOrder } from "model/IOrder";

export abstract class OrderRepository implements IRepository<IOrder> {
    protected abstract load(): Promise<IOrder[]>;

    protected abstract save(orders: IOrder[]): Promise<void>;

    async create(item: IOrder): Promise<string> {
        // Validat the item
        if (!item) {
            logger.error("Invalid order item:", item);
            throw new InvalidItemException("Invalid order item.");
        }

        // Load existing orders
        const orders = await this.load();

        // Add the new order
        const id = orders.push(item);

        // Save the updated orders
        await this.save(orders);
        logger.info("Order created with ID:", id.toString());

        // Return the ID of the newly created order
        return String(id);
    }

    async get(id: string): Promise<IOrder> {
        const orders = await this.load();
        const order = orders.find(o => o.getId() === id);
        if (!order) {
            logger.error("Failed to get order with ID:", id);
            throw new ItemNotFoundException(`Order with ID ${id} not found.`);
        }
        logger.info("Order retrieved with ID:", id);
        return order;
    }

    async getAll(): Promise<IOrder[]> {
        logger.info("Retrieving all orders");
        return this.load();
    }

    async update(item: IOrder): Promise<void> {
        if (!item) {
            logger.error("Invalid order item:", item);
            throw new InvalidItemException("Invalid order item.");
        }

        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === item.getId());
        if (index === -1) {
            logger.error("Failed to update order with ID:", item.getId());
            throw new ItemNotFoundException(`Order with ID ${item.getId()} not found.`);
        }

        orders[index] = item;
        await this.save(orders);
        logger.info("Order updated with ID:", item.getId());
    }

    async delete(id: string): Promise<void> {
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === id);
        if (index === -1) {
            logger.error("Failed to delete order with ID:", id);
            throw new ItemNotFoundException(`Order with ID ${id} not found.`);
        }
        orders.splice(index, 1);
        await this.save(orders);
        logger.info("Order deleted with ID:", id);
    }
}