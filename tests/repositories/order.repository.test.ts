import { OrderRepository } from "../../src/repository/postgres/order.repository";
import { PostgresConnection } from "../../src/repository/postgres/PostgresConnection";
import { DbException, ItemNotFoundException } from "../../src/util/exceptions/repositoryExceptions";

// Mock the PostgresConnection pool and client
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockPool = {
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue(mockClient),
};

jest.mock("../../src/repository/postgres/PostgresConnection", () => ({
  PostgresConnection: {
    getPool: () => mockPool,
  },
}));

// Mock itemRepository with necessary methods and an init()
const mockItemRepository = {
  init: jest.fn().mockResolvedValue(undefined),
  create: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("OrderRepository", () => {
  let repo: OrderRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new OrderRepository(mockItemRepository);
  });

  describe("init", () => {
    it("should initialize item repository and create orders table", async () => {
      mockPool.query.mockResolvedValueOnce({}); // For CREATE TABLE

      await repo.init();

      expect(mockItemRepository.init).toHaveBeenCalled();
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS orders"));
    });

    it("should throw InitializationException on failure", async () => {
      mockItemRepository.init.mockRejectedValueOnce(new Error("init fail"));

      await expect(repo.init()).rejects.toThrow("Failed to initialize orders table");
    });
  });

  describe("create", () => {
    it("should create order and item in transaction", async () => {
      mockClient.query.mockResolvedValue({});
      const order = {
        getId: () => "order1",
        getQuantity: () => 3,
        getPrice: () => 100,
        getItem: () => ({
          getCategory: () => "book",
        }),
      };
      mockItemRepository.create.mockResolvedValue("item1");

      const id = await repo.create(order as any);

      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockItemRepository.create).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO orders"),
        ["order1", 3, 100, "book", "item1"]
      );
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
      expect(id).toBe("order1");
    });

    it("should rollback and throw DbException on failure", async () => {
      mockClient.query.mockResolvedValue({});
      mockItemRepository.create.mockRejectedValueOnce(new Error("item create fail"));

      const order = {
        getId: () => "order1",
        getQuantity: () => 3,
        getPrice: () => 100,
        getItem: () => ({
          getCategory: () => "book",
        }),
      };

      await expect(repo.create(order as any)).rejects.toThrow(DbException);
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });
  });

  describe("get", () => {
    it("should return an order mapped from DB row and item", async () => {
      const orderRow = {
        id: "order1",
        quantity: 2,
        price: 200,
        item_category: "book",
        item_id: "item1",
      };
      mockPool.query.mockResolvedValueOnce({ rows: [orderRow] });
      // item with methods expected by mapper
      const mockItem = {
        getId: () => "item1",
        getCategory: () => "book",
      };
      mockItemRepository.get.mockResolvedValue(mockItem);

      const order = await repo.get("order1");

      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), ["order1"]);
      expect(mockItemRepository.get).toHaveBeenCalledWith("item1");
      expect(order.getId()).toBe("order1");
    });

    it("should throw ItemNotFoundException if no order found", async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await expect(repo.get("notfound")).rejects.toThrow(ItemNotFoundException);
    });

    it("should wrap unexpected errors into DbException", async () => {
      mockPool.query.mockRejectedValueOnce(new Error("db error"));

      await expect(repo.get("id")).rejects.toThrow(DbException);
    });
  });

  describe("getAll", () => {
    it("should return all orders with their items", async () => {
      const orders = [
        { id: "order1", quantity: 1, price: 10, item_category: "book", item_id: "item1" },
        { id: "order2", quantity: 2, price: 20, item_category: "cake", item_id: "item2" },
      ];
      mockPool.query.mockResolvedValueOnce({ rows: orders });

      const mockItems = [
        {
          getId: () => "item1",
          getCategory: () => "book",
        },
        {
          getId: () => "item2",
          getCategory: () => "cake",
        },
      ];
      mockItemRepository.getAll.mockResolvedValue(mockItems);

      const results = await repo.getAll();

      expect(results).toHaveLength(2);
      expect(results[0].getId()).toBe("order1");
      expect(results[1].getId()).toBe("order2");
    });

    it("should throw DbException if item not found for order", async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: "order1", quantity: 1, price: 10, item_category: "book", item_id: "item1" }],
      });
      mockItemRepository.getAll.mockResolvedValue([]);

      await expect(repo.getAll()).rejects.toThrow(Error);
    });
  });

  describe("update", () => {
    it("should update order and its item in transaction", async () => {
      mockClient.query.mockResolvedValue({});

      const order = {
        getId: () => "order1",
        getQuantity: () => 5,
        getPrice: () => 50,
        getItem: () => ({}),
      };
      mockItemRepository.update.mockResolvedValue(undefined);

      await repo.update(order as any);

      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockItemRepository.update).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE orders"),
        [5, 50, "order1"]
      );
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    });

    it("should rollback and throw DbException on failure", async () => {
      mockClient.query.mockResolvedValue({});
      mockItemRepository.update.mockRejectedValueOnce(new Error("update fail"));

      const order = {
        getId: () => "order1",
        getQuantity: () => 5,
        getPrice: () => 50,
        getItem: () => ({}),
      };

      await expect(repo.update(order as any)).rejects.toThrow(DbException);
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });
  });

  describe("delete", () => {
    it("should delete order and its item in transaction", async () => {
      mockClient.query.mockImplementation((text) => {
        if (text.includes("SELECT * FROM orders")) {
          return Promise.resolve({ rows: [{ id: "order1", item_id: "item1" }] });
        }
        return Promise.resolve({}); // for DELETE, BEGIN, COMMIT etc.
      });

      mockItemRepository.delete.mockResolvedValue(undefined);

      await repo.delete("order1");

      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM orders"), ["order1"]);
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM orders"), ["order1"]);
      expect(mockItemRepository.delete).toHaveBeenCalledWith("item1");
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    });

    it("should throw ItemNotFoundException if order does not exist", async () => {
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [] }); // SELECT returns empty rows

      await expect(repo.delete("noorder")).rejects.toThrow(ItemNotFoundException);

      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("BEGIN"));
      expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM orders"), ["noorder"]);
    });


    it("should rollback and throw DbException on failure", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ id: "order1", item_id: "item1" }] })
        .mockRejectedValueOnce(new Error("delete fail"));

      await expect(repo.delete("order1")).rejects.toThrow(DbException);
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });
  });
});
