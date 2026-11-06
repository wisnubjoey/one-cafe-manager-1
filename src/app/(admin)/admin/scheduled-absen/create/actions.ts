"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db/client"
import { jadwalTable, shiftTable } from "@/db/schema"

export async function createBulkSchedule(formData: FormData) {
  const tanggal = formData.get("tanggal") as string
  const shiftOption = formData.get("shiftOption") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const catatan = formData.get("catatan") as string | null
  const karyawanIds = formData
    .getAll("karyawanIds")
    .map((id) => parseInt(id as string, 10))

  if (!tanggal || !shiftOption || karyawanIds.length === 0) {
    throw new Error("Missing required fields")
  }

  // 1. Insert Shift
  const shiftName = shiftOption.startsWith("template:")
    ? shiftOption.replace("template:", "")
    : "Custom Shift"

  const [newShift] = await db
    .insert(shiftTable)
    .values({
      namaShift: shiftName,
      jamMulai: startTime
        ? startTime.length === 5
          ? `${startTime}:00`
          : startTime
        : null,
      jamSelesai: endTime
        ? endTime.length === 5
          ? `${endTime}:00`
          : endTime
        : null,
    })
    .returning({ idShift: shiftTable.idShift })

  const idShift = newShift.idShift

  // 2. Insert jadwal for each selected karyawan
  const insertValues = karyawanIds.map((idKaryawan) => ({
    tanggal, // Already in YYYY-MM-DD from input type="date"
    idKaryawan,
    idShift,
    statusKehadiran: "Belum Hadir" as const,
    approvalStatus: "Pending" as const,
    catatan: catatan || null,
  }))

  await db.insert(jadwalTable).values(insertValues)

  revalidatePath("/admin/absen")
  revalidatePath("/admin/scheduled-absen")
}

export type WeeklyScheduleDay = {
  tanggal: string
  shiftOption: string
  startTime: string
  endTime: string
  catatan: string
  karyawanIds: number[]
}

export async function createWeeklySchedule(days: WeeklyScheduleDay[]) {
  if (!days || days.length === 0) {
    throw new Error("No schedules provided")
  }

  for (const day of days) {
    if (day.karyawanIds.length === 0) continue

    const shiftName = day.shiftOption.startsWith("template:")
      ? day.shiftOption.replace("template:", "")
      : "Custom Shift"

    const [newShift] = await db
      .insert(shiftTable)
      .values({
        namaShift: shiftName,
        jamMulai: day.startTime
          ? day.startTime.length === 5
            ? `${day.startTime}:00`
            : day.startTime
          : null,
        jamSelesai: day.endTime
          ? day.endTime.length === 5
            ? `${day.endTime}:00`
            : day.endTime
          : null,
      })
      .returning({ idShift: shiftTable.idShift })

    const idShift = newShift.idShift

    const insertValues = day.karyawanIds.map((idKaryawan) => ({
      tanggal: day.tanggal,
      idKaryawan,
      idShift,
      statusKehadiran: "Belum Hadir" as const,
      approvalStatus: "Pending" as const,
      catatan: day.catatan || null,
    }))

    await db.insert(jadwalTable).values(insertValues)
  }

  revalidatePath("/admin/absen")
  revalidatePath("/admin/scheduled-absen")
}
