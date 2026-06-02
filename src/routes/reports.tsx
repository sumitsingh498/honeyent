import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Factory,
  Truck,
  IdCard,
  Package,
  FileText,
  Receipt,
  Route as RouteIcon,
  Scale,
  TrendingUp,
  Download,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Honey Enterprises ERP" }] }),
  component: ReportsPage,
});

const reports = [
  { group: "Customers", icon: Users, items: ["Outstanding", "Sales Summary", "Customer Ledger", "Dispatch Summary"] },
  { group: "Suppliers", icon: Factory, items: ["Purchase Summary", "Supplier Ledger", "Payables Aging"] },
  { group: "Vehicles", icon: Truck, items: ["Truck Profitability", "Document Expiry", "Diesel Mileage", "Maintenance Log"] },
  { group: "Drivers", icon: IdCard, items: ["Trips per Driver", "Salary Sheet", "Advance & Fine"] },
  { group: "Products", icon: Package, items: ["Product-wise Sales", "Product-wise Purchase", "Rate History"] },
  { group: "Trips", icon: RouteIcon, items: ["Trip P&L", "Route Profitability", "Customer-wise Freight"] },
  { group: "Weighbridge", icon: Scale, items: ["Loss Analysis", "Customer vs Crusher Weight"] },
  { group: "Finance", icon: FileText, items: ["P&L", "Balance Sheet", "Trial Balance", "Cash Book", "Bank Book"] },
  { group: "GST", icon: Receipt, items: ["GSTR-1 Workbook", "GSTR-3B Workbook", "E-Way Bill Register"] },
  { group: "Performance", icon: TrendingUp, items: ["Daily Snapshot", "Monthly P&L", "Outstanding Aging"] },
];

function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="One-click exports across customers, fleet, drivers, finance and GST."
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div key={r.group} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <r.icon className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-semibold">{r.group}</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {r.items.map((item) => (
                <li key={item} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-foreground">{item}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Download className="mr-1 h-3.5 w-3.5" />Export
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
