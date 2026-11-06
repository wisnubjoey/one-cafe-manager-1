import { Suspense } from "react"
import { PurchaseInvoiceForm } from "@/components/PurchaseInvoice/purchase-invoice-form"

export default function MemberPurchaseInvoiceCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PurchaseInvoiceForm />
    </Suspense>
  )
}
