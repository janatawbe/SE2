import logger from "./util/logger";
import { PostgresConnection } from "./repository/postgres/PostgresConnection";
import { RepositoryFactory, DBMode } from "./repository/Repository.factory";
import { ItemCategory } from "./model/IItem";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builders/cake.builder";
import { OrderBuilder, IdentifiableOrderItemBuilder } from "./model/builders/order.builder";

async function main() {
  await PostgresConnection.init();

  const cakeOrderRepo = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.CAKE);

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

  const identifiableCake = IdentifiableCakeBuilder.newBuilder()
    .setId("cake-2")
    .setCake(cake)
    .build();

  const order = OrderBuilder.newBuilder()
    .setId("order-2")
    .setItem(identifiableCake)
    .setPrice(50)
    .setQuantity(1)
    .build();

  const identifiableOrder = IdentifiableOrderItemBuilder.newBuilder()
    .setOrder(order)
    .setItem(identifiableCake)
    .build();

  await cakeOrderRepo.create(identifiableOrder);

  const allOrders = await cakeOrderRepo.getAll();
  console.log("Cake Orders:", JSON.stringify(allOrders, null, 2));
}

main().catch((err) => {
  logger.error("Error:", err);
  process.exit(1);
});