import { CakeBuilder } from "./model/builders/cake.builder";
import { BookBuilder } from "./model/builders/book.builder";
import { ToyBuilder } from "./model/builders/toy.builder";

function main() {
  // Build a Cake
  const cake = new CakeBuilder()
    .setType("Birthday")
    .setFlavor("Vanilla")
    .setFilling("Strawberry")
    .setSize("Medium")
    .setLayers("2")
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Vanilla")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Rainbow")
    .setCustomMessage("Happy Birthday!")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Box")
    .build();

  console.log("Cake built:", cake);

  // Build a Book
  const book = new BookBuilder()
    .setTitle("Dune")
    .setAuthor("Frank Herbert")
    .setGenre("Sci-Fi")
    .setFormat("Hardcover")
    .setLanguage("EN")
    .setPublisher("Chilton")
    .setSpecialEdition("None")
    .setPackaging("Shrinkwrap")
    .build();

  console.log("Book built:", book);

  // Build a Toy
  const toy = new ToyBuilder()
    .setType("Robot")
    .setAgeGroup("6+")
    .setBrand("RoboCo")
    .setMaterial("Plastic")
    .setBatteryRequired("Yes")
    .setEducational("STEM")
    .build();

  console.log("Toy built:", toy);
}

main();