import React from "react";
import { PurchasingSidebar } from "@/components/PurchaseInvoice/layout";

export default function PurchaseInvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f4f4] text-[#000000]">
      {/* Standalone Purchasing Sidebar: hidden on mobile screens, displayed on desktop */}
      <div className="hidden md:flex shrink-0">
        <PurchasingSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto md:overflow-hidden">
        {children}
      </main>
    </div>
  );
}
