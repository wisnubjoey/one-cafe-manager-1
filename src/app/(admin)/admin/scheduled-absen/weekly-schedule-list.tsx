"use client"

import { useState } from "react"
import { CalendarBlank, Clock, Users } from "@phosphor-icons/react"

export type ScheduleItem = {
  idJadwal: number
  tanggal: string
  statusKehadiran: string | null
  approvalStatus: string | null
  catatan: string | null
  employeeName: string | null
  roleName: string | null
  shiftName: string | null
  jamMulai: string | null
  jamSelesai: string | null
}

export type GroupedJadwal = Record<string, Record<string, ScheduleItem[]>>

function formatShiftTime(start: string | null, end: string | null) {
  if (!start && !end) return "No time set"
  if (!start || !end)
    return start?.slice(0, 5) ?? end?.slice(0, 5) ?? "No time set"
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

export function WeeklyScheduleList({
  groupedJadwal,
}: {
  groupedJadwal: GroupedJadwal
}) {
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})

  if (Object.keys(groupedJadwal).length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 mb-4">
          <CalendarBlank className="size-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Belum ada jadwal</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Anda belum membuat jadwal absensi (scheduled absen). Silakan klik
          tombol "Create scheduled absen" untuk mulai membuat jadwal.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(groupedJadwal).map(([weekStart, daysMap]) => {
        const dateKeys = Object.keys(daysMap).sort()
        const activeDate = activeTabs[weekStart] || dateKeys[0]
        const schedules = daysMap[activeDate] || []

        const weekStartDate = new Date(weekStart)
        const weekEndDate = new Date(weekStart)
        weekEndDate.setDate(weekEndDate.getDate() + 6)

        const displayWeek = `${weekStartDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })} - ${weekEndDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`

        const hasPending = schedules.some(
          (s) => s.approvalStatus === "Pending" || !s.approvalStatus
        )
        const isAllApproved =
          schedules.length > 0 &&
          schedules.every((s) => s.approvalStatus === "Approved")

        return (
          <div
            key={weekStart}
            className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-col gap-1 border-b bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                <CalendarBlank className="size-4 opacity-70" />
                <span>Minggu: {displayWeek}</span>
              </div>
            </div>

            {/* Tabs for days */}
            <div className="flex gap-1 overflow-x-auto border-b bg-muted/10 p-2 scrollbar-hide">
              {dateKeys.map((dateStr) => {
                const d = new Date(dateStr)
                const dayName = d.toLocaleDateString("id-ID", { weekday: "short" })
                const dayNum = d.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "numeric",
                })
                const isActive = activeDate === dateStr

                return (
                  <button
                    key={dateStr}
                    onClick={() =>
                      setActiveTabs((prev) => ({ ...prev, [weekStart]: dateStr }))
                    }
                    className={`flex min-w-[60px] flex-col items-center rounded-md px-2 py-1.5 text-xs transition-colors ${
                      isActive
                        ? "bg-primary font-medium text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{dayName}</span>
                    <span className="text-[10px] opacity-80">{dayNum}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Day Header */}
            <div
              className={`flex flex-col gap-1 border-b px-4 py-2 ${
                hasPending
                  ? "bg-amber-50"
                  : isAllApproved
                  ? "bg-emerald-50"
                  : "bg-card"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <span>
                  {new Date(activeDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Users className="size-3.5 opacity-70" />
                <span>{schedules.length} karyawan dijadwalkan</span>
              </div>
            </div>

            {/* Schedules List */}
            <div className="flex max-h-[300px] flex-col gap-0 divide-y overflow-y-auto">
              {schedules.map((item) => (
                <div
                  key={item.idJadwal}
                  className="flex flex-col gap-2 p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.employeeName}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.roleName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          item.statusKehadiran === "Hadir"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : item.statusKehadiran === "Belum Hadir"
                            ? "border-muted bg-muted text-muted-foreground"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.statusKehadiran}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          item.approvalStatus === "Approved"
                            ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                            : item.approvalStatus === "Pending" ||
                              !item.approvalStatus
                            ? "border-amber-200 bg-amber-100 text-amber-800"
                            : "border-gray-200 bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.approvalStatus ?? "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      <span>
                        {item.shiftName} (
                        {formatShiftTime(item.jamMulai, item.jamSelesai)})
                      </span>
                    </div>
                    {item.catatan && (
                      <div className="mt-1 rounded-md bg-muted/50 p-2 text-[11px] italic">
                        &quot;{item.catatan}&quot;
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
