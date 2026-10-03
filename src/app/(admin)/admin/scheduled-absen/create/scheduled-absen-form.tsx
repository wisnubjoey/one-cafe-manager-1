"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { createBulkSchedule, createWeeklySchedule } from "./actions"

export type KaryawanOption = {
  idKaryawan: number
  name: string
  roleName: string
}

const shiftTemplates = [
  {
    value: "template:Pagi",
    label: "Pagi",
    startTime: "08:00",
    endTime: "16:00",
  },
  {
    value: "template:Middle",
    label: "Middle",
    startTime: "11:00",
    endTime: "19:00",
  },
  {
    value: "template:Malam",
    label: "Malam",
    startTime: "16:00",
    endTime: "00:00",
  },
  {
    value: "template:Libur",
    label: "Libur",
    startTime: "",
    endTime: "",
  },
  {
    value: "template:Lembur",
    label: "Lembur",
    startTime: "16:00",
    endTime: "22:00",
  },
]

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getNext7Days(startDateStr: string) {
  const dates = []
  const start = new Date(startDateStr)
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(start)
    nextDate.setDate(start.getDate() + i)
    dates.push(formatDateKey(nextDate))
  }
  return dates
}

function getDayName(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "long" })
}

export function ScheduledAbsenForm({
  karyawan,
}: {
  karyawan: KaryawanOption[]
}) {
  const router = useRouter()
  const [mode, setMode] = useState<"daily" | "weekly">("daily")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // -- Daily State --
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()))
  const [selectedShiftOption, setSelectedShiftOption] = useState(shiftTemplates[0].value)
  const [startTime, setStartTime] = useState(shiftTemplates[0].startTime)
  const [endTime, setEndTime] = useState(shiftTemplates[0].endTime)
  const [selectedKaryawan, setSelectedKaryawan] = useState<number[]>([])
  const [catatan, setCatatan] = useState("")

  // -- Weekly State --
  const [weeklyStartDate, setWeeklyStartDate] = useState(() => formatDateKey(new Date()))
  const [activeTab, setActiveTab] = useState(0)
  
  type ScheduleBlock = {
    id: string
    shiftOption: string
    startTime: string
    endTime: string
    catatan: string
    karyawanIds: number[]
  }
  
  const [weeklyData, setWeeklyData] = useState<Record<string, ScheduleBlock[]>>({})
  
  const weeklyDates = getNext7Days(weeklyStartDate)

  const getDayBlocks = (date: string): ScheduleBlock[] => {
    if (weeklyData[date] && weeklyData[date].length > 0) {
      return weeklyData[date]
    }
    return [
      {
        id: Math.random().toString(36).substring(7),
        shiftOption: shiftTemplates[0].value,
        startTime: shiftTemplates[0].startTime,
        endTime: shiftTemplates[0].endTime,
        catatan: "",
        karyawanIds: [],
      }
    ]
  }

  const updateBlock = (date: string, blockId: string, partial: Partial<ScheduleBlock>) => {
    setWeeklyData((prev) => {
      const blocks = getDayBlocks(date)
      return {
        ...prev,
        [date]: blocks.map((b) => (b.id === blockId ? { ...b, ...partial } : b)),
      }
    })
  }

  const addBlock = (date: string) => {
    setWeeklyData((prev) => {
      const blocks = getDayBlocks(date)
      return {
        ...prev,
        [date]: [
          ...blocks,
          {
            id: Math.random().toString(36).substring(7),
            shiftOption: shiftTemplates[0].value,
            startTime: shiftTemplates[0].startTime,
            endTime: shiftTemplates[0].endTime,
            catatan: "",
            karyawanIds: [],
          },
        ],
      }
    })
  }

  const removeBlock = (date: string, blockId: string) => {
    setWeeklyData((prev) => {
      const blocks = getDayBlocks(date).filter((b) => b.id !== blockId)
      return {
        ...prev,
        [date]:
          blocks.length > 0
            ? blocks
            : [
                {
                  id: Math.random().toString(36).substring(7),
                  shiftOption: shiftTemplates[0].value,
                  startTime: shiftTemplates[0].startTime,
                  endTime: shiftTemplates[0].endTime,
                  catatan: "",
                  karyawanIds: [],
                },
              ],
      }
    })
  }

  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedKaryawan.length === 0) return
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("tanggal", selectedDate)
    formData.append("shiftOption", selectedShiftOption)
    formData.append("startTime", startTime)
    formData.append("endTime", endTime)
    formData.append("catatan", catatan)
    selectedKaryawan.forEach((id) => formData.append("karyawanIds", id.toString()))

    await createBulkSchedule(formData)
    
    setIsSubmitting(false)
    router.push("/admin/scheduled-absen")
  }

  const handleWeeklySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = []
    for (const date of weeklyDates) {
      const blocks = getDayBlocks(date)
      for (const b of blocks) {
        if (b.karyawanIds.length > 0) {
          payload.push({
            tanggal: date,
            shiftOption: b.shiftOption,
            startTime: b.startTime,
            endTime: b.endTime,
            catatan: b.catatan,
            karyawanIds: b.karyawanIds,
          })
        }
      }
    }

    if (payload.length === 0) {
      alert("Harap pilih minimal satu karyawan untuk jadwal mingguan.")
      setIsSubmitting(false)
      return
    }

    await createWeeklySchedule(payload)
    
    setIsSubmitting(false)
    router.push("/admin/scheduled-absen")
  }

  return (
    <div className="flex flex-col gap-6 rounded-md border bg-background p-6">
      {/* Mode Toggle */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          type="button"
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
            mode === "daily"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          }`}
          onClick={() => setMode("daily")}
        >
          Daily
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
            mode === "weekly"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50"
          }`}
          onClick={() => setMode("weekly")}
        >
          Weekly (7 Days)
        </button>
      </div>

      {mode === "daily" ? (
        // DAILY FORM
        <form onSubmit={handleDailySubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Tanggal</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Shift</label>
            <select
              value={selectedShiftOption}
              onChange={(e) => {
                const v = e.target.value
                setSelectedShiftOption(v)
                const t = shiftTemplates.find((x) => x.value === v)
                setStartTime(t?.startTime || "")
                setEndTime(t?.endTime || "")
              }}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              required
            >
              {shiftTemplates.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required={!selectedShiftOption.includes("Libur")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required={!selectedShiftOption.includes("Libur")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Karyawan (Pilih yang ditugaskan)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() =>
                  setSelectedKaryawan(
                    selectedKaryawan.length === karyawan.length
                      ? []
                      : karyawan.map((k) => k.idKaryawan)
                  )
                }
              >
                {selectedKaryawan.length === karyawan.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto rounded-md border p-3 sm:grid-cols-2">
              {karyawan.map((employee) => (
                <label
                  key={employee.idKaryawan}
                  className="flex cursor-pointer items-center gap-3 rounded-md border p-2 hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={selectedKaryawan.includes(employee.idKaryawan)}
                    onChange={() =>
                      setSelectedKaryawan((prev) =>
                        prev.includes(employee.idKaryawan)
                          ? prev.filter((x) => x !== employee.idKaryawan)
                          : [...prev, employee.idKaryawan]
                      )
                    }
                    className="size-4 rounded border-input bg-background accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">
                      {employee.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {employee.roleName}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Catatan</label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              placeholder="Optional note"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || selectedKaryawan.length === 0}
            className="w-full"
          >
            {isSubmitting ? "Saving..." : "Save Daily Schedule"}
          </Button>
        </form>
      ) : (
        // WEEKLY FORM
        <form onSubmit={handleWeeklySubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Start Date (7 Days)</label>
            <Input
              type="date"
              value={weeklyStartDate}
              onChange={(e) => {
                setWeeklyStartDate(e.target.value)
                setActiveTab(0)
              }}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Schedules will be created from{" "}
              {new Date(weeklyStartDate).toLocaleDateString("id-ID")} to{" "}
              {new Date(weeklyDates[6]).toLocaleDateString("id-ID")}.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {weeklyDates.map((date, idx) => {
              const assignedCount = getDayBlocks(date).reduce((sum, b) => sum + b.karyawanIds.length, 0)
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`flex flex-col items-center min-w-[70px] rounded-lg border px-3 py-2 text-xs transition-colors ${
                    activeTab === idx
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="font-semibold">{getDayName(date).substring(0, 3)}</span>
                  <span className="text-[10px] mt-0.5">{date.split("-")[2]}/{date.split("-")[1]}</span>
                  {assignedCount > 0 && (
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Form for Active Tab */}
          {(() => {
            const currentDate = weeklyDates[activeTab]
            const currentBlocks = getDayBlocks(currentDate)
            
            const totalAssigned = currentBlocks.reduce((sum, b) => sum + b.karyawanIds.length, 0)

            return (
              <div className="flex flex-col gap-6 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">
                    Schedule for {getDayName(currentDate)},{" "}
                    {new Date(currentDate).toLocaleDateString("id-ID")}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {totalAssigned} karyawan assigned
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(currentDate)}
                      className="h-7 text-xs"
                    >
                      + Add Shift
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {currentBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 relative rounded-lg border p-4 bg-muted/20"
                    >
                      {currentBlocks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeBlock(currentDate, block.id)}
                        >
                          &times;
                        </Button>
                      )}

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium">Shift {index + 1}</label>
                          <select
                            value={block.shiftOption}
                            onChange={(e) => {
                              const v = e.target.value
                              const t = shiftTemplates.find((x) => x.value === v)
                              updateBlock(currentDate, block.id, {
                                shiftOption: v,
                                startTime: t?.startTime || "",
                                endTime: t?.endTime || "",
                              })
                            }}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                          >
                            {shiftTemplates.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Start Time</label>
                            <Input
                              type="time"
                              value={block.startTime}
                              onChange={(e) =>
                                updateBlock(currentDate, block.id, { startTime: e.target.value })
                              }
                              required={!block.shiftOption.includes("Libur")}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">End Time</label>
                            <Input
                              type="time"
                              value={block.endTime}
                              onChange={(e) =>
                                updateBlock(currentDate, block.id, { endTime: e.target.value })
                              }
                              required={!block.shiftOption.includes("Libur")}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium">Catatan</label>
                          <textarea
                            rows={2}
                            value={block.catatan}
                            onChange={(e) =>
                              updateBlock(currentDate, block.id, { catatan: e.target.value })
                            }
                            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                            placeholder="Optional note for this shift"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Karyawan</label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() =>
                              updateBlock(currentDate, block.id, {
                                karyawanIds:
                                  block.karyawanIds.length === karyawan.length
                                    ? []
                                    : karyawan.map((k) => k.idKaryawan),
                              })
                            }
                          >
                            {block.karyawanIds.length === karyawan.length
                              ? "Deselect All"
                              : "Select All"}
                          </Button>
                        </div>
                        <div className="grid max-h-[250px] grid-cols-1 gap-2 overflow-y-auto rounded-md border p-3 bg-background">
                          {karyawan.map((employee) => {
                            const assignedOtherBlock = currentBlocks.some(
                              (b) => b.id !== block.id && b.karyawanIds.includes(employee.idKaryawan)
                            )
                            return (
                              <label
                                key={employee.idKaryawan}
                                className={`flex cursor-pointer items-center gap-3 rounded-md border p-2 hover:bg-muted/50 ${
                                  assignedOtherBlock ? "opacity-50 grayscale" : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={block.karyawanIds.includes(employee.idKaryawan)}
                                  onChange={() => {
                                    const ids = block.karyawanIds
                                    const newIds = ids.includes(employee.idKaryawan)
                                      ? ids.filter((id) => id !== employee.idKaryawan)
                                      : [...ids, employee.idKaryawan]
                                    updateBlock(currentDate, block.id, { karyawanIds: newIds })
                                  }}
                                  className="size-4 rounded border-input bg-background accent-primary"
                                />
                                <div className="flex flex-col w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-medium leading-none">
                                      {employee.name}
                                    </span>
                                    {assignedOtherBlock && (
                                      <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                                        Assigned to Shift {currentBlocks.findIndex((b) => b.karyawanIds.includes(employee.idKaryawan)) + 1}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground mt-0.5">
                                    {employee.roleName}
                                  </span>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? "Saving..." : "Save Weekly Schedule"}
          </Button>
        </form>
      )}
    </div>
  )
}
