"use client"

import { useState } from "react"
import { CaretDown, CaretRight } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

import { deleteMenuItem } from "./actions"
import {
  MenuItemDialog,
  type CategoryOption,
  type MenuItemRow,
  type MenuSubItems,
} from "./menu-item-dialog"

type Props = {
  menuItems: MenuItemRow[]
  categories: CategoryOption[]
  subItems: Record<number, MenuSubItems>
}

function DetailPanel({ subItems }: { subItems: MenuSubItems }) {
  const hasBahan = subItems.bahan.length > 0
  const hasLangkah = subItems.langkah.length > 0
  const hasAlat = subItems.alat.length > 0

  if (!hasBahan && !hasLangkah && !hasAlat) {
    return (
      <div className="px-10 py-4 text-xs text-muted-foreground">
        No ingredients, steps, or tools for this menu item.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-10 py-4">
      {hasBahan ? (
        <div>
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">
            Bahan (Ingredients)
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-1 pr-2 font-medium">Nama</th>
                <th className="py-1 px-2 font-medium">Jumlah</th>
                <th className="py-1 pl-2 font-medium">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {subItems.bahan.map((b) => (
                <tr key={b.idBahan} className="border-b last:border-0">
                  <td className="py-1 pr-2">{b.namaBahan}</td>
                  <td className="py-1 px-2">{b.jumlah}</td>
                  <td className="py-1 pl-2">{b.satuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {hasLangkah ? (
        <div>
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">
            Langkah (Steps)
          </h4>
          <ol className="list-inside list-decimal text-xs">
            {subItems.langkah.map((l) => (
              <li key={l.idLangkah} className="py-0.5">
                {l.instruksi}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {hasAlat ? (
        <div>
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">
            Alat (Tools)
          </h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-1 pr-2 font-medium">Nama</th>
                <th className="py-1 pl-2 font-medium">Spesifikasi</th>
              </tr>
            </thead>
            <tbody>
              {subItems.alat.map((a) => (
                <tr key={a.idAlat} className="border-b last:border-0">
                  <td className="py-1 pr-2">{a.namaAlat}</td>
                  <td className="py-1 pl-2">
                    {a.spesifikasi ?? (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export function MenuItemSection({ menuItems, categories, subItems }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null)
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null)

  const editingItem = editingMenuId
    ? menuItems.find((m) => m.idMenu === editingMenuId) ?? null
    : null

  const editingSubItems = editingMenuId ? subItems[editingMenuId] ?? null : null

  const handleAdd = () => {
    setEditingMenuId(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (idMenu: number) => {
    setEditingMenuId(idMenu)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingMenuId(null)
  }

  const toggleExpand = (idMenu: number) => {
    setExpandedMenuId((prev) => (prev === idMenu ? null : idMenu))
  }

  return (
    <section className="border">
      <div className="flex h-10 items-center justify-between border-b px-3">
        <h2 className="text-sm font-medium">Menu Items</h2>
        <span className="text-xs text-muted-foreground">
          {menuItems.length} total
        </span>
      </div>

      <div className="border-b px-3 py-2">
        <Button onClick={handleAdd}>Add Menu Item</Button>
      </div>

      {menuItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="w-8 px-2 py-2" />
                <th className="px-3 py-2 font-medium">Judul</th>
                <th className="px-3 py-2 font-medium">Kategori</th>
                <th className="px-3 py-2 font-medium">Tipe</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => {
                const isExpanded = expandedMenuId === item.idMenu

                return (
                  <tr key={item.idMenu} className="border-b last:border-0">
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.idMenu)}
                        className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
                        aria-label={
                          isExpanded ? "Collapse details" : "Expand details"
                        }
                      >
                        {isExpanded ? (
                          <CaretDown className="size-3" />
                        ) : (
                          <CaretRight className="size-3" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2 font-medium">{item.judul}</td>
                    <td className="px-3 py-2 text-xs">
                      {item.kategoriNama ?? (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">{item.tipe}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item.idMenu)}
                        >
                          Edit
                        </Button>
                        <form action={deleteMenuItem}>
                          <input
                            type="hidden"
                            name="idMenu"
                            value={item.idMenu}
                          />
                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {expandedMenuId !== null && subItems[expandedMenuId] ? (
                <tr key={`detail-${expandedMenuId}`}>
                  <td colSpan={5} className="bg-muted/20 p-0">
                    <DetailPanel subItems={subItems[expandedMenuId]} />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-3 py-8 text-sm text-muted-foreground">
          No menu items found.
        </div>
      )}

      {isDialogOpen ? (
        <MenuItemDialog
          mode={editingItem ? "edit" : "create"}
          menuItem={editingItem}
          subItems={editingSubItems}
          categories={categories}
          onClose={handleCloseDialog}
        />
      ) : null}
    </section>
  )
}
