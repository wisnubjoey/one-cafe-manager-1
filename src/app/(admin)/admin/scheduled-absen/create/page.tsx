import { asc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { karyawanTable, roleTable } from "@/db/schema"

import { ScheduledAbsenForm } from "./scheduled-absen-form"

export const dynamic = "force-dynamic"

export default async function CreateScheduledAbsenPage() {
  const karyawan = await db
    .select({
      idKaryawan: karyawanTable.idKaryawan,
      name: karyawanTable.name,
      roleName: roleTable.namaRole,
    })
    .from(karyawanTable)
    .leftJoin(roleTable, eq(karyawanTable.idRole, roleTable.idRole))
    .where(eq(karyawanTable.status, true))
    .orderBy(asc(karyawanTable.name))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-normal">
          Create Scheduled Absen
        </h1>
        <p className="text-sm text-muted-foreground">
          Create new shift schedules for multiple employees.
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <ScheduledAbsenForm
          karyawan={karyawan.map((employee) => ({
            idKaryawan: employee.idKaryawan,
            name: employee.name,
            roleName: employee.roleName ?? "No role",
          }))}
        />
      </div>
    </div>
  )
}
