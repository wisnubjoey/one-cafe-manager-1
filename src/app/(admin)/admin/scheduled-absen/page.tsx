import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { jadwalTable, karyawanTable, roleTable, shiftTable } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { WeeklyScheduleList, GroupedJadwal } from "./weekly-schedule-list";

export const dynamic = "force-dynamic";

function formatDbDate(value: string | Date) {
  if (typeof value === "string") return value;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonday(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return formatDbDate(d);
}

export default async function ScheduledAbsenPage() {
  const jadwal = await db
    .select({
      idJadwal: jadwalTable.idJadwal,
      tanggal: jadwalTable.tanggal,
      statusKehadiran: jadwalTable.statusKehadiran,
      approvalStatus: jadwalTable.approvalStatus,
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
    .orderBy(asc(jadwalTable.tanggal));

  // Group by week
  const groupedJadwal = jadwal.reduce((acc, curr) => {
    const dateStr = formatDbDate(curr.tanggal);
    const weekStart = getMonday(dateStr);
    
    if (!acc[weekStart]) acc[weekStart] = {};
    if (!acc[weekStart][dateStr]) acc[weekStart][dateStr] = [];
    
    acc[weekStart][dateStr].push(curr);
    return acc;
  }, {} as GroupedJadwal);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-normal">Scheduled Absen</h1>
          <p className="text-sm text-muted-foreground">
            Manage scheduled attendance and shift rosters.
          </p>
        </div>
        <div className="flex items-center">
          <Button asChild>
            <Link href="/admin/scheduled-absen/create">
              <Plus className="mr-1.5 size-4" />
              Create scheduled absen
            </Link>
          </Button>
        </div>
      </div>

      <WeeklyScheduleList groupedJadwal={groupedJadwal} />
    </div>
  );
}
