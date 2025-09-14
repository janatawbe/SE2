import { Item } from "./item.model";

export interface Order {
    getItems(): Item;
    getPrice(): number;
    getQuantity(): number;
    getId(): string;
}