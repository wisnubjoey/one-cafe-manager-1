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

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key)
  if (typeof value !== "string" || !value.trim()) {
    return null
  }
  return value.trim()
}

function getRequiredDate(formData: FormData, key: string) {
  const value = getRequiredString(formData, key)
  const parsedDate = new Date(`${value}T00:00:00`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsedDate.getTime())) {
    throw new Error(`${key} is invalid`)
  }
  return value
}

function getRequiredNumber(formData: FormData, key: string) {
  const value = Number(getRequiredString(formData, key))
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} is invalid`)
  }
  return value
}

export async function createPurchaseInvoice(formData: FormData) {
  const invoiceDate = getRequiredDate(formData, "invoiceDate")
  const title = getRequiredString(formData, "title")
  const description = getOptionalString(formData, "description")

  await db.insert(purchaseInvoiceTable).values({
    invoiceDate,
    title,
    description,
  })

  revalidatePath("/admin/purchase-invoice")
  revalidatePath("/purchase-invoice")
}

export async function updatePurchaseInvoice(formData: FormData) {
  const id = getRequiredString(formData, "id")
  const invoiceDate = getRequiredDate(formData, "invoiceDate")
  const title = getRequiredString(formData, "title")
  const description = getOptionalString(formData, "description")

  await db
    .update(purchaseInvoiceTable)
    .set({
      invoiceDate,
      title,
      description,
    })
    .where(eq(purchaseInvoiceTable.id, id))

  revalidatePath("/admin/purchase-invoice")
  revalidatePath("/purchase-invoice")
}

export async function deletePurchaseInvoice(formData: FormData) {
  const id = getRequiredString(formData, "id")

  await db.delete(purchaseInvoiceTable).where(eq(purchaseInvoiceTable.id, id))

  revalidatePath("/admin/purchase-invoice")
  revalidatePath("/purchase-invoice")
}
