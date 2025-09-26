import { OrderRepository } from "./order.repository";
import { parseCSV, writeCSVFile } from "../../util/csvParser"
import { CSVOrderMapper } from "../../mappers/order.mapper";
import { CSVCakeMapper } from "../../mappers/cake.mapper";
import { IOrder } from "../../model/IOrder";
import { DbException } from "../../util/exceptions/repositoryExceptions";

export class CakeOrderRepository extends OrderRepository {
    private mapper = new CSVOrderMapper(new CSVCakeMapper());

    constructor(private readonly filePath: string) {
        super();
    }

    protected async load(): Promise<IOrder[]> {
       try {
            // Read the CSV file and parse its content
            const csv = await parseCSV(this.filePath);

            // Return the list of orders
            return csv.map(this.mapper.map.bind(this.mapper)); 
       } catch (error: unknown) {
            throw new DbException("Failed to load orders from CSV file", error as Error);
       }
    }

    protected async save(orders: IOrder[]): Promise<void> {
        try {
            // Generate the list of headers
            const header = [
                "id", "Type", "Filling", "Size", "Layers",
                "Frosting Type", "Frosting Flavor", "Decoration Type",
                "Decoration Color", "Custom Message", "Shape", "Allergies",
                "Special Ingredients", "Packaging Type", "Price", "Quantity"
            ];

            // Convert the orders to 2D strings
            const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));
        
            // parse.write
            return writeCSVFile(this.filePath, [header, ...rawItems]);
        } catch (error: unknown) {
            throw new DbException("Failed to save orders to CSV file", error as Error);
        }
    }
}