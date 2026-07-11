import { asc, eq } from "drizzle-orm"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/db/client"
import {
  alatMenuTable,
  bahanMenuTable,
  kategoriMenuTable,
  langkahMenuTable,
  menuTable,
} from "@/db/schema"

import { createCategory, deleteCategory, updateCategory } from "./actions"
import { MenuItemSection } from "./menu-item-section"
import type { MenuItemRow, MenuSubItems } from "./menu-item-dialog"

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
        .orderBy(asc(menuTable.judul)),
      db.select().from(bahanMenuTable).orderBy(asc(bahanMenuTable.idBahan)),
      db
        .select()
        .from(langkahMenuTable)
        .orderBy(asc(langkahMenuTable.urutan)),
      db.select().from(alatMenuTable).orderBy(asc(alatMenuTable.idAlat)),
    ])

  const hasCategories = categories.length > 0

  const subItems: Record<number, MenuSubItems> = {}
  for (const item of menuItems) {
    subItems[item.idMenu] = {
      bahan: bahanRows.filter((b) => b.idMenu === item.idMenu),
      langkah: langkahRows.filter((l) => l.idMenu === item.idMenu),
      alat: alatRows.filter((a) => a.idMenu === item.idMenu),
    }
  }

  const typedMenuItems: MenuItemRow[] = menuItems.map((item) => ({
    idMenu: item.idMenu,
    judul: item.judul,
    slug: item.slug,
    idKategori: item.idKategori,
    kategoriNama: item.kategoriNama,
    tipe: item.tipe,
    pathGambar: item.pathGambar,
    catatanTeknis: item.catatanTeknis,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-normal">Menu</h1>
        <p className="text-sm text-muted-foreground">
          Manage menu categories and menu items.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-4">
          <section className="border">
            <div className="flex h-10 items-center border-b px-3">
              <h2 className="text-sm font-medium">Add Category</h2>
            </div>

            <form action={createCategory} className="flex flex-col gap-3 p-3">
              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Category Name
                <Input name="nama" required />
              </label>
              <Button type="submit">Add Category</Button>
            </form>
          </section>

          <section className="border">
            <div className="flex h-10 items-center justify-between border-b px-3">
              <h2 className="text-sm font-medium">Categories</h2>
              <span className="text-xs text-muted-foreground">
                {categories.length} total
              </span>
            </div>

            {hasCategories ? (
              <div className="divide-y">
                {categories.map((category) => (
                  <div
                    key={category.idKategori}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <Input
                      form={`update-category-${category.idKategori}`}
                      name="nama"
                      defaultValue={category.nama}
                      aria-label={`Name for ${category.nama}`}
                      required
                    />
                    <form
                      id={`update-category-${category.idKategori}`}
                      action={updateCategory}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="hidden"
                        name="idKategori"
                        value={category.idKategori}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        Save
                      </Button>
                    </form>
                    <form action={deleteCategory}>
                      <input
                        type="hidden"
                        name="idKategori"
                        value={category.idKategori}
                      />
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-8 text-sm text-muted-foreground">
                No categories. Add a category to start organizing menu items.
              </div>
            )}
          </section>
        </aside>

        <MenuItemSection
          menuItems={typedMenuItems}
          categories={categories}
          subItems={subItems}
        />
      </div>
    </div>
  )
}
