import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { purchaseInvoiceTable } from "@/db/schema";
import { InboxView } from "@/components/PurchaseInvoice/inbox-view";

export const dynamic = "force-dynamic";

function formatDbDate(value: string | Date) {
  if (typeof value === "string") {
    return value;
  }
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function PurchaseInvoiceInboxPage() {
  const invoices = await db
    .select({
      id: purchaseInvoiceTable.id,
      invoiceDate: purchaseInvoiceTable.invoiceDate,
      title: purchaseInvoiceTable.title,
      description: purchaseInvoiceTable.description,
      createdAt: purchaseInvoiceTable.createdAt,
    })
    .from(purchaseInvoiceTable)
    .orderBy(desc(purchaseInvoiceTable.createdAt));

  const formattedInvoices = invoices.map((item) => ({
    id: item.id,
    invoiceDate: formatDbDate(item.invoiceDate),
    title: item.title,
    description: item.description,
    createdAt: item.createdAt ? item.createdAt.toISOString() : undefined,
  }));

  return <InboxView initialInvoices={formattedInvoices} />;
}
