import { desc } from "drizzle-orm"

import { db } from "@/db/client"
import { purchaseInvoiceTable } from "@/db/schema"
import { PurchaseInvoiceManager } from "./purchase-invoice-manager"

export const dynamic = "force-dynamic"

export default async function PurchaseInvoicePage() {
  let invoices: Array<{
    id: string
    title: string
    description: string | null
    createdAt: string
  }> = []
  let dbError: string | null = null

  try {
    const rawInvoices = await db
      .select({
        id: purchaseInvoiceTable.id,
        title: purchaseInvoiceTable.title,
        description: purchaseInvoiceTable.description,
        createdAt: purchaseInvoiceTable.createdAt,
      })
      .from(purchaseInvoiceTable)
      .orderBy(desc(purchaseInvoiceTable.createdAt))

    invoices = rawInvoices.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      createdAt:
        item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : String(item.createdAt),
    }))
  } catch (err: unknown) {
    console.error("Error fetching purchase invoices:", err)
    if (err instanceof Error) {
      dbError = err.message
    } else {
      dbError = "Terjadi kesalahan saat mengambil data dari database."
    }
  }

  return <PurchaseInvoiceManager invoices={invoices} dbError={dbError} />
}
