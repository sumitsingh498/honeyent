import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Users, Factory, Truck, IdCard, Package, FileText, Receipt,
  Route as RouteIcon, Scale, TrendingUp, Download,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useErp, active } from "@/lib/store";
import { generatePdf } from "@/lib/pdf";
import { inr, daysUntil } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — Honey Enterprises ERP" }] }),
  component: ReportsPage,
});

type ReportKey =
  | "cust-outstanding" | "cust-sales" | "cust-ledger" | "cust-dispatch"
  | "sup-purchase" | "sup-ledger" | "sup-payables"
  | "veh-pl" | "veh-expiry" | "veh-mileage" | "veh-maint"
  | "drv-trips" | "drv-salary" | "drv-advance"
  | "prod-sales" | "prod-purchase" | "prod-rate"
  | "trip-pl" | "trip-route" | "trip-cust"
  | "wb-loss" | "wb-compare"
  | "fin-pl" | "fin-bs" | "fin-tb" | "fin-cash" | "fin-bank"
  | "gst-r1" | "gst-r3b" | "gst-eway"
  | "perf-daily" | "perf-monthly" | "perf-aging";

function ReportsPage() {
  const customers = useErp((s) => s.customers);
  const suppliers = useErp((s) => s.suppliers);
  const vehicles = useErp((s) => s.vehicles);
  const drivers = useErp((s) => s.drivers);
  const products = useErp((s) => s.products);
  const orders = useErp((s) => s.orders);
  const trips = useErp((s) => s.trips);
  const slips = useErp((s) => s.weighSlips);
  const sales = useErp((s) => s.salesInvoices);
  const purchases = useErp((s) => s.purchaseInvoices);

  function run(key: ReportKey, title: string) {
    let head: string[] = [];
    let body: (string | number)[][] = [];
    let totals: { label: string; value: string }[] | undefined;
    const stamp = `${title} • Generated ${new Date().toLocaleDateString("en-IN")} • Cancelled records excluded`;

    switch (key) {
      case "cust-outstanding":
        head = ["Code", "Customer", "City", "Credit Limit", "Outstanding"];
        body = active(customers).filter((c) => c.outstanding > 0).map((c) => [c.code, c.name, c.city, inr(c.creditLimit), inr(c.outstanding)]);
        totals = [{ label: "Total receivable", value: inr(active(customers).reduce((a, c) => a + c.outstanding, 0)) }];
        break;
      case "cust-sales":
        head = ["Invoice", "Date", "Customer", "Amount", "Status"];
        body = active(sales).map((i) => [i.no, i.date, i.party, inr(i.amount), i.status]);
        totals = [{ label: "Total sales", value: inr(active(sales).reduce((a, i) => a + i.amount, 0)) }];
        break;
      case "cust-ledger":
        head = ["Customer", "Mobile", "Credit Limit", "Outstanding"];
        body = active(customers).map((c) => [c.name, c.mobile, inr(c.creditLimit), inr(c.outstanding)]);
        break;
      case "cust-dispatch":
        head = ["Customer", "Orders", "Total MT", "Total Value"];
        body = Array.from(new Set(active(orders).map((o) => o.customer))).map((cn) => {
          const list = active(orders).filter((o) => o.customer === cn);
          return [cn, list.length, list.reduce((a, o) => a + o.qty, 0), inr(list.reduce((a, o) => a + o.qty * o.rate, 0))];
        });
        break;
      case "sup-purchase":
        head = ["Bill", "Date", "Supplier", "Amount", "Status"];
        body = active(purchases).map((i) => [i.no, i.date, i.party, inr(i.amount), i.status]);
        totals = [{ label: "Total purchases", value: inr(active(purchases).reduce((a, i) => a + i.amount, 0)) }];
        break;
      case "sup-ledger":
      case "sup-payables":
        head = ["Code", "Supplier", "Mobile", "Payable"];
        body = active(suppliers).map((s) => [s.code, s.name, s.mobile, inr(s.outstanding)]);
        totals = [{ label: "Total payable", value: inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0)) }];
        break;
      case "veh-pl":
        head = ["Vehicle", "Trips", "Revenue", "Expense", "Profit"];
        body = Array.from(new Set(active(trips).map((t) => t.vehicle))).map((vn) => {
          const list = active(trips).filter((t) => t.vehicle === vn);
          const rev = list.reduce((a, t) => a + t.revenue, 0);
          const exp = list.reduce((a, t) => a + t.expense, 0);
          return [vn, list.length, inr(rev), inr(exp), inr(rev - exp)];
        });
        break;
      case "veh-expiry":
        head = ["Vehicle", "Insurance", "Days", "Fitness", "Days", "Permit", "Days"];
        body = active(vehicles).map((v) => [v.number,
          v.insuranceExpiry, daysUntil(v.insuranceExpiry),
          v.fitnessExpiry, daysUntil(v.fitnessExpiry),
          v.permitExpiry, daysUntil(v.permitExpiry)]);
        break;
      case "veh-mileage":
      case "veh-maint":
        head = ["Vehicle", "Capacity", "Ownership"];
        body = active(vehicles).map((v) => [v.number, `${v.capacity} MT`, v.ownership]);
        break;
      case "drv-trips":
        head = ["Driver", "Trips", "Revenue", "Profit"];
        body = Array.from(new Set(active(trips).map((t) => t.driver))).map((dn) => {
          const list = active(trips).filter((t) => t.driver === dn);
          const rev = list.reduce((a, t) => a + t.revenue, 0);
          const prof = rev - list.reduce((a, t) => a + t.expense, 0);
          return [dn, list.length, inr(rev), inr(prof)];
        });
        break;
      case "drv-salary":
      case "drv-advance":
        head = ["Driver", "Mobile", "License", "Status"];
        body = active(drivers).map((d) => [d.name, d.mobile, d.license, d.status]);
        break;
      case "prod-sales":
      case "prod-purchase":
        head = ["Product", "Total MT", "Total Value"];
        body = active(products).map((p) => {
          const list = active(orders).filter((o) => o.product === p.name);
          return [p.name, list.reduce((a, o) => a + o.qty, 0), inr(list.reduce((a, o) => a + o.qty * o.rate, 0))];
        });
        break;
      case "prod-rate":
        head = ["Code", "Product", "HSN", "Unit", "GST %", "Rate"];
        body = active(products).map((p) => [p.code, p.name, p.hsn, p.unit, `${p.gst}%`, inr(p.rate)]);
        break;
      case "trip-pl":
        head = ["Trip", "Date", "Route", "MT", "Revenue", "Expense", "Profit"];
        body = active(trips).map((t) => [t.tripNo, t.date, `${t.source} → ${t.destination}`, t.weight, inr(t.revenue), inr(t.expense), inr(t.revenue - t.expense)]);
        totals = [{ label: "Net profit", value: inr(active(trips).reduce((a, t) => a + (t.revenue - t.expense), 0)) }];
        break;
      case "trip-route":
        head = ["Route", "Trips", "Revenue", "Profit"];
        body = Array.from(new Set(active(trips).map((t) => `${t.source} → ${t.destination}`))).map((r) => {
          const list = active(trips).filter((t) => `${t.source} → ${t.destination}` === r);
          return [r, list.length, inr(list.reduce((a, t) => a + t.revenue, 0)), inr(list.reduce((a, t) => a + (t.revenue - t.expense), 0))];
        });
        break;
      case "trip-cust":
        head = ["Customer", "Orders", "Total Value"];
        body = Array.from(new Set(active(orders).map((o) => o.customer))).map((c) => {
          const list = active(orders).filter((o) => o.customer === c);
          return [c, list.length, inr(list.reduce((a, o) => a + o.qty * o.rate, 0))];
        });
        break;
      case "wb-loss":
        head = ["Slip", "Date", "Vehicle", "Net", "Cust Wt", "Loss"];
        body = active(slips).filter((w) => (w.loss ?? 0) > 0).map((w) => [w.slipNo, w.date, w.vehicle, w.net, w.customerWeight ?? "—", w.loss ?? 0]);
        totals = [{ label: "Total loss (kg)", value: active(slips).reduce((a, w) => a + (w.loss ?? 0), 0).toLocaleString("en-IN") }];
        break;
      case "wb-compare":
        head = ["Slip", "Vehicle", "Net (Crusher)", "Cust Wt", "Diff"];
        body = active(slips).map((w) => [w.slipNo, w.vehicle, w.net, w.customerWeight ?? "—", w.customerWeight ? w.net - w.customerWeight : "—"]);
        break;
      case "fin-pl": {
        const rev = active(sales).reduce((a, i) => a + i.amount, 0);
        const cost = active(purchases).reduce((a, i) => a + i.amount, 0);
        const tripExp = active(trips).reduce((a, t) => a + t.expense, 0);
        head = ["Particulars", "Amount"];
        body = [["Sales", inr(rev)], ["Material purchases", `(${inr(cost)})`], ["Trip expenses", `(${inr(tripExp)})`], ["Gross profit", inr(rev - cost - tripExp)]];
        break;
      }
      case "fin-bs":
        head = ["Account", "Balance"];
        body = [
          ["Receivables (customers)", inr(active(customers).reduce((a, c) => a + c.outstanding, 0))],
          ["Payables (suppliers)", inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0))],
          ["Unbilled sales", inr(active(sales).filter((i) => i.status !== "Paid").reduce((a, i) => a + i.amount, 0))],
        ];
        break;
      case "fin-tb":
      case "fin-cash":
      case "fin-bank":
        head = ["Account", "Debit", "Credit"];
        body = [
          ["Sales", "", inr(active(sales).reduce((a, i) => a + i.amount, 0))],
          ["Purchases", inr(active(purchases).reduce((a, i) => a + i.amount, 0)), ""],
          ["Trip Expenses", inr(active(trips).reduce((a, t) => a + t.expense, 0)), ""],
        ];
        break;
      case "gst-r1":
        head = ["Invoice", "Date", "Customer", "Taxable", "GST", "Total"];
        body = active(sales).map((i) => [i.no, i.date, i.party, inr(i.amount - i.gst), inr(i.gst), inr(i.amount)]);
        totals = [{ label: "Total output GST", value: inr(active(sales).reduce((a, i) => a + i.gst, 0)) }];
        break;
      case "gst-r3b": {
        const outGst = active(sales).reduce((a, i) => a + i.gst, 0);
        const inGst = active(purchases).reduce((a, i) => a + i.gst, 0);
        head = ["Particulars", "Amount"];
        body = [["Output GST", inr(outGst)], ["Input GST", inr(inGst)], ["Net payable", inr(Math.max(outGst - inGst, 0))]];
        break;
      }
      case "gst-eway":
        head = ["Challan", "Date", "Customer", "Vehicle", "Value"];
        body = active(orders).map((o) => [`DC-${o.no.slice(-3)}`, o.date, o.customer, o.vehicle, inr(o.qty * o.rate)]);
        break;
      case "perf-daily":
        head = ["Metric", "Value"];
        body = [
          ["Active orders", active(orders).length],
          ["Active trips", active(trips).length],
          ["Trip revenue", inr(active(trips).reduce((a, t) => a + t.revenue, 0))],
          ["Trip profit", inr(active(trips).reduce((a, t) => a + (t.revenue - t.expense), 0))],
        ];
        break;
      case "perf-monthly":
        head = ["Month", "Sales", "Purchases", "Profit"];
        body = [["Current", inr(active(sales).reduce((a, i) => a + i.amount, 0)),
          inr(active(purchases).reduce((a, i) => a + i.amount, 0)),
          inr(active(trips).reduce((a, t) => a + (t.revenue - t.expense), 0))]];
        break;
      case "perf-aging":
        head = ["Customer", "Outstanding", "Status"];
        body = active(customers).filter((c) => c.outstanding > 0).map((c) => [c.name, inr(c.outstanding), c.outstanding > c.creditLimit ? "Over limit" : "Within limit"]);
        break;
    }

    if (body.length === 0) {
      toast.info(`${title}: no records to export.`);
      return;
    }

    generatePdf({ title, subtitle: stamp, filename: `${key}-${Date.now()}.pdf`, head, body, totals });
    toast.success(`${title} downloaded`);
  }

  const groups: { group: string; icon: typeof Users; items: { label: string; key: ReportKey }[] }[] = [
    { group: "Customers", icon: Users, items: [
      { label: "Outstanding", key: "cust-outstanding" },
      { label: "Sales Summary", key: "cust-sales" },
      { label: "Customer Ledger", key: "cust-ledger" },
      { label: "Dispatch Summary", key: "cust-dispatch" },
    ]},
    { group: "Suppliers", icon: Factory, items: [
      { label: "Purchase Summary", key: "sup-purchase" },
      { label: "Supplier Ledger", key: "sup-ledger" },
      { label: "Payables Aging", key: "sup-payables" },
    ]},
    { group: "Vehicles", icon: Truck, items: [
      { label: "Truck Profitability", key: "veh-pl" },
      { label: "Document Expiry", key: "veh-expiry" },
      { label: "Diesel Mileage", key: "veh-mileage" },
      { label: "Maintenance Log", key: "veh-maint" },
    ]},
    { group: "Drivers", icon: IdCard, items: [
      { label: "Trips per Driver", key: "drv-trips" },
      { label: "Salary Sheet", key: "drv-salary" },
      { label: "Advance & Fine", key: "drv-advance" },
    ]},
    { group: "Products", icon: Package, items: [
      { label: "Product-wise Sales", key: "prod-sales" },
      { label: "Product-wise Purchase", key: "prod-purchase" },
      { label: "Rate History", key: "prod-rate" },
    ]},
    { group: "Trips", icon: RouteIcon, items: [
      { label: "Trip P&L", key: "trip-pl" },
      { label: "Route Profitability", key: "trip-route" },
      { label: "Customer-wise Freight", key: "trip-cust" },
    ]},
    { group: "Weighbridge", icon: Scale, items: [
      { label: "Loss Analysis", key: "wb-loss" },
      { label: "Customer vs Crusher Weight", key: "wb-compare" },
    ]},
    { group: "Finance", icon: FileText, items: [
      { label: "P&L", key: "fin-pl" },
      { label: "Balance Sheet", key: "fin-bs" },
      { label: "Trial Balance", key: "fin-tb" },
      { label: "Cash Book", key: "fin-cash" },
      { label: "Bank Book", key: "fin-bank" },
    ]},
    { group: "GST", icon: Receipt, items: [
      { label: "GSTR-1 Workbook", key: "gst-r1" },
      { label: "GSTR-3B Workbook", key: "gst-r3b" },
      { label: "E-Way Bill Register", key: "gst-eway" },
    ]},
    { group: "Performance", icon: TrendingUp, items: [
      { label: "Daily Snapshot", key: "perf-daily" },
      { label: "Monthly P&L", key: "perf-monthly" },
      { label: "Outstanding Aging", key: "perf-aging" },
    ]},
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="One-click PDF exports — cancelled documents are automatically excluded from every report."
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((r) => (
          <div key={r.group} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <r.icon className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-semibold">{r.group}</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {r.items.map((item) => (
                <li key={item.key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => run(item.key, item.label)}>
                    <Download className="mr-1 h-3.5 w-3.5" />PDF
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
