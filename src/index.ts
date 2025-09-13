import path from "path";
import { parseCSV } from "./utils/csvParser";
import { parseJSON } from "./utils/jsonParser";
import { parseXML } from "./utils/xmlParser";

async function demo() {
  const base = (f: string) => path.join(__dirname, "data", f);

  console.log("CSV:", await parseCSV(base("cake orders.csv")));
  console.log("JSON:", parseJSON(base("book orders.json")));
  console.log("XML:", parseXML(base("toy orders.xml")));
}

demo().catch(console.error);