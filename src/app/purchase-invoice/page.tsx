import { asc } from "drizzle-orm"
import { db } from "@/db/client"
import { purchaseInvoiceTable } from "@/db/schema"
import { PurchaseInvoiceCalendar } from "@/components/purchase-invoice-calendar"

export const dynamic = "force-dynamic"

function formatDbDate(value: string | Date) {
  if (typeof value === "string") {
    return value
  }
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default async function MemberPurchaseInvoicePage() {
  const invoices = await db
    .select({
      id: purchaseInvoiceTable.id,
      invoiceDate: purchaseInvoiceTable.invoiceDate,
      title: purchaseInvoiceTable.title,
      description: purchaseInvoiceTable.description,
    })
    .from(purchaseInvoiceTable)
    .orderBy(asc(purchaseInvoiceTable.invoiceDate))

  const events = invoices.map((item) => ({
    id: item.id,
    date: formatDbDate(item.invoiceDate),
    title: item.title,
    description: item.description,
  }))

  return <PurchaseInvoiceCalendar events={events} />
}
