"use client"

import { useState, useTransition } from "react"
import {
  CircleNotch,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Receipt,
  Trash,
  X,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createPurchaseInvoice,
  deletePurchaseInvoice,
  updatePurchaseInvoice,
} from "./actions"

export type PurchaseInvoiceItem = {
  id: string
  title: string
  description: string | null
  createdAt: string
}

type Props = {
  invoices: PurchaseInvoiceItem[]
  dbError?: string | null
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  } catch {
    return date
  }
}

export function PurchaseInvoiceManager({ invoices, dbError }: Props) {
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PurchaseInvoiceItem | null>(null)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const filteredInvoices = invoices.filter((item) => {
    const term = search.toLowerCase()
    return (
      item.title.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    )
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: PurchaseInvoiceItem) => {
    setEditingItem(item)
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setErrorMessage(null)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        if (editingItem) {
          formData.append("id", editingItem.id)
          await updatePurchaseInvoice(formData)
        } else {
          await createPurchaseInvoice(formData)
        }
        closeModal()
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage("Terjadi kesalahan saat menyimpan data.")
        }
      }
    })
  }

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus invoice "${title}"?`)) {
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("id", id)
        await deletePurchaseInvoice(formData)
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message)
        } else {
          alert("Gagal menghapus invoice.")
        }
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="size-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Purchase Invoice
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data dan catatan pembelian invoice café.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="size-4" />
          Tambah Invoice
        </Button>
      </div>

      {/* Database Error Banner if any */}
      {dbError && (
        <div className="rounded border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-semibold">Terjadi kendala saat membaca database:</p>
          <p className="mt-1 font-mono text-xs">{dbError}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Petunjuk: Jika tabel baru atau skema baru saja diubah, jalankan <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">npx drizzle-kit push</code> di terminal.
          </p>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan judul atau keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Total: {filteredInvoices.length} invoice
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Deskripsi</th>
                <th className="px-4 py-3 font-medium">Dibuat Pada</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {invoice.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-md truncate">
                      {invoice.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => openEditModal(invoice)}
                          title="Edit"
                        >
                          <PencilSimple className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(invoice.id, invoice.title)}
                          disabled={isPending}
                          title="Hapus"
                        >
                          <Trash className="size-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Receipt className="size-8 text-muted-foreground/60" />
                      <p className="text-sm">
                        {search
                          ? "Tidak ada invoice yang sesuai dengan pencarian."
                          : "Belum ada purchase invoice."}
                      </p>
                      {!search && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openCreateModal}
                          className="mt-2"
                        >
                          <Plus className="mr-1 size-4" />
                          Tambah Invoice Pertama
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold">
                {editingItem ? "Edit Purchase Invoice" : "Tambah Purchase Invoice"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={closeModal}
              >
                <X className="size-4" />
                <span className="sr-only">Tutup</span>
              </Button>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded bg-destructive/10 p-2.5 text-xs text-destructive">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Judul Invoice <span className="text-destructive">*</span>
                <Input
                  type="text"
                  name="title"
                  defaultValue={editingItem?.title || ""}
                  placeholder="Contoh: Pembelian Biji Kopi Arabika"
                  required
                  autoFocus
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Deskripsi / Catatan
                <textarea
                  name="description"
                  defaultValue={editingItem?.description || ""}
                  rows={4}
                  placeholder="Keterangan tambahan atau catatan pembelian..."
                  className="w-full resize-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isPending}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending && <CircleNotch className="size-4 animate-spin" />}
                  {editingItem ? "Simpan Perubahan" : "Simpan Invoice"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

