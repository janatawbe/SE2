import { IMapper } from "./IMapper";
import { OrderBuilder } from "../model/builders/order.builder";
import { IItem } from "../model/IItem";
import { IOrder } from "../model/IOrder";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
  constructor(private itemMapper: IMapper<string[], IItem>) {}

  map(data: string[]): IOrder {
    const item: IItem = this.itemMapper.map(data);
    return OrderBuilder.newBuilder()
      .setId(data[0])
      .setPrice(parseInt(data[data.length - 2]))
      .setQuantity(parseInt(data[data.length - 1]))
      .setItem(item)
      .build();
  }
}

export class JSONOrderMapper implements IMapper<any, IOrder> {
  constructor(private itemMapper: IMapper<any, IItem>) {}

  map(obj: any): IOrder {
    if (obj == null || typeof obj !== "object") {
      throw new Error("Malformed JSON order");
    }
    const itemSource = obj.item ?? obj; // if item is nested, use it; else assume flat
    const item = this.itemMapper.map(itemSource);

    return OrderBuilder.newBuilder()
      .setId(String(obj.id))
      .setPrice(Number(obj.price))
      .setQuantity(Number(obj.quantity))
      .setItem(item)
      .build();
  }
}

export class XMLOrderMapper implements IMapper<any, IOrder> {
  constructor(private itemMapper: IMapper<any, IItem>) {}

  map(node: any): IOrder {
    if (!node || typeof node !== "object") {
      throw new Error("Malformed XML order");
    }
    
    // if item is nested, use it; else assume flat
    const item = this.itemMapper.map(node);

    const id = String(node.OrderID ?? node.id ?? "");
    const price = Number(node.Price ?? node.price);
    const quantity = Number(node.Quantity ?? node.quantity);

    return OrderBuilder.newBuilder()
      .setId(id)
      .setPrice(price)
      .setQuantity(quantity)
      .setItem(item)
      .build();
  }
}