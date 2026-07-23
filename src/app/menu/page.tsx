import { asc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import {
  alatMenuTable,
  bahanMenuTable,
  kategoriMenuTable,
  langkahMenuTable,
  menuTable,
} from "@/db/schema"
import type { MenuItemRow, MenuSubItems } from "@/app/(admin)/admin/menu/menu-item-dialog"

import { MenuCard } from "./menu-card"

export const dynamic = "force-dynamic"

export default async function MenuPage() {
  const [categories, menuItems, bahanRows, langkahRows, alatRows] =
    await Promise.all([
      db
        .select({
          idKategori: kategoriMenuTable.idKategori,
          nama: kategoriMenuTable.nama,
          slug: kategoriMenuTable.slug,
        })
        .from(kategoriMenuTable)
        .orderBy(asc(kategoriMenuTable.nama)),
      db
        .select({
          idMenu: menuTable.idMenu,
          judul: menuTable.judul,
          slug: menuTable.slug,
          idKategori: menuTable.idKategori,
          kategoriNama: kategoriMenuTable.nama,
          tipe: menuTable.tipe,
          pathGambar: menuTable.pathGambar,
          catatanTeknis: menuTable.catatanTeknis,
        })
        .from(menuTable)
        .leftJoin(
          kategoriMenuTable,
          eq(menuTable.idKategori, kategoriMenuTable.idKategori),
        )
        .where(eq(menuTable.tipe, "final"))
        .orderBy(asc(menuTable.judul)),
      db.select().from(bahanMenuTable).orderBy(asc(bahanMenuTable.idBahan)),
      db
        .select()
        .from(langkahMenuTable)
        .orderBy(asc(langkahMenuTable.urutan)),
      db.select().from(alatMenuTable).orderBy(asc(alatMenuTable.idAlat)),
    ])

  // Build subItems map keyed by idMenu
  const subItems: Record<number, MenuSubItems> = {}
  for (const item of menuItems) {
    subItems[item.idMenu] = {
      bahan: bahanRows.filter((b) => b.idMenu === item.idMenu),
      langkah: langkahRows.filter((l) => l.idMenu === item.idMenu),
      alat: alatRows.filter((a) => a.idMenu === item.idMenu),
    }
  }

  // Group items by idKategori — null means uncategorized
  const groupedItems = new Map<number | null, MenuItemRow[]>()
  for (const item of menuItems) {
    const key = item.idKategori
    if (!groupedItems.has(key)) {
      groupedItems.set(key, [])
    }
    groupedItems.get(key)!.push(item as MenuItemRow)
  }

  const hasItems = menuItems.length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-10 border-b pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Our Menu</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Browse our selection of food and beverages.
        </p>
      </header>

      {hasItems ? (
        <div className="flex flex-col gap-12">
          {/* Render items grouped by category (in category order) */}
          {categories.map((category) => {
            const items = groupedItems.get(category.idKategori)
            if (!items || items.length === 0) return null

            return (
              <section key={category.idKategori}>
                <h2 className="mb-5 text-2xl font-semibold">
                  {category.nama}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <MenuCard
                      key={item.idMenu}
                      item={item}
                      subItems={subItems[item.idMenu]}
                    />
                  ))}
                </div>
              </section>
            )
          })}

          {/* Uncategorized items (at the end) */}
          {groupedItems.has(null) && groupedItems.get(null)!.length > 0 ? (
            <section>
              <h2 className="mb-5 text-2xl font-semibold">More</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {groupedItems.get(null)!.map((item) => (
                  <MenuCard
                    key={item.idMenu}
                    item={item}
                    subItems={subItems[item.idMenu]}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <p className="text-sm text-muted-foreground">
            No menu items available yet.
          </p>
        </div>
      )}
    </div>
  )
}
