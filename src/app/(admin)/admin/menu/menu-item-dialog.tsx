"use client"

import { useState } from "react"
import { Plus, Trash, X } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { createMenuItem, updateMenuItem } from "./actions"

export type CategoryOption = {
  idKategori: number
  nama: string
  slug: string
}

export type MenuItemRow = {
  idMenu: number
  judul: string
  slug: string
  idKategori: number | null
  kategoriNama: string | null
  tipe: "final" | "semi-finished"
  pathGambar: string | null
  catatanTeknis: string | null
}

export type MenuSubItems = {
  bahan: Array<{
    idBahan: number
    namaBahan: string
    jumlah: string
    satuan: string
  }>
  langkah: Array<{
    idLangkah: number
    urutan: number
    instruksi: string
  }>
  alat: Array<{
    idAlat: number
    namaAlat: string
    spesifikasi: string | null
  }>
}

type Props = {
  mode: "create" | "edit"
  menuItem?: MenuItemRow | null
  subItems?: MenuSubItems | null
  categories: CategoryOption[]
  onClose: () => void
}

type BahanFormRow = {
  key: string
  namaBahan: string
  jumlah: string
  satuan: string
}

type LangkahFormRow = {
  key: string
  instruksi: string
}

type AlatFormRow = {
  key: string
  namaAlat: string
  spesifikasi: string
}

let rowId = 0
function nextKey() {
  rowId++
  return `row-${rowId}`
}

function SubSectionHeader({
  title,
  onAdd,
}: {
  title: string
  onAdd: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-input px-2 py-1.5">
      <span className="text-xs font-medium">{title}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 px-1.5 text-xs"
        onClick={onAdd}
      >
        <Plus className="size-3" />
        Add
      </Button>
    </div>
  )
}

export function MenuItemDialog({
  mode,
  menuItem,
  subItems,
  categories,
  onClose,
}: Props) {
  const [bahanRows, setBahanRows] = useState<BahanFormRow[]>(() =>
    subItems
      ? subItems.bahan.map((b) => ({
          key: nextKey(),
          namaBahan: b.namaBahan,
          jumlah: b.jumlah,
          satuan: b.satuan,
        }))
      : [],
  )

  const [langkahRows, setLangkahRows] = useState<LangkahFormRow[]>(() =>
    subItems
      ? subItems.langkah.map((l) => ({
          key: nextKey(),
          instruksi: l.instruksi,
        }))
      : [],
  )

  const [alatRows, setAlatRows] = useState<AlatFormRow[]>(() =>
    subItems
      ? subItems.alat.map((a) => ({
          key: nextKey(),
          namaAlat: a.namaAlat,
          spesifikasi: a.spesifikasi ?? "",
        }))
      : [],
  )

  const dialogKey =
    mode === "edit" && menuItem ? `edit-${menuItem.idMenu}` : "create"

  const addBahanRow = () =>
    setBahanRows([
      ...bahanRows,
      { key: nextKey(), namaBahan: "", jumlah: "", satuan: "" },
    ])

  const addLangkahRow = () =>
    setLangkahRows([...langkahRows, { key: nextKey(), instruksi: "" }])

  const addAlatRow = () =>
    setAlatRows([
      ...alatRows,
      { key: nextKey(), namaAlat: "", spesifikasi: "" },
    ])

  const removeBahanRow = (key: string) =>
    setBahanRows(bahanRows.filter((r) => r.key !== key))
  const removeLangkahRow = (key: string) =>
    setLangkahRows(langkahRows.filter((r) => r.key !== key))
  const removeAlatRow = (key: string) =>
    setAlatRows(alatRows.filter((r) => r.key !== key))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-xs"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col border bg-background shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <div className="border-b p-4 pr-12">
          <h2 className="text-base font-semibold">
            {mode === "edit" ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-3 top-3"
          onClick={onClose}
        >
          <X />
          <span className="sr-only">Close</span>
        </Button>

        <form
          key={dialogKey}
          action={async (formData) => {
            if (mode === "edit") {
              await updateMenuItem(formData)
            } else {
              await createMenuItem(formData)
            }
            onClose()
          }}
          className="flex flex-col gap-4 overflow-y-auto p-4"
        >
          {mode === "edit" && menuItem ? (
            <input type="hidden" name="idMenu" value={menuItem.idMenu} />
          ) : null}

          {/* Main fields */}
          <div className="flex flex-col gap-4 border border-input p-3">
            <label className="flex flex-col gap-1.5 text-xs font-medium">
              Judul
              <Input
                name="judul"
                defaultValue={menuItem?.judul ?? ""}
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium">
              Kategori
              <select
                name="idKategori"
                defaultValue={menuItem?.idKategori ?? ""}
                className="h-8 w-full border border-input bg-background px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.idKategori} value={c.idKategori}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium">
              Tipe
              <select
                name="tipe"
                defaultValue={menuItem?.tipe ?? "final"}
                className="h-8 w-full border border-input bg-background px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              >
                <option value="final">Final</option>
                <option value="semi-finished">Semi-Finished</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium">
              Path Gambar
              <Input
                name="pathGambar"
                defaultValue={menuItem?.pathGambar ?? ""}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium">
              Catatan Teknis
              <textarea
                name="catatanTeknis"
                rows={3}
                defaultValue={menuItem?.catatanTeknis ?? ""}
                className="w-full resize-none border border-input bg-background px-2.5 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              />
            </label>
          </div>

          {/* Bahan (Ingredients) */}
          <div className="border border-input">
            <SubSectionHeader title="Bahan (Ingredients)" onAdd={addBahanRow} />
            <input type="hidden" name="bahanCount" value={bahanRows.length} />
            {bahanRows.length > 0 ? (
              <div className="divide-y divide-input text-xs">
                {bahanRows.map((row, i) => (
                  <div key={row.key} className="flex items-start gap-1.5 p-2">
                    <div className="grid flex-1 grid-cols-12 gap-1.5">
                      <Input
                        className="col-span-5"
                        name={`bahan-${i}-namaBahan`}
                        defaultValue={row.namaBahan}
                        placeholder="Nama bahan"
                        required
                      />
                      <Input
                        className="col-span-3"
                        name={`bahan-${i}-jumlah`}
                        type="number"
                        step="0.01"
                        defaultValue={row.jumlah}
                        placeholder="Jumlah"
                        required
                      />
                      <Input
                        className="col-span-3"
                        name={`bahan-${i}-satuan`}
                        defaultValue={row.satuan}
                        placeholder="Satuan"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mt-0.5 shrink-0"
                      onClick={() => removeBahanRow(row.key)}
                    >
                      <Trash className="size-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-xs text-muted-foreground">
                No ingredients. Click &quot;Add&quot; to add one.
              </div>
            )}
          </div>

          {/* Langkah (Steps) */}
          <div className="border border-input">
            <SubSectionHeader
              title="Langkah (Steps)"
              onAdd={addLangkahRow}
            />
            <input
              type="hidden"
              name="langkahCount"
              value={langkahRows.length}
            />
            {langkahRows.length > 0 ? (
              <div className="divide-y divide-input text-xs">
                {langkahRows.map((row, i) => (
                  <div
                    key={row.key}
                    className="flex items-start gap-1.5 p-2"
                  >
                    <span className="mt-1.5 w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <textarea
                      name={`langkah-${i}-instruksi`}
                      rows={2}
                      defaultValue={row.instruksi}
                      placeholder={`Langkah ${i + 1}`}
                      required
                      className="flex-1 resize-none border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mt-0.5 shrink-0"
                      onClick={() => removeLangkahRow(row.key)}
                    >
                      <Trash className="size-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-xs text-muted-foreground">
                No steps. Click &quot;Add&quot; to add one.
              </div>
            )}
          </div>

          {/* Alat (Tools) */}
          <div className="border border-input">
            <SubSectionHeader title="Alat (Tools)" onAdd={addAlatRow} />
            <input type="hidden" name="alatCount" value={alatRows.length} />
            {alatRows.length > 0 ? (
              <div className="divide-y divide-input text-xs">
                {alatRows.map((row, i) => (
                  <div
                    key={row.key}
                    className="flex items-start gap-1.5 p-2"
                  >
                    <div className="grid flex-1 grid-cols-2 gap-1.5">
                      <Input
                        name={`alat-${i}-namaAlat`}
                        defaultValue={row.namaAlat}
                        placeholder="Nama alat"
                        required
                      />
                      <Input
                        name={`alat-${i}-spesifikasi`}
                        defaultValue={row.spesifikasi}
                        placeholder="Spesifikasi"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mt-0.5 shrink-0"
                      onClick={() => removeAlatRow(row.key)}
                    >
                      <Trash className="size-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-xs text-muted-foreground">
                No tools. Click &quot;Add&quot; to add one.
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "edit" ? "Update" : "Create"} Menu Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
