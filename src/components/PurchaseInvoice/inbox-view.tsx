"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export interface InvoiceItem {
  id: string;
  invoiceDate: string;
  title: string;
  description: string | null;
  createdAt?: string;
}

export function InboxView({ initialInvoices }: { initialInvoices: InvoiceItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "recent" | "pending">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.invoiceDate.includes(searchQuery);

      if (!matchSearch) return false;

      if (filterTab === "recent") {
        // Just show first 5 or today/yesterday
        return true;
      }

      return true;
    });
  }, [initialInvoices, searchQuery, filterTab]);

  const selectedItem = useMemo(() => {
    return initialInvoices.find((inv) => inv.id === selectedId) || null;
  }, [initialInvoices, selectedId]);

  return (
    <div className="inbox-container">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .inbox-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
          background: #f4f4f4;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          color: #000000;
          overflow: hidden;
          box-sizing: border-box;
        }

        .inbox-header {
          height: 80px;
          background: #ffffff;
          border-bottom: 2px solid #000000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          flex-shrink: 0;
        }

        .inbox-header h1 {
          font-family: 'Archivo Black', sans-serif;
          font-size: 26px;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .inbox-badge {
          background: #000000;
          color: #ffffff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 4px 8px;
          letter-spacing: 0.1em;
        }

        .inbox-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-create {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #000000;
          color: #ffffff;
          padding: 10px 18px;
          font-family: 'Archivo Black', sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border: 2px solid #000000;
          transition: background 0.15s, color 0.15s;
        }

        .btn-create:hover {
          background: #ffffff;
          color: #000000;
        }

        .inbox-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr ${selectedItem ? "420px" : "0px"};
          overflow: hidden;
          transition: grid-template-columns 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .inbox-main-col {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-right: ${selectedItem ? "2px solid #000000" : "none"};
          background: #ffffff;
        }

        .inbox-toolbar {
          padding: 16px 32px;
          background: #ffffff;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f4f4f4;
          border: 1px solid #000000;
          padding: 8px 14px;
          min-width: 260px;
          flex: 1;
          max-width: 440px;
        }

        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 14px;
          width: 100%;
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
        }

        .filter-tab {
          font-family: 'Archivo Black', sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 14px;
          border: 1px solid transparent;
          background: none;
          cursor: pointer;
          color: #6e6e6e;
          transition: all 0.15s;
        }

        .filter-tab.active {
          background: #000000;
          color: #ffffff;
          border-color: #000000;
        }

        .inbox-list {
          flex: 1;
          overflow-y: auto;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .inbox-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid #e6e6e6;
          cursor: pointer;
          transition: background 0.15s;
        }

        .inbox-item:hover {
          background: #fbfbfb;
        }

        .inbox-item.selected {
          background: #f4f4f4;
          border-left: 4px solid #000000;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 20px;
          min-width: 0;
        }

        .item-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #6e6e6e;
          width: 90px;
          flex-shrink: 0;
        }

        .item-info {
          min-width: 0;
        }

        .item-title {
          font-family: 'Archivo Black', sans-serif;
          font-size: 14px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-desc {
          font-size: 12px;
          color: #6e6e6e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 480px;
        }

        .item-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .item-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 3px 8px;
          border: 1px solid #000000;
          text-transform: uppercase;
          background: #ffffff;
        }

        .inbox-detail-col {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .detail-header {
          padding: 24px;
          border-bottom: 2px solid #000000;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-header h3 {
          font-family: 'Archivo Black', sans-serif;
          font-size: 16px;
          letter-spacing: 0.08em;
          margin: 0;
          text-transform: uppercase;
        }

        .close-btn {
          border: 1px solid #000000;
          padding: 4px 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          background: none;
          cursor: pointer;
        }

        .detail-body {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #6e6e6e;
          text-transform: uppercase;
        }

        .field-value {
          font-size: 15px;
          font-weight: 500;
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #6e6e6e;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .inbox-header {
            padding: 0 16px;
            height: 64px;
          }
          .inbox-header h1 {
            font-size: 18px;
          }
          .inbox-toolbar {
            padding: 12px 16px;
          }
          .inbox-item {
            padding: 14px 16px;
          }
          .item-date {
            display: none;
          }
        }
      ` }} />

      {/* Header */}
      <header className="inbox-header">
        <h1>
          Inbox
          <span className="inbox-badge">{filteredInvoices.length} ITEMS</span>
        </h1>
        <div className="inbox-actions">
          <Link href="/purchase-invoice/create" className="btn-create">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Invoice
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="inbox-body">
        <section className="inbox-main-col">
          {/* Toolbar */}
          <div className="inbox-toolbar">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search vendor, title, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              <button
                type="button"
                className={`filter-tab ${filterTab === "all" ? "active" : ""}`}
                onClick={() => setFilterTab("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-tab ${filterTab === "recent" ? "active" : ""}`}
                onClick={() => setFilterTab("recent")}
              >
                Recent
              </button>
            </div>
          </div>

          {/* List */}
          {filteredInvoices.length === 0 ? (
            <div className="empty-state">— No invoices found in inbox —</div>
          ) : (
            <ul className="inbox-list">
              {filteredInvoices.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <li
                    key={item.id}
                    className={`inbox-item ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedId(isSelected ? null : item.id)}
                  >
                    <div className="item-left">
                      <span className="item-date">{item.invoiceDate}</span>
                      <div className="item-info">
                        <div className="item-title">{item.title}</div>
                        <div className="item-desc">
                          {item.description || "No additional description provided"}
                        </div>
                      </div>
                    </div>

                    <div className="item-right">
                      <span className="item-tag">RECEIVED</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Detail Panel */}
        {selectedItem && (
          <aside className="inbox-detail-col">
            <div className="detail-header">
              <h3>Invoice Detail</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedId(null)}
              >
                CLOSE [×]
              </button>
            </div>

            <div className="detail-body">
              <div className="detail-field">
                <span className="field-label">RECORD ID</span>
                <span className="field-value font-mono text-xs">{selectedItem.id}</span>
              </div>

              <div className="detail-field">
                <span className="field-label">INVOICE TITLE / VENDOR</span>
                <span className="field-value text-lg font-bold">{selectedItem.title}</span>
              </div>

              <div className="detail-field">
                <span className="field-label">INVOICE DATE</span>
                <span className="field-value font-mono">{selectedItem.invoiceDate}</span>
              </div>

              <div className="detail-field">
                <span className="field-label">DESCRIPTION</span>
                <span className="field-value text-sm leading-relaxed bg-[#f4f4f4] p-3 border border-black">
                  {selectedItem.description || "No description provided."}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-black flex gap-3">
                <Link
                  href="/purchase-invoice"
                  className="btn-create text-center w-full justify-center"
                >
                  View In Log
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
