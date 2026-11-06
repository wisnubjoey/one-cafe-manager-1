import { desc } from "drizzle-orm"
import { db } from "@/db/client"
import { purchaseInvoiceTable } from "@/db/schema"
import { ResponsiveWrapper } from "@/components/PurchaseInvoice/responsive-wrapper"

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
      title: purchaseInvoiceTable.title,
      description: purchaseInvoiceTable.description,
      createdAt: purchaseInvoiceTable.createdAt,
    })
    .from(purchaseInvoiceTable)
    .orderBy(desc(purchaseInvoiceTable.createdAt))

  const events = invoices.map((item) => ({
    id: item.id,
    date: item.createdAt ? formatDbDate(item.createdAt) : "",
    title: item.title,
    description: item.description,
  }))

  return <ResponsiveWrapper />
}
