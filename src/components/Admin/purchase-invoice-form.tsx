"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createPurchaseInvoice } from "@/app/(admin)/admin/purchase-invoice/actions"

export function PurchaseInvoiceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultDate = searchParams.get("date") || new Date().toISOString().split("T")[0]

  const goBackUrl = "/admin/purchase-invoice"

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(goBackUrl)}
          aria-label="Go back"
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Purchase Invoice</h1>
          <p className="text-sm text-muted-foreground">
            Create a new purchase invoice record.
          </p>
        </div>
      </div>

      <div className="border bg-background p-6 shadow-sm">
        <form
          action={async (formData) => {
            await createPurchaseInvoice(formData)
            router.push(goBackUrl)
          }}
          className="flex flex-col gap-6"
        >
          <label className="flex flex-col gap-2 text-sm font-medium">
            Date
            <Input
              type="date"
              name="invoiceDate"
              defaultValue={defaultDate}
              required
              className="max-w-[200px]"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Title
            <Input
              type="text"
              name="title"
              placeholder="e.g. Restock Coffee Beans"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Description
            <textarea
              name="description"
              rows={4}
              placeholder="Optional details about the purchase..."
              className="w-full resize-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(goBackUrl)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
