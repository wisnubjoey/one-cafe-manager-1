"use server"

import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { jadwalTable, karyawanTable, shiftTable } from "@/db/schema"

const attendanceStatuses = [
  "Belum Hadir",
  "Hadir",
  "Sakit",
  "Izin",
  "Alfa",
] as const

type AttendanceStatus = (typeof attendanceStatuses)[number]

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

  return trimmedValue || null
}

function getRequiredDate(formData: FormData, key: string) {
  const value = getRequiredString(formData, key)
  const parsedDate = new Date(`${value}T00:00:00`)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsedDate.getTime())) {
    throw new Error(`${key} is invalid`)
  }

  return value
}

function getOptionalTime(formData: FormData, key: string) {
  const value = getOptionalString(formData, key)

  if (!value) {
    return null
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new Error(`${key} is invalid`)
  }

  return value
}

function getAttendanceStatus(formData: FormData) {
  const value = getRequiredString(formData, "statusKehadiran")

  if (!attendanceStatuses.includes(value as AttendanceStatus)) {
    throw new Error("statusKehadiran is invalid")
  }

  return value as AttendanceStatus
}

async function assertActiveKaryawanExists(idKaryawan: number) {
  const employee = await db.query.karyawanTable.findFirst({
    columns: {
      idKaryawan: true,
    },
    where: and(
      eq(karyawanTable.idKaryawan, idKaryawan),
      eq(karyawanTable.status, true)
    ),
  })

  if (!employee) {
    throw new Error("Selected karyawan does not exist or is inactive")
  }
}

async function assertShiftExists(idShift: number) {
  const shift = await db.query.shiftTable.findFirst({
    columns: {
      idShift: true,
    },
    where: eq(shiftTable.idShift, idShift),
  })

  if (!shift) {
    throw new Error("Selected shift does not exist")
  }
}

async function getScheduleShiftId(formData: FormData) {
  const shiftOption = getRequiredString(formData, "shiftOption")

  if (shiftOption.startsWith("shift:")) {
    const selectedShiftId = Number(shiftOption.replace("shift:", ""))

    if (!Number.isInteger(selectedShiftId) || selectedShiftId <= 0) {
      throw new Error("shiftOption is invalid")
    }

    await assertShiftExists(selectedShiftId)

    return selectedShiftId
  }

  const startTime = getOptionalTime(formData, "startTime")
  const endTime = getOptionalTime(formData, "endTime")
  const templateName = shiftOption.startsWith("template:")
    ? shiftOption.replace("template:", "")
    : null
  const shiftName =
    templateName ?? `Custom ${startTime ?? "--:--"} - ${endTime ?? "--:--"}`

  if (shiftName !== "Libur" && (!startTime || !endTime)) {
    throw new Error("startTime and endTime are required")
  }

  const [shift] = await db
    .insert(shiftTable)
    .values({
      namaShift: shiftName,
      jamMulai: startTime ? `${startTime}:00` : null,
      jamSelesai: endTime ? `${endTime}:00` : null,
    })
    .returning({
      idShift: shiftTable.idShift,
    })

  return shift.idShift
}

export async function createSchedule(formData: FormData) {
  const tanggal = getRequiredDate(formData, "tanggal")
  const idKaryawan = getRequiredNumber(formData, "idKaryawan")
  const statusKehadiran = getAttendanceStatus(formData)
  const catatan = getOptionalString(formData, "catatan")

  await assertActiveKaryawanExists(idKaryawan)

  const idShift = await getScheduleShiftId(formData)

  await db.insert(jadwalTable).values({
    tanggal,
    idKaryawan,
    idShift,
    statusKehadiran,
    catatan,
  })

  revalidatePath("/admin/absen")
}

export async function deleteSchedule(formData: FormData) {
  const idJadwal = getRequiredNumber(formData, "idJadwal")

  await db.delete(jadwalTable).where(eq(jadwalTable.idJadwal, idJadwal))

  revalidatePath("/admin/absen")
}
