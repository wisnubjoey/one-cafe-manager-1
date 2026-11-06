"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/db/client"
import { purchaseInvoiceTable } from "@/db/schema"

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`)
  }
  return value.trim()
}

export async function createPurchaseInvoice(formData: FormData) {
  const title = getRequiredString(formData, "title")
  const descriptionRaw = formData.get("description")
  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim()
      ? descriptionRaw.trim()
      : null

  await db.insert(purchaseInvoiceTable).values({
    title,
    description,
  })

  revalidatePath("/admin/purchase-invoice")
}

export async function updatePurchaseInvoice(formData: FormData) {
  const id = getRequiredString(formData, "id")
  const title = getRequiredString(formData, "title")
  const descriptionRaw = formData.get("description")
  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim()
      ? descriptionRaw.trim()
      : null

  await db
    .update(purchaseInvoiceTable)
    .set({
      title,
      description,
    })
    .where(eq(purchaseInvoiceTable.id, id))

  revalidatePath("/admin/purchase-invoice")
}

export async function deletePurchaseInvoice(formData: FormData) {
  const id = getRequiredString(formData, "id")

  await db
    .delete(purchaseInvoiceTable)
    .where(eq(purchaseInvoiceTable.id, id))

  revalidatePath("/admin/purchase-invoice")
}

