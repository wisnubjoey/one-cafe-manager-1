"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PurchasingNavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface PurchasingSidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  officerName?: string;
  budgetLabel?: string;
  className?: string;
}

export function PurchasingSidebar({
  activeItem,
  onItemClick,
  officerName = "OFFICER · J. DOE",
  budgetLabel = "Q3 BUDGET",
  className = "",
}: PurchasingSidebarProps) {
  const pathname = usePathname();

  const navItems: PurchasingNavItem[] = [
    {
      id: "log",
      label: "LOG",
      href: "/purchase-invoice",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v16H4z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      ),
    },
    {
      id: "inbox",
      label: "INBOX",
      href: "/purchase-invoice/inbox",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      ),
    },
    {
      id: "reports",
      label: "REPORTS",
      href: "/purchase-invoice#reports",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="20" x2="4" y2="10" />
          <line x1="10" y1="20" x2="10" y2="4" />reload

          <line x1="16" y1="20" x2="16" y2="14" />
          <line x1="22" y1="20" x2="22" y2="8" />
        </svg>
      ),
    },
    {
      id: "budget",
      label: "BUDGET",
      href: "/purchase-invoice#budget",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      id: "sync",
      label: "SYNC",
      href: "/purchase-invoice#sync",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-7.9-4.7" />
          <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 7.9 4.7" />
          <polyline points="21 4 21 9 16 9" />
          <polyline points="3 20 3 15 8 15" />
        </svg>
      ),
    },
  ];

  // Determine active item: check prop first, then match pathname
  const currentActive =
    activeItem ??
    (pathname === "/purchase-invoice/inbox" || pathname?.startsWith("/purchase-invoice/inbox")
      ? "inbox"
      : pathname === "/purchase-invoice" || pathname === "/purchase-invoice/create"
        ? "log"
        : "log");

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .purchasing-sidebar {
            width: 240px;
            background: #ffffff;
            border-right: 2px solid #000000;
            display: flex;
            flex-direction: column;
            padding: 28px 0;
            flex-shrink: 0;
            position: sticky;
            top: 0;
            height: 100vh;
            font-family: 'Space Grotesk', system-ui, sans-serif;
            box-sizing: border-box;
            z-index: 20;
        }

        .purchasing-sidebar * {
            box-sizing: border-box;
        }

        .purchasing-brand {
            font-family: 'Archivo Black', sans-serif;
            font-size: 22px;
            letter-spacing: 0.14em;
            padding: 0 28px 28px;
            border-bottom: 1px solid #e6e6e6;
            color: #000000;
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .purchasing-brand .dot {
            display: inline-block;
            width: 9px;
            height: 9px;
            background: #000000;
            border-radius: 50%;
            margin-left: 2px;
            transform: translateY(-4px);
            animation: purchasingPulseDot 2.4s cubic-bezier(.2, .8, .2, 1) infinite;
        }

        @keyframes purchasingPulseDot {
            0%, 100% { opacity: 1; }
            50% { opacity: .25; }
        }

        .purchasing-nav {
            padding: 24px 0;
            flex: 1;
            list-style: none;
            margin: 0;
        }

        .purchasing-nav li {
            margin-bottom: 4px;
        }

        .purchasing-nav-btn {
            width: 100%;
            text-align: left;
            padding: 14px 28px;
            display: flex;
            align-items: center;
            gap: 14px;
            font-family: 'Archivo Black', sans-serif;
            font-size: 14px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-left: 4px solid transparent;
            transition: background .15s cubic-bezier(.2, .8, .2, 1), border-color .15s cubic-bezier(.2, .8, .2, 1);
            color: #000000;
            text-decoration: none;
            background: none;
            border-top: none;
            border-right: none;
            border-bottom: none;
            cursor: pointer;
        }

        .purchasing-nav-btn svg {
            width: 18px;
            height: 18px;
            stroke-width: 2;
            flex-shrink: 0;
        }

        .purchasing-nav-btn.active {
            background: #f4f4f4;
            border-left-color: #000000;
        }

        .purchasing-nav-btn:hover:not(.active) {
            background: #f4f4f4;
        }

        .purchasing-sidebar-foot {
            padding: 20px 28px;
            border-top: 1px solid #e6e6e6;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.15em;
            color: #6e6e6e;
            text-transform: uppercase;
            line-height: 1.6;
        }
      ` }} />

      <aside className={`purchasing-sidebar ${className}`.trim()}>
        <Link href="/purchase-invoice" className="purchasing-brand">
          PROCURE<span className="dot"></span>
        </Link>

        <ul className="purchasing-nav">
          {navItems.map((item) => {
            const isActive = currentActive === item.id;
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`purchasing-nav-btn ${isActive ? "active" : ""}`}
                    onClick={() => onItemClick?.(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`purchasing-nav-btn ${isActive ? "active" : ""}`}
                    onClick={() => onItemClick?.(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="purchasing-sidebar-foot">
          {officerName}
          <br />
          {budgetLabel}
        </div>
      </aside>
    </>
  );
}
