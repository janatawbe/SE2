import { PostgresConnection } from "./PostgresConnection";
import { InitializableRepository, id } from "../IRepository";
import { IdentifiableCake } from "../../model/cake.model";
import { DbException, InitializationException, ItemNotFoundException, InvalidItemException } from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS cakes (
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
    custom_message TEXT NOT NULL,
    shape TEXT NOT NULL,
    allergies TEXT NOT NULL,
    special_ingredients TEXT NOT NULL,
    packaging_type TEXT NOT NULL
  );
`;

const INSERT_CAKE = `
  INSERT INTO cakes (
    id, type, flavor, filling, size, layers,
    frosting_type, frosting_flavor,
    decoration_type, decoration_color,
    custom_message, shape, allergies,
    special_ingredients, packaging_type
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
  );
`;

const SELECT_BY_ID = `SELECT * FROM cakes WHERE id = $1;`;
const SELECT_ALL   = `SELECT * FROM cakes ORDER BY id;`;

const UPDATE_BY_ID = `
  UPDATE cakes SET
    type=$2, flavor=$3, filling=$4, size=$5, layers=$6,
    frosting_type=$7, frosting_flavor=$8,
    decoration_type=$9, decoration_color=$10,
    custom_message=$11, shape=$12, allergies=$13,
    special_ingredients=$14, packaging_type=$15
  WHERE id=$1;
`;

const DELETE_BY_ID = `DELETE FROM cakes WHERE id = $1;`;

type CakeRow = {
  id: string;
  type: string;
  flavor: string;
  filling: string;
  size: string;
  layers: string;
  frosting_type: string;
  frosting_flavor: string;
  decoration_type: string;
  decoration_color: string;
  custom_message: string;
  shape: string;
  allergies: string;
  special_ingredients: string;
  packaging_type: string;
};

export class CakeRepository implements InitializableRepository<IdentifiableCake> {

  async init(): Promise<void> {
    try {
      const pool = PostgresConnection.getPool();
      await pool.query(CREATE_TABLE);
      logger.info("Ensured 'cakes' table exists");
    } catch (err) {
      logger.error("Failed to initialize cakes table: %o", err);
      throw new InitializationException("Failed to initialize cakes table", err as Error);
    }
  }

  async create(item: IdentifiableCake): Promise<id> {
    if (!item) {
      throw new InvalidItemException("Invalid cake item.");
    }
    try {
      const pool = PostgresConnection.getPool();
      const values = [
        item.getId(),
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
      ];
      await pool.query(INSERT_CAKE, values);
      logger.info("Created cake with id: %s", item.getId());
      return item.getId();
    } catch (err) {
      logger.error("Failed to create cake: %o", err);
      throw new DbException("Failed to create cake", err as Error);
    }
  }

  async get(id: id): Promise<IdentifiableCake> {
    try {
      const pool = PostgresConnection.getPool();
      const res = await pool.query<CakeRow>(SELECT_BY_ID, [id]);
      const row = res.rows[0];
      if (!row) {
        throw new ItemNotFoundException(`Cake with id ${id} not found.`);
      }
      return new IdentifiableCake(
        row.id,
        row.type,
        row.flavor,
        row.filling,
        row.size,
        row.layers,
        row.frosting_type,
        row.frosting_flavor,
        row.decoration_type,
        row.decoration_color,
        row.custom_message,
        row.shape,
        row.allergies,
        row.special_ingredients,
        row.packaging_type
      );
    } catch (err) {
      if (err instanceof ItemNotFoundException) throw err;
      logger.error("Failed to get cake %s: %o", id, err);
      throw new DbException(`Failed to get cake of id ${id}`, err as Error);
    }
  }

  async getAll(): Promise<IdentifiableCake[]> {
    try {
      const pool = PostgresConnection.getPool();
      const res = await pool.query<CakeRow>(SELECT_ALL);
      return res.rows.map((row) => new IdentifiableCake(
        row.id,
        row.type,
        row.flavor,
        row.filling,
        row.size,
        row.layers,
        row.frosting_type,
        row.frosting_flavor,
        row.decoration_type,
        row.decoration_color,
        row.custom_message,
        row.shape,
        row.allergies,
        row.special_ingredients,
        row.packaging_type
      ));
    } catch (err) {
      logger.error("Failed to get all cakes: %o", err);
      throw new DbException("Failed to get all cakes", err as Error);
    }
  }

  async update(item: IdentifiableCake): Promise<void> {
    if (!item) {
      throw new InvalidItemException("Invalid cake item.");
    }
    try {
      const pool = PostgresConnection.getPool();
      const values = [
        item.getId(),
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
      ];
      const res = await pool.query(UPDATE_BY_ID, values);
      if (res.rowCount === 0) {
        throw new ItemNotFoundException(`Cake with id ${item.getId()} not found.`);
      }
      logger.info("Updated cake with id: %s", item.getId());
    } catch (err) {
      if (err instanceof ItemNotFoundException) throw err;
      logger.error("Failed to update cake %s: %o", item.getId(), err);
      throw new DbException(`Failed to update cake of id ${item.getId()}`, err as Error);
    }
  }

  async delete(id: id): Promise<void> {
    try {
      const pool = PostgresConnection.getPool();
      const res = await pool.query(DELETE_BY_ID, [id]);
      if (res.rowCount === 0) {
        throw new ItemNotFoundException(`Cake with id ${id} not found.`);
      }
      logger.info("Deleted cake with id: %s", id);
    } catch (err) {
      if (err instanceof ItemNotFoundException) throw err;
      logger.error("Failed to delete cake %s: %o", id, err);
      throw new DbException(`Failed to delete cake of id ${id}`, err as Error);
    }
  }
}