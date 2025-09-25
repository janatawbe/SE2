import { IIdentifiableItem, IItem } from "./IItem";
import { IIdentifiableOrderItem, IOrder } from "./IOrder";

export class Order implements IOrder {
    private item: IItem;
    private price: number;
    private quantity: number;
    private id: string;

    constructor(item: IItem, price: number, quantity: number, id: string) {
        this.item = item;
        this.price = price;
        this.quantity = quantity;
        this.id = id;
    }

    getItem(): IItem {
        return this.item;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getId(): string {
        return this.id;
    }  
}

export class IdentifiableOrderItem implements IIdentifiableOrderItem {
    constructor(private identifiableItem: IIdentifiableItem, private price: number, private quantity: number, private id: string) {
        
    }

    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getId(): string {
        return this.id;
    }
    getItem(): IIdentifiableItem {
        return this.identifiableItem;
    }
}