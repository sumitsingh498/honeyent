import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Ban, Download, Wrench, Receipt, IndianRupee, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/mock-data";
import { useErp, newId, active, EXPENSE_CATEGORIES, type Expense } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";
import { DateRangeFilter, EMPTY_RANGE, inRange, type DateRange } from "@/components/date-range-filter";
import { nextNo } from "@/lib/numbering";

export const Route = createFileRoute("/expenses")({
  head: () => ({ meta: [{ title: "Expenses — Honey Enterprises ERP" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const expenses = useErp((s) => s.expenses);
  const vehicles = useErp((s) => s.vehicles);
  const drivers = useErp((s) => s.drivers);
  const add = useErp((s) => s.add);
  const update = useErp((s) => s.update);
  const cancel = useErp((s) => s.cancel);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Expense | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("");
  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);

  const autoNo = editing ? editing.no : nextNo("EXP");

  const fields: FieldDef[] = [
    { name: "no", label: "Voucher No (auto)", required: true, half: true, placeholder: autoNo },
    { name: "date", label: "Date", type: "date", required: true, half: true },
    { name: "category", label: "Category", type: "select", required: true, half: true,
      options: EXPENSE_CATEGORIES.map((c) => ({ label: c, value: c })) },
    { name: "amount", label: "Amount", type: "number", required: true, half: true },
    { name: "vehicle", label: "Vehicle (if any)", type: "select", half: true,
      options: active(vehicles).map((v) => ({ label: v.number, value: v.number })) },
    { name: "driver", label: "Driver (if any)", type: "select", half: true,
      options: active(drivers).map((d) => ({ label: d.name, value: d.name })) },
    { name: "paidTo", label: "Paid to", required: true, half: true, placeholder: "Vendor / Person" },
    { name: "mode", label: "Mode", type: "select", required: true, half: true,
      options: ["Cash", "Bank", "UPI", "Cheque"].map((m) => ({ label: m, value: m })) },
    { name: "remark", label: "Remark", type: "textarea" },
  ];

  const visible = useMemo(() => {
    return expenses.filter((e) => {
      if (!inRange(e.date, range)) return false;
      if (cat && e.category !== cat) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(e.paidTo.toLowerCase().includes(q) || e.no.toLowerCase().includes(q) ||
              (e.vehicle ?? "").toLowerCase().includes(q) || (e.driver ?? "").toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [expenses, range, cat, query]);

  const live = active(visible);
  const total = live.reduce((a, e) => a + e.amount, 0);
  const salary = live.filter((e) => e.category === "Driver Salary").reduce((a, e) => a + e.amount, 0);
  const repair = live.filter((e) => e.category === "Truck Repair" || e.category === "Truck Maintenance").reduce((a, e) => a + e.amount, 0);

  function handleSubmit(v: Record<string, unknown>) {
    const data = {
      no: String(v.no || autoNo),
      date: String(v.date),
      category: v.category as Expense["category"],
      vehicle: v.vehicle ? String(v.vehicle) : undefined,
      driver: v.driver ? String(v.driver) : undefined,
      paidTo: String(v.paidTo),
      mode: (v.mode as Expense["mode"]) || "Cash",
      amount: Number(v.amount),
      remark: v.remark ? String(v.remark) : undefined,
    };
    if (editing) {
      update("expenses", editing.id, data);
      toast.success(`Voucher ${editing.no} updated`);
    } else {
      add("expenses", { id: newId("ex"), ...data });
      toast.success(`Voucher ${data.no} recorded`, { description: `${data.category} • ${inr(data.amount)}` });
    }
    setEditing(null);
  }

  function exportPdf() {
    generatePdf({
      title: "Expense Register",
      subtitle: `${live.length} vouchers${range.from || range.to ? ` • ${range.from || "…"} → ${range.to || "…"}` : ""}${cat ? ` • ${cat}` : ""}`,
      filename: `expenses-${Date.now()}.pdf`,
      head: ["Voucher", "Date", "Category", "Paid To", "Vehicle/Driver", "Mode", "Amount"],
      body: live.map((e) => [e.no, e.date, e.category, e.paidTo, e.vehicle || e.driver || "—", e.mode, inr(e.amount)]),
      totals: [
        { label: "Total expenses", value: inr(total) },
        { label: "Driver salary", value: inr(salary) },
        { label: "Repair + maintenance", value: inr(repair) },
      ],
    });
  }

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Driver salaries, truck repair, maintenance, fuel, toll and every operating cost. Auto-posts to cashbook."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New voucher</Button>
          </>
        }
      />

      <div className="grid gap-4 px-6 pt-6 md:grid-cols-3">
        <StatCard label="Total expenses" value={inr(total)} hint={`${live.length} vouchers`} icon={IndianRupee} tone="warning" />
        <StatCard label="Driver salaries" value={inr(salary)} icon={Users} tone="info" />
        <StatCard label="Repair + maintenance" value={inr(repair)} icon={Wrench} tone="primary" />
      </div>

      <div className="space-y-3 p-6">
        <DateRangeFilter value={range} onChange={setRange} />
        <ListShell
          toolbar={
            <>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search voucher / vendor / vehicle…" className="h-9 max-w-xs bg-background" />
                <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option value="">All categories</option>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Badge variant="outline"><Receipt className="mr-1 h-3 w-3" />{live.length} active</Badge>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Paid To</TableHead>
                <TableHead>Vehicle / Driver</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow><TableCell colSpan={8} className="p-8 text-center text-sm text-muted-foreground">No expenses for selected filters.</TableCell></TableRow>
              )}
              {visible.map((e) => (
                <TableRow key={e.id} className={e.cancelled ? "opacity-60" : ""}>
                  <TableCell className="font-mono text-xs">{e.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.date}</TableCell>
                  <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                  <TableCell className={`font-medium ${e.cancelled ? "line-through" : ""}`}>{e.paidTo}{e.remark && <div className="text-[11px] text-muted-foreground">{e.remark}</div>}</TableCell>
                  <TableCell className="font-mono text-[11px]">{e.vehicle || e.driver || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{e.mode}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{inr(e.amount)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" disabled={e.cancelled} onClick={() => { setEditing(e); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" disabled={e.cancelled} onClick={() => setCancelTarget(e)}><Ban className="h-3.5 w-3.5 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog
        open={open}
        onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Expense Voucher"
        fields={fields}
        mode={editing ? "edit" : "create"}
        initial={editing ?? { date: new Date().toISOString().slice(0, 10), mode: "Cash", category: "Diesel / Fuel" }}
        onSubmit={handleSubmit}
      />

      <CancelDialog
        open={!!cancelTarget}
        onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Cancel ${cancelTarget.no}` : "Cancel"}
        onConfirm={(remark) => {
          if (cancelTarget) {
            cancel("expenses", cancelTarget.id, remark);
            toast.warning(`Voucher ${cancelTarget.no} cancelled`, { description: remark });
          }
        }}
      />
    </div>
  );
}
