"use client"

import { useState } from "react"
import { CaretDown, CaretRight } from "@phosphor-icons/react"

import type { MenuItemRow, MenuSubItems } from "@/app/(admin)/admin/menu/menu-item-dialog"

type Props = {
  item: MenuItemRow
  subItems: MenuSubItems
}

export function MenuCard({ item, subItems }: Props) {
  const [expanded, setExpanded] = useState(false)

  const hasDetails =
    subItems.bahan.length > 0 ||
    subItems.langkah.length > 0 ||
    subItems.alat.length > 0

  return (
    <div className="flex flex-col border">
      {/* Card body */}
      <div className="flex flex-col gap-2 p-4">
        {/* Image */}
        {item.pathGambar ? (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={item.pathGambar}
              alt={item.judul}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            No Image
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold">{item.judul}</h3>

        {/* Description */}
        {item.catatanTeknis ? (
          <p className="text-sm text-muted-foreground">
            {item.catatanTeknis}
          </p>
        ) : null}

        {/* Type badge */}
        <span className="inline-block self-start rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
          {item.tipe === "final" ? "Menu" : "Prep"}
        </span>
      </div>

      {/* Expand details */}
      {hasDetails ? (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <span>{expanded ? "Hide Details" : "View Details"}</span>
            {expanded ? (
              <CaretDown className="size-3" />
            ) : (
              <CaretRight className="size-3" />
            )}
          </button>

          {expanded ? (
            <div className="border-t bg-muted/20 px-4 py-3 text-xs">
              {/* Bahan (Ingredients) */}
              {subItems.bahan.length > 0 ? (
                <div className="mb-3 last:mb-0">
                  <h4 className="mb-1 font-medium text-muted-foreground">
                    Ingredients
                  </h4>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="py-1 pr-2 font-medium">Name</th>
                        <th className="py-1 px-2 font-medium">Amount</th>
                        <th className="py-1 pl-2 font-medium">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subItems.bahan.map((b) => (
                        <tr key={b.idBahan} className="border-b last:border-0">
                          <td className="py-1 pr-2">{b.namaBahan}</td>
                          <td className="py-1 px-2">{b.jumlah}</td>
                          <td className="py-1 pl-2">{b.satuan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {/* Langkah (Steps) */}
              {subItems.langkah.length > 0 ? (
                <div className="mb-3 last:mb-0">
                  <h4 className="mb-1 font-medium text-muted-foreground">
                    Steps
                  </h4>
                  <ol className="list-inside list-decimal">
                    {subItems.langkah.map((l) => (
                      <li key={l.idLangkah} className="py-0.5">
                        {l.instruksi}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/* Alat (Tools) */}
              {subItems.alat.length > 0 ? (
                <div>
                  <h4 className="mb-1 font-medium text-muted-foreground">
                    Tools
                  </h4>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="py-1 pr-2 font-medium">Name</th>
                        <th className="py-1 pl-2 font-medium">Specs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subItems.alat.map((a) => (
                        <tr key={a.idAlat} className="border-b last:border-0">
                          <td className="py-1 pr-2">{a.namaAlat}</td>
                          <td className="py-1 pl-2">
                            {a.spesifikasi ?? (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
