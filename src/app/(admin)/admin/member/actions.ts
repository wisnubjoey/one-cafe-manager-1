"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/db/client"
import { karyawanTable, roleTable } from "@/db/schema"

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

async function assertRoleExists(idRole: number) {
  const role = await db.query.roleTable.findFirst({
    columns: {
      idRole: true,
    },
    where: eq(roleTable.idRole, idRole),
  })

  if (!role) {
    throw new Error("Selected role does not exist")
  }
}

export async function createRole(formData: FormData) {
  const namaRole = getRequiredString(formData, "namaRole")

  await db.insert(roleTable).values({
    namaRole,
  })

  revalidatePath("/admin/member")
}

export async function createKaryawan(formData: FormData) {
  const name = getRequiredString(formData, "name")
  const contact = getRequiredString(formData, "contact")
  const idRole = getRequiredNumber(formData, "idRole")

  await assertRoleExists(idRole)

  await db.insert(karyawanTable).values({
    name,
    contact,
    idRole,
    status: true,
  })

  revalidatePath("/admin/member")
}

export async function updateKaryawan(formData: FormData) {
  const idKaryawan = getRequiredNumber(formData, "idKaryawan")
  const name = getRequiredString(formData, "name")
  const contact = getRequiredString(formData, "contact")
  const idRole = getRequiredNumber(formData, "idRole")
  const status = formData.get("status") === "on"

  await assertRoleExists(idRole)

  await db
    .update(karyawanTable)
    .set({
      name,
      contact,
      idRole,
      status,
    })
    .where(eq(karyawanTable.idKaryawan, idKaryawan))

  revalidatePath("/admin/member")
}

export async function deactivateKaryawan(formData: FormData) {
  const idKaryawan = getRequiredNumber(formData, "idKaryawan")

  await db
    .update(karyawanTable)
    .set({
      status: false,
    })
    .where(eq(karyawanTable.idKaryawan, idKaryawan))

  revalidatePath("/admin/member")
}
