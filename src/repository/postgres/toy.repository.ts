import { PostgresConnection } from "./PostgresConnection";
import { IdentifiableToy } from "../../model/toy.model";
import { id, Initializable, IRepository } from "../IRepository";
import {
  DbException,
  InitializationException,
  InvalidItemException,
  ItemNotFoundException
} from "../../util/exceptions/repositoryExceptions";
import logger from "../../util/logger";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS toys (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteryRequired TEXT NOT NULL,
    educational TEXT NOT NULL
  );
`;

const INSERT_TOY = `
  INSERT INTO toys (id, type, ageGroup, brand, material, batteryRequired, educational)
  VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

const SELECT_TOY_BY_ID = `SELECT * FROM toys WHERE id = $1;`;
const SELECT_ALL_TOYS = `SELECT * FROM toys;`;

const UPDATE_TOY = `
  UPDATE toys
  SET type=$2, ageGroup=$3, brand=$4, material=$5, batteryRequired=$6, educational=$7
  WHERE id=$1;
`;

const DELETE_TOY = `DELETE FROM toys WHERE id = $1;`;

export class ToyRepository implements IRepository<IdentifiableToy>, Initializable {
  async init(): Promise<void> {
    try {
      await PostgresConnection.getPool().query(CREATE_TABLE);
      logger.info("Toy table ensured in database.");
    } catch (err) {
      logger.error("Failed to init Toy table", err);
      throw new InitializationException("Failed to init Toy table", err as Error);
    }
  }

  async create(item: IdentifiableToy): Promise<id> {
    if (!item) throw new InvalidItemException("Invalid Toy item");

    try {
      await PostgresConnection.getPool().query(INSERT_TOY, [
        item.getId(),
        item.getType(),
        item.getAgeGroup(),
        item.getBrand(),
        item.getMaterial(),
        item.getBatteryRequired(),
        item.getEducational()
      ]);

      logger.info("Created toy with id: %s", item.getId());
      return item.getId();
    } catch (err) {
      logger.error("Failed to create toy", err);
      throw new DbException("Failed to create toy", err as Error);
    }
  }

  async get(id: id): Promise<IdentifiableToy> {
    try {
      const result = await PostgresConnection.getPool().query(SELECT_TOY_BY_ID, [id]);
      if (result.rows.length === 0)
        throw new ItemNotFoundException(`Toy with id ${id} not found`);

      const row = result.rows[0];
      return new IdentifiableToy(
        row.id,
        row.type,
        row.agegroup,
        row.brand,
        row.material,
        row.batteryrequired,
        row.educational
      );
    } catch (err) {
      if (err instanceof ItemNotFoundException) throw err;

      logger.error("Failed to get toy", err);
      throw new DbException("Failed to get toy", err as Error);
    }
  }

  async getAll(): Promise<IdentifiableToy[]> {
    try {
      const result = await PostgresConnection.getPool().query(SELECT_ALL_TOYS);
      return result.rows.map((row) =>
        new IdentifiableToy(
          row.id,
          row.type,
          row.agegroup,
          row.brand,
          row.material,
          row.batteryrequired,
          row.educational
        )
      );
    } catch (err) {
      logger.error("Failed to get all toys", err);
      throw new DbException("Failed to get all toys", err as Error);
    }
  }

  async update(item: IdentifiableToy): Promise<void> {
    try {
      await PostgresConnection.getPool().query(UPDATE_TOY, [
        item.getId(),
        item.getType(),
        item.getAgeGroup(),
        item.getBrand(),
        item.getMaterial(),
        item.getBatteryRequired(),
        item.getEducational()
      ]);
    } catch (err) {
      logger.error("Failed to update toy", err);
      throw new DbException("Failed to update toy", err as Error);
    }
  }

  async delete(id: id): Promise<void> {
    try {
      await PostgresConnection.getPool().query(DELETE_TOY, [id]);
    } catch (err) {
      logger.error("Failed to delete toy", err);
      throw new DbException("Failed to delete toy", err as Error);
    }
  }
}
