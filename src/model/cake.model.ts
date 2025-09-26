import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem, ItemCategory} from "./IItem";

export class Cake implements IItem {
    private type: string;
    private flavor: string;
    private filling: string;
    private size: string;
    private layers: string;
    private frostingType: string;
    private frostingFlavor: string;
    private decorationType: string;
    private decorationColor: string;
    private customMessage: string;
    private shape: string;
    private allergies: string;
    private specialIngredients: string;
    private packagingType: string;

    constructor(
        type: string,
        flavor: string,
        filling: string,
        size: string,
        layers: string,
        frostingType: string,
        frostingFlavor: string,
        decorationType: string,
        decorationColor: string,
        customMessage: string,
        shape: string,
        allergies: string,
        specialIngredients: string,
        packagingType: string,
    ) {
        this.type = type;
        this.flavor = flavor;
        this.filling = filling;
        this.size = size;
        this.layers = layers;
        this.frostingType = frostingType;
        this.frostingFlavor = frostingFlavor;
        this.decorationType = decorationType;
        this.decorationColor = decorationColor;
        this.customMessage = customMessage;
        this.shape = shape;
        this.allergies = allergies;
        this.specialIngredients = specialIngredients;
        this.packagingType = packagingType;
    }

    getCategory(): ItemCategory {
        return ItemCategory.CAKE;
    }

    getType(): string {
        return this.type;
    }
    getFlavor(): string {
        return this.flavor;
    }
    getFilling(): string {
        return this.filling;
    }
    getSize(): string {
        return this.size;
    }
    getLayers(): string {
        return this.layers;
    }
    getFrostingType(): string {
        return this.frostingType;
    }
    getFrostingFlavor(): string {
        return this.frostingFlavor;
    }
    getDecorationType(): string {
        return this.decorationType;
    }
    getDecorationColor(): string {
        return this.decorationColor;
    }
    getCustomMessage(): string {
        return this.customMessage;
    }
    getShape(): string {
        return this.shape;
    }
    getAllergies(): string {
        return this.allergies;
    }
    getSpecialIngredients(): string {
        return this.specialIngredients;
    }
    getPackagingType(): string {
        return this.packagingType;
    }
}

export class IdentifiableCake extends Cake implements IIdentifiableItem {
    constructor(
        private id: id,
        type: string,
        flavor: string,
        filling: string,
        size: string,
        layers: string,
        frostingType: string,
        frostingFlavor: string,
        decorationType: string,
        decorationColor: string,
        customMessage: string,
        shape: string,
        allergies: string,
        specialIngredients: string,
        packagingType: string,
    ) {
        super(
            type,
            flavor,
            filling,
            size,
            layers,
            frostingType,
            frostingFlavor,
            decorationType,
            decorationColor,
            customMessage,
            shape,
            allergies,
            specialIngredients,
            packagingType
        );
    }

    getId(): id {
        return this.id;
    }
}