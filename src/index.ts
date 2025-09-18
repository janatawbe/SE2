import { parseCSV } from "./utils/csvParser";
import { parseJSON } from "./utils/jsonParser";
import { parseXML } from "./utils/xmlParser";
import { CSVCakeMapper } from "./mappers/cake.mapper";
import { JSONBookMapper } from "./mappers/book.mapper";
import { XMLToyMapper } from "./mappers/toy.mapper";
import { CSVOrderMapper, JSONOrderMapper, XMLOrderMapper } from "./mappers/order.mapper";

async function main() {
  // CSV Orders (Cakes)
  const csvRows = await parseCSV("src/data/cake orders.csv");
  const rows = csvRows[0]?.[0]?.toLowerCase().includes("id") ? csvRows.slice(1) : csvRows;
  const csvOrders = rows.map(r => new CSVOrderMapper(new CSVCakeMapper()).map(r));
  console.log("CSV Orders:", csvOrders);

  // JSON Orders (Books)
  const jsonData: any = parseJSON<any>("src/data/book orders.json");
  const list: any[] = Array.isArray(jsonData) ? jsonData : jsonData.orders;
  const jsonOrders = list.map(o => new JSONOrderMapper(new JSONBookMapper()).map(o));
  console.log("JSON Orders:", jsonOrders);

  // XML Orders (Toys)
  const xmlData: any = parseXML<any>("src/data/toy orders.xml");
  const xmlRows: any[] = Array.isArray(xmlData?.data?.row) ? xmlData.data.row : [xmlData.data.row];
  const xmlOrders = xmlRows.map(r => new XMLOrderMapper(new XMLToyMapper()).map(r));
  console.log("XML Orders:", xmlOrders);
}

main();