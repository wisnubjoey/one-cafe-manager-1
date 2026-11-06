"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/db/client"
import {
  alatMenuTable,
  bahanMenuTable,
  kategoriMenuTable,
  langkahMenuTable,
  menuTable,
} from "@/db/schema"

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string") {
    throw new Error(`${key} is required`)
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw new Error(`${key} is required`)
  }

  return trimmedValue
}

function getRequiredNumber(formData: FormData, key: string) {
  const value = Number(getRequiredString(formData, key))

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} is invalid`)
  }

  return value
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return null
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  return trimmedValue
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function getOptionalNumber(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    return null
  }

  const num = Number(value.trim())

  if (!Number.isInteger(num) || num <= 0) {
    return null
  }

  return num
}

function getTipeMenu(formData: FormData): "final" | "semi-finished" {
  const value = getRequiredString(formData, "tipe")

  if (value !== "final" && value !== "semi-finished") {
    throw new Error("Tipe menu must be 'final' or 'semi-finished'")
  }

  return value
}

// ---- Category actions ----

export async function createCategory(formData: FormData) {
  const nama = getRequiredString(formData, "nama")
  const slug = slugify(nama)

  await db.insert(kategoriMenuTable).values({
    nama,
    slug,
  })

  revalidatePath("/admin/menu")
}

export async function updateCategory(formData: FormData) {
  const idKategori = getRequiredNumber(formData, "idKategori")
  const nama = getRequiredString(formData, "nama")
  const slug = slugify(nama)

  await db
    .update(kategoriMenuTable)
    .set({
      nama,
      slug,
    })
    .where(eq(kategoriMenuTable.idKategori, idKategori))

  revalidatePath("/admin/menu")
}

export async function deleteCategory(formData: FormData) {
  const idKategori = getRequiredNumber(formData, "idKategori")

  await db
    .delete(kategoriMenuTable)
    .where(eq(kategoriMenuTable.idKategori, idKategori))

  revalidatePath("/admin/menu")
}

// ---- Sub-item parsers ----

function parseBahanFields(formData: FormData) {
  const count = Number(formData.get("bahanCount") ?? "0")

  if (!Number.isInteger(count) || count < 0) {
    return []
  }

  const items: Array<{ namaBahan: string; jumlah: string; satuan: string }> =
    []

  for (let i = 0; i < count; i++) {
    const namaBahan = getOptionalString(formData, `bahan-${i}-namaBahan`)
    const jumlah = getOptionalString(formData, `bahan-${i}-jumlah`)

    if (!namaBahan || !jumlah) {
      continue
    }

    const satuan = getRequiredString(formData, `bahan-${i}-satuan`)

    items.push({ namaBahan, jumlah, satuan })
  }

  return items
}

function parseLangkahFields(formData: FormData) {
  const count = Number(formData.get("langkahCount") ?? "0")

  if (!Number.isInteger(count) || count < 0) {
    return []
  }

  const items: Array<{ urutan: number; instruksi: string }> = []

  for (let i = 0; i < count; i++) {
    const instruksi = getOptionalString(formData, `langkah-${i}-instruksi`)

    if (!instruksi) {
      continue
    }

    items.push({
      urutan: i + 1,
      instruksi,
    })
  }

  return items
}

function parseAlatFields(formData: FormData) {
  const count = Number(formData.get("alatCount") ?? "0")

  if (!Number.isInteger(count) || count < 0) {
    return []
  }

  const items: Array<{ namaAlat: string; spesifikasi: string | null }> = []

  for (let i = 0; i < count; i++) {
    const namaAlat = getOptionalString(formData, `alat-${i}-namaAlat`)

    if (!namaAlat) {
      continue
    }

    const spesifikasi = getOptionalString(formData, `alat-${i}-spesifikasi`)

    items.push({ namaAlat, spesifikasi })
  }

  return items
}

// ---- Menu item actions ----

export async function createMenuItem(formData: FormData) {
  const idKategori = getOptionalNumber(formData, "idKategori")
  const judul = getRequiredString(formData, "judul")
  const tipe = getTipeMenu(formData)
  const slug = slugify(judul)
  const pathGambar = getOptionalString(formData, "pathGambar")
  const catatanTeknis = getOptionalString(formData, "catatanTeknis")

  const [inserted] = await db
    .insert(menuTable)
    .values({
      idKategori,
      judul,
      slug,
      tipe,
      pathGambar,
      catatanTeknis,
    })
    .returning({ idMenu: menuTable.idMenu })

  const idMenu = inserted.idMenu

  const bahanItems = parseBahanFields(formData)
  for (const item of bahanItems) {
    await db.insert(bahanMenuTable).values({
      idMenu,
      namaBahan: item.namaBahan,
      jumlah: item.jumlah,
      satuan: item.satuan,
    })
  }

  const langkahItems = parseLangkahFields(formData)
  for (const item of langkahItems) {
    await db.insert(langkahMenuTable).values({
      idMenu,
      urutan: item.urutan,
      instruksi: item.instruksi,
    })
  }

  const alatItems = parseAlatFields(formData)
  for (const item of alatItems) {
    await db.insert(alatMenuTable).values({
      idMenu,
      namaAlat: item.namaAlat,
      spesifikasi: item.spesifikasi,
    })
  }

  revalidatePath("/admin/menu")
}

export async function updateMenuItem(formData: FormData) {
  const idMenu = getRequiredNumber(formData, "idMenu")
  const idKategori = getOptionalNumber(formData, "idKategori")
  const judul = getRequiredString(formData, "judul")
  const tipe = getTipeMenu(formData)
  const slug = slugify(judul)
  const pathGambar = getOptionalString(formData, "pathGambar")
  const catatanTeknis = getOptionalString(formData, "catatanTeknis")

  const bahanItems = parseBahanFields(formData)
  const langkahItems = parseLangkahFields(formData)
  const alatItems = parseAlatFields(formData)

  await db.transaction(async (tx) => {
    await tx.delete(bahanMenuTable).where(eq(bahanMenuTable.idMenu, idMenu))
    await tx.delete(langkahMenuTable).where(eq(langkahMenuTable.idMenu, idMenu))
    await tx.delete(alatMenuTable).where(eq(alatMenuTable.idMenu, idMenu))

    await tx
      .update(menuTable)
      .set({
        idKategori,
        judul,
        slug,
        tipe,
        pathGambar,
        catatanTeknis,
      })
      .where(eq(menuTable.idMenu, idMenu))

    for (const item of bahanItems) {
      await tx.insert(bahanMenuTable).values({
        idMenu,
        namaBahan: item.namaBahan,
        jumlah: item.jumlah,
        satuan: item.satuan,
      })
    }

    for (const item of langkahItems) {
      await tx.insert(langkahMenuTable).values({
        idMenu,
        urutan: item.urutan,
        instruksi: item.instruksi,
      })
    }

    for (const item of alatItems) {
      await tx.insert(alatMenuTable).values({
        idMenu,
        namaAlat: item.namaAlat,
        spesifikasi: item.spesifikasi,
      })
    }
  })

  revalidatePath("/admin/menu")
}

export async function deleteMenuItem(formData: FormData) {
  const idMenu = getRequiredNumber(formData, "idMenu")

  await db.delete(menuTable).where(eq(menuTable.idMenu, idMenu))

  revalidatePath("/admin/menu")
}
