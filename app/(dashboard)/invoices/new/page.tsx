import { getClients } from "@/app/actions/clients";
import { getInventoryItems } from "@/app/actions/inventory";
import NewInvoiceClient from "./NewInvoiceClient";

export default async function NewInvoicePage() {
  const clients = await getClients();
  const inventoryItems = await getInventoryItems();

  return <NewInvoiceClient initialClients={clients} initialInventoryItems={inventoryItems} />;
}
