import { RepositoryFactory, DBMode } from "../../src/repository/Repository.factory";
import { ItemCategory } from "../../src/model/IItem";

// Mock init()
const mockInit = jest.fn().mockResolvedValue(undefined);

// Mock OrderRepository and sub-repositories
jest.mock("../../src/repository/postgres/order.repository", () => ({
  OrderRepository: jest.fn().mockImplementation(() => ({
    init: mockInit,
  })),
}));

jest.mock("../../src/repository/postgres/cake.repository", () => ({
  CakeRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../../src/repository/postgres/book.repository", () => ({
  BookRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../../src/repository/postgres/toy.repository", () => ({
  ToyRepository: jest.fn().mockImplementation(() => ({})),
}));

// Import mocks after jest.mock
import { OrderRepository } from "../../src/repository/postgres/order.repository";
import { CakeRepository } from "../../src/repository/postgres/cake.repository";
import { BookRepository } from "../../src/repository/postgres/book.repository";
import { ToyRepository } from "../../src/repository/postgres/toy.repository";

describe("RepositoryFactory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a Postgres Cake order repository and calls init()", async () => {
    const repo = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.CAKE);
    expect(repo).toBeDefined();
    expect(CakeRepository).toHaveBeenCalled(); // ✅ Cake repo constructed
    expect(OrderRepository).toHaveBeenCalledTimes(1); // ✅ Order repo created
    expect(mockInit).toHaveBeenCalled(); // ✅ init() called
  });

  it("creates a Postgres Book order repository and calls init()", async () => {
    const repo = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.BOOK);
    expect(repo).toBeDefined();
    expect(BookRepository).toHaveBeenCalled();
    expect(OrderRepository).toHaveBeenCalledTimes(1);
    expect(mockInit).toHaveBeenCalled();
  });

  it("creates a Postgres Toy order repository and calls init()", async () => {
    const repo = await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.TOY);
    expect(repo).toBeDefined();
    expect(ToyRepository).toHaveBeenCalled();
    expect(OrderRepository).toHaveBeenCalledTimes(1);
    expect(mockInit).toHaveBeenCalled();
  });

  it("throws error for unsupported category", async () => {
    await expect(
      RepositoryFactory.create(DBMode.POSTGRES, "UNKNOWN" as any)
    ).rejects.toThrow("Unsupported item category");
  });

  it("throws error for unsupported DB mode", async () => {
    await expect(
      RepositoryFactory.create("NOPE" as any, ItemCategory.CAKE)
    ).rejects.toThrow("Unsupported DB mode");
  });
});