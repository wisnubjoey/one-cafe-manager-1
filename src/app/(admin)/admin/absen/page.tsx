import { asc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import {
  jadwalTable,
  karyawanTable,
  roleTable,
  shiftTable,
} from "@/db/schema"

import { AbsenCalendar, type CalendarEvent } from "./absen-calendar"

export const dynamic = "force-dynamic"

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDbDate(value: string | Date) {
  if (typeof value === "string") {
    return value
  }

  return formatDateKey(value)
}

function formatShiftTime(start: string | null, end: string | null) {
  if (!start && !end) {
    return "No time set"
  }

  if (!start || !end) {
    return start?.slice(0, 5) ?? end?.slice(0, 5) ?? "No time set"
  }

  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

export default async function AbsenPage() {
  const [jadwal, karyawan] = await Promise.all([
    db
      .select({
        idJadwal: jadwalTable.idJadwal,
        tanggal: jadwalTable.tanggal,
        statusKehadiran: jadwalTable.statusKehadiran,
        catatan: jadwalTable.catatan,
        employeeName: karyawanTable.name,
        roleName: roleTable.namaRole,
        shiftName: shiftTable.namaShift,
        jamMulai: shiftTable.jamMulai,
        jamSelesai: shiftTable.jamSelesai,
      })
      .from(jadwalTable)
      .leftJoin(karyawanTable, eq(jadwalTable.idKaryawan, karyawanTable.idKaryawan))
      .leftJoin(roleTable, eq(karyawanTable.idRole, roleTable.idRole))
      .leftJoin(shiftTable, eq(jadwalTable.idShift, shiftTable.idShift))
      .orderBy(asc(jadwalTable.tanggal)),
    db
      .select({
        idKaryawan: karyawanTable.idKaryawan,
        name: karyawanTable.name,
        roleName: roleTable.namaRole,
      })
      .from(karyawanTable)
      .leftJoin(roleTable, eq(karyawanTable.idRole, roleTable.idRole))
      .where(eq(karyawanTable.status, true))
      .orderBy(asc(karyawanTable.name)),
  ])

  const events: CalendarEvent[] = jadwal.map((item) => ({
    id: item.idJadwal,
    date: formatDbDate(item.tanggal),
    employee: item.employeeName ?? "Unknown karyawan",
    role: item.roleName ?? "No role",
    shift: item.shiftName ?? "Unknown shift",
    time: formatShiftTime(item.jamMulai, item.jamSelesai),
    status: item.statusKehadiran,
    catatan: item.catatan,
  }))

  return (
    <AbsenCalendar
      events={events}
      karyawan={karyawan.map((employee) => ({
        idKaryawan: employee.idKaryawan,
        name: employee.name,
        roleName: employee.roleName ?? "No role",
      }))}
    />
  )
}
