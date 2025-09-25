import { IdentifiableCake } from "../../model/cake.model";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/cake.mapper";

const tableName = ItemCategory.CAKE;

const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        flavor TEXT NOT NULL,
        filling TEXT NOT NULL,
        size TEXT NOT NULL,
        layers TEXT NOT NULL,
        frosting_type TEXT NOT NULL,
        frosting_flavor TEXT NOT NULL,
        decoration_type TEXT NOT NULL,
        decoration_color TEXT NOT NULL,
        custom_message TEXT,
        shape TEXT NOT NULL,
        allergies TEXT,
        special_ingredients TEXT,
        packaging_type TEXT NOT NULL
    );
`;

const INSERT_CAKE = `
    INSERT OR IGNORE INTO ${tableName} (id, type, flavor, filling, size, layers, frosting_type, frosting_flavor, decoration_type, decoration_color, custom_message, shape, allergies, special_ingredients, packaging_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

const SELECT_CAKE_BY_ID = `
    SELECT * FROM ${tableName} WHERE id = ?;
`;

const SELECT_ALL_CAKES = `
    SELECT * FROM ${tableName};
`;

const UPDATE_CAKE_BY_ID = `
    UPDATE ${tableName} SET type = ?, flavor = ?, filling = ?, size = ?, layers = ?, frosting_type = ?, frosting_flavor = ?, decoration_type = ?, decoration_color = ?, custom_message = ?, shape = ?, allergies = ?, special_ingredients = ?, packaging_type = ? WHERE id = ?;
`

const DELETE_CAKE_BY_ID = `
    DELETE FROM ${tableName} WHERE id = ?;
`;

export class CakeRepository implements IRepository<IdentifiableCake>, Initializable {

    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("Cake table ensured in database.");
        } catch (error: unknown) {
            logger.error("Failed to initialize Cake table:", error as Error);
            throw new InitializationException("Failed to initialize Cake table", error as Error);
        }
    }

    async create(item: IdentifiableCake): Promise<id> {
        // It is expected that a transaction has been initiated before calling this method
        try {
            const conn = await ConnectionManager.getConnection();
            conn.run(INSERT_CAKE, [item.getId(), item.getType(), item.getFlavor(), item.getFilling(), item.getSize(), item.getLayers(), item.getFrostingType(), item.getFrostingFlavor(), item.getDecorationType(), item.getDecorationColor(), item.getCustomMessage(), item.getShape(), item.getAllergies(), item.getSpecialIngredients(), item.getPackagingType()]);
            return item.getId();
        } catch (error: unknown) {
            logger.error("Failed to create cake:", error);
            throw new DbException("Failed to create cake", error as Error);
        }
    }

    async get(id: id): Promise<IdentifiableCake> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLiteCake>(SELECT_CAKE_BY_ID, id);
            if (!result) {
                throw new ItemNotFoundException(`Cake with id ${id} not found`);
            }
            return new SQLiteCakeMapper().map(result); 
        } catch (error: unknown) {
            logger.error("Failed tp get cake of id", id, ":", error as Error);
            throw new DbException(`Failed to get cake of id ${id}:`, error as Error);
        }
    }

    async getAll(): Promise<IdentifiableCake[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.all<SQLiteCake[]>(SELECT_ALL_CAKES);
            const mapper = new SQLiteCakeMapper();
            return result.map((cake) => mapper.map(cake)); 
        } catch (error: unknown) {
            logger.error("Failed to get all cakes:", error as Error);
            throw new DbException("Failed to get all cakes:", error as Error);
        }
    }

    async update(item: IdentifiableCake): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_CAKE_BY_ID, [
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getId()
            ]);
        } catch (error) {
            logger.error("Failed to update cake of id", item.getId(), ":", error as Error);
            throw new DbException(`Failed to update cake of id ${item.getId()}:`, error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(DELETE_CAKE_BY_ID, id);
        } catch (error) {
            logger.error("Failed to delete cake of id", id, ":", error as Error);
            throw new DbException(`Failed to delete cake of id ${id}:`, error as Error);
        }
    }
}