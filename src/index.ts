import logger from "./util/logger";
import { PostgresConnection } from "./repository/postgres/PostgresConnection";
import { OrderRepository } from "./repository/postgres/order.repository";  // Your Postgres order repo
import { CakeRepository } from "./repository/postgres/cake.repository";    // Postgres cake repo
import { BookRepository } from "./repository/postgres/book.repository";    // Postgres book repo
import { ToyRepository } from "./repository/postgres/toy.repository";      // Postgres toy repo

import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { BookBuilder, IdentifiableBookBuilder } from "./model/builders/book.builder";
import { ToyBuilder, IdentifiableToyBuilder } from "./model/builders/toy.builder";
import { OrderBuilder, IdentifiableOrderItemBuilder } from "./model/builders/order.builder";

async function main() {
  await PostgresConnection.init();
  // Initialize repositories
  const cakeRepo = new CakeRepository();
  const bookRepo = new BookRepository();
  const toyRepo = new ToyRepository();

  // Pass item repository dynamically to order repository
  // For demo, create separate order repos per item type:
  const cakeOrderRepo = new OrderRepository(cakeRepo);
  const bookOrderRepo = new OrderRepository(bookRepo);
  const toyOrderRepo = new OrderRepository(toyRepo);

  await Promise.all([cakeRepo.init(), bookRepo.init(), toyRepo.init()]);

  await Promise.all([cakeOrderRepo.init(), bookOrderRepo.init(), toyOrderRepo.init()]);

  // --- Create sample Cake Order ---
  const cake = CakeBuilder.newBuilder()
    .setType("Birthday")
    .setFlavor("Chocolate")
    .setFilling("Vanilla")
    .setSize("Medium")
    .setLayers("2")
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Chocolate")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Rainbow")
    .setCustomMessage("Happy Birthday!")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Box")
    .build();

  const idCake = IdentifiableCakeBuilder.newBuilder()
    .setId("cake-17")
    .setCake(cake)
    .build();

  const cakeOrder = OrderBuilder.newBuilder()
    .setId("order-1001")
    .setItem(idCake)
    .setPrice(50)
    .setQuantity(1)
    .build();

  const identifiableCakeOrder = IdentifiableOrderItemBuilder.newBuilder()
    .setOrder(cakeOrder)
    .setItem(idCake)
    .build();

  await cakeOrderRepo.create(identifiableCakeOrder);

  // --- Create sample Book Order ---
  const book = BookBuilder.newBuilder()
    .setTitle("The Great Gatsby")
    .setAuthor("F. Scott Fitzgerald")
    .setGenre("Novel")
    .setFormat("Hardcover")
    .setLanguage("English")
    .setPublisher("Scribner")
    .setSpecialEdition("Yes")
    .setPackaging("Standard")
    .build();

  const idBook = IdentifiableBookBuilder.newBuilder()
    .setId("book-42")
    .setBook(book)
    .build();

  const bookOrder = OrderBuilder.newBuilder()
    .setId("order-2002")
    .setItem(idBook)
    .setPrice(25)
    .setQuantity(2)
    .build();

  const identifiableBookOrder = IdentifiableOrderItemBuilder.newBuilder()
    .setOrder(bookOrder)
    .setItem(idBook)
    .build();

  await bookOrderRepo.create(identifiableBookOrder);

  // --- Create sample Toy Order ---
  const toy = ToyBuilder.newBuilder()
    .setType("Action Figure")
    .setAgeGroup("8+")
    .setBrand("FunToys")
    .setMaterial("Plastic")
    .setBatteryRequired("No")
    .setEducational("No")
    .build();

  const idToy = IdentifiableToyBuilder.newBuilder()
    .setId("toy-99")
    .setToy(toy)
    .build();

  const toyOrder = OrderBuilder.newBuilder()
    .setId("order-3003")
    .setItem(idToy)
    .setPrice(35)
    .setQuantity(1)
    .build();

  const identifiableToyOrder = IdentifiableOrderItemBuilder.newBuilder()
    .setOrder(toyOrder)
    .setItem(idToy)
    .build();

  await toyOrderRepo.create(identifiableToyOrder);

  // --- Fetch and log all orders for each repository ---
  console.log("Cake Orders:", await cakeOrderRepo.getAll());
  console.log("Book Orders:", await bookOrderRepo.getAll());
  console.log("Toy Orders:", await toyOrderRepo.getAll());

  logger.info("All sample orders created and retrieved successfully.");
}

main().catch((err) => {
  logger.error("Fatal error in main:", err);
  process.exit(1);
});
