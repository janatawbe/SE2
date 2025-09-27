import { ItemCategory } from "../model/IItem";
import { IRepository, Initializable } from "./IRepository";
import { OrderRepository } from "./postgres/order.repository";
import { CakeRepository } from "./postgres/cake.repository";
import { BookRepository } from "./postgres/book.repository";
import { ToyRepository } from "./postgres/toy.repository";

// Placeholder enum for DB modes (currently only POSTGRES)
export enum DBMode {
  POSTGRES = "POSTGRES",
  // SQLITE = "SQLITE",
  // FILE = "FILE",
}

export class RepositoryFactory {
  public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<any>> {
    switch (mode) {
      case DBMode.POSTGRES: {
        let repository: IRepository<any> & Initializable;
        switch (category) {
          case ItemCategory.CAKE:
            repository = new OrderRepository(new CakeRepository());
            break;
          case ItemCategory.BOOK:
            repository = new OrderRepository(new BookRepository());
            break;
          case ItemCategory.TOY:
            repository = new OrderRepository(new ToyRepository());
            break;
          default:
            throw new Error(`Unsupported item category: ${category}`);
        }

        await repository.init();
        return repository;
      }

      // case DBMode.SQLITE:
      //   throw new Error("SQLite mode not implemented yet.");

      // case DBMode.FILE:
      //   throw new Error("File mode not implemented yet.");

      default:
        throw new Error(`Unsupported DB mode: ${mode}`);
    }
  }
}