"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Plus,
  Trash,
  PencilSimple,
  Receipt,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { deletePurchaseInvoice } from "@/app/(admin)/admin/purchase-invoice/actions"

export type PurchaseInvoiceEvent = {
  id: string
  date: string
  title: string
  description: string | null
}

type PurchaseInvoiceCalendarProps = {
  events: PurchaseInvoiceEvent[]
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)

  startDate.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    return date
  })
}

export function PurchaseInvoiceCalendar({
  events,
}: PurchaseInvoiceCalendarProps) {
  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today))

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth]
  )

  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const selectedLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )

  const selectedEvents = events.filter((event) => event.date === selectedDate)
  const visibleMonthEvents = events.filter((event) => {
    const eventDate = new Date(`${event.date}T00:00:00`)

    return (
      eventDate.getMonth() === visibleMonth.getMonth() &&
      eventDate.getFullYear() === visibleMonth.getFullYear()
    )
  })

  const moveMonth = (direction: number) => {
    setVisibleMonth((current) => {
      const nextMonth = new Date(current)
      nextMonth.setMonth(current.getMonth() + direction)

      return nextMonth
    })
  }

  const goToToday = () => {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(formatDateKey(today))
  }

  const createUrl = `/admin/purchase-invoice/create?date=${selectedDate}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Purchase Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track purchase invoices by date.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => moveMonth(-1)}>
            <CaretLeft />
          </Button>
          <div className="flex h-8 min-w-40 items-center justify-center border px-3 text-sm font-medium">
            {monthLabel}
          </div>
          <Button variant="outline" size="icon" onClick={() => moveMonth(1)}>
            <CaretRight />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button asChild>
            <Link href={createUrl}>
              <Plus />
              Add Invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <section className="overflow-hidden border bg-background">
          <div className="grid grid-cols-7 border-b bg-muted/40">
            {weekdays.map((day) => (
              <div
                key={day}
                className="border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((date) => {
              const dateKey = formatDateKey(date)
              const dayEvents = events.filter((event) => event.date === dateKey)
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
              const isSelected = dateKey === selectedDate
              const isToday = dateKey === formatDateKey(today)

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={[
                    "min-h-32 border-r border-b p-2 text-left transition-colors last:border-r-0 hover:bg-muted/50",
                    isSelected ? "bg-muted" : "bg-background",
                    isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground/50",
                  ].join(" ")}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={[
                        "flex size-6 items-center justify-center text-xs font-medium",
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-inherit",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 ? (
                      <span className="text-[10px] text-muted-foreground">
                        {dayEvents.length} invoice{dayEvents.length !== 1 && "s"}
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="truncate border bg-sky-50 border-sky-200 text-sky-700 px-1.5 py-1 text-[11px]"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 ? (
                      <div className="text-[11px] text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="border bg-background p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Selected Day</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedLabel}
                </p>
              </div>
              <CalendarBlank className="size-5 text-muted-foreground" />
            </div>

            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="border p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-medium">{event.title}</h3>
                      </div>
                        <div className="flex items-center gap-1.5">
                          <form action={deletePurchaseInvoice}>
                            <input type="hidden" name="id" value={event.id} />
                            <Button
                              type="submit"
                              variant="destructive"
                              size="icon-xs"
                              aria-label={`Delete invoice ${event.title}`}
                            >
                              <Trash />
                            </Button>
                          </form>
                        </div>
                    </div>
                    {event.description && (
                      <div className="text-xs text-muted-foreground mt-2">
                        <p className="whitespace-pre-wrap">{event.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed p-4 text-sm text-muted-foreground">
                No invoices for this date.
              </div>
            )}
          </section>

          <section className="border bg-background p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Month Summary</h2>
                <p className="text-sm text-muted-foreground">{monthLabel}</p>
              </div>
              <Receipt className="size-5 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="border p-3">
                <p className="text-xs text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-semibold">
                  {visibleMonthEvents.length}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
