"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cake_builder_1 = require("./model/builders/cake.builder");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const cakeBuilder = new cake_builder_1.CakeBuilder();
        cakeBuilder.setType("Birthday");
        cakeBuilder.setFlavor("Chocolate");
        cakeBuilder.setFilling("Vanilla Cream");
        cakeBuilder.setSize("12");
        cakeBuilder.setLayers("3");
        cakeBuilder.setFrostingType("Buttercream");
        cakeBuilder.setFrostingFlavor("Vanilla");
        cakeBuilder.setDecorationType("Edible Flowers");
        cakeBuilder.setDecorationColor("Pink");
        cakeBuilder.setCustomMessage("Happy Birthday, Alice!");
        cakeBuilder.setShape("Round");
        cakeBuilder.setAllergies("None");
        cakeBuilder.setSpecialIngredients("Organic Cocoa Powder");
        cakeBuilder.setPackagingType("Box with Ribbon");
        const cake = cakeBuilder.build();
        console.log(cake);
    });
}
main();
//# sourceMappingURL=index.js.map