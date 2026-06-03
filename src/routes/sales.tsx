import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Share2, FileDown, Pencil, Ban, Download, IndianRupee, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/mock-data";
import { useErp, newId, active, type CInvoice } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generateDocPdf, generatePdf } from "@/lib/pdf";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales — Honey Enterprises ERP" }] }),
  component: SalesPage,
});

function tone(s: string) {
  return s === "Paid" ? "bg-success/15 text-success" : s === "Partial" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";
}

function SalesPage() {
  const invoices = useErp((s) => s.salesInvoices);
  const customers = useErp((s) => s.customers);
  const add = useErp((s) => s.add);
  const update = useErp((s) => s.update);
  const cancel = useErp((s) => s.cancel);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CInvoice | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CInvoice | null>(null);

  const live = active(invoices);
  const total = live.reduce((a, i) => a + i.amount, 0);
  const unpaid = live.filter((i) => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);

  const fields: FieldDef[] = [
    { name: "no", label: "Invoice No", required: true, half: true },
    { name: "date", label: "Date", type: "date", required: true, half: true },
    { name: "party", label: "Customer", type: "select", required: true,
      options: active(customers).map((c) => ({ label: c.name, value: c.name })) },
    { name: "amount", label: "Total Amount", type: "number", required: true, half: true },
    { name: "gst", label: "GST Component", type: "number", required: true, half: true },
    { name: "status", label: "Status", type: "select", required: true, half: true,
      options: [{ label: "Paid", value: "Paid" }, { label: "Unpaid", value: "Unpaid" }, { label: "Partial", value: "Partial" }] },
  ];

  function handleSubmit(v: Record<string, unknown>) {
    const data = {
      no: String(v.no), date: String(v.date), party: String(v.party),
      amount: Number(v.amount), gst: Number(v.gst),
      status: (v.status as CInvoice["status"]) || "Unpaid",
    };
    if (editing) { update("salesInvoices", editing.id, data); toast.success(`Invoice ${editing.no} updated`); }
    else { add("salesInvoices", { id: newId("si"), ...data }); toast.success(`Invoice ${data.no} created`); }
    setEditing(null);
  }

  function downloadInvoice(i: CInvoice) {
    generateDocPdf({
      type: "Tax Invoice", no: i.no, date: i.date, party: i.party,
      rows: [{ label: "Status", value: i.status }],
      lines: {
        head: ["Description", "Taxable", "GST", "Total"],
        body: [["Goods / Services as per dispatch", inr(i.amount - i.gst), inr(i.gst), inr(i.amount)]],
      },
      totals: [
        { label: "Taxable", value: inr(i.amount - i.gst) },
        { label: "GST", value: inr(i.gst) },
        { label: "Grand Total", value: inr(i.amount) },
      ],
      remark: i.cancelled ? `CANCELLED — ${i.cancelRemark ?? ""}` : undefined,
      filename: `${i.no}.pdf`,
    });
  }

  function shareWhatsApp(i: CInvoice) {
    const text = encodeURIComponent(`Invoice ${i.no} dated ${i.date} for ${i.party} — Total ${inr(i.amount)} (${i.status}).`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function exportPdf() {
    generatePdf({
      title: "Sales Register",
      subtitle: "Cancelled invoices excluded",
      filename: `sales-${Date.now()}.pdf`,
      head: ["Invoice", "Date", "Customer", "Taxable", "GST", "Total", "Status"],
      body: live.map((i) => [i.no, i.date, i.party, inr(i.amount - i.gst), inr(i.gst), inr(i.amount), i.status]),
      totals: [
        { label: "Total billed", value: inr(total) },
        { label: "Unpaid", value: inr(unpaid) },
      ],
    });
  }

  return (
    <div>
      <PageHeader title="Sales" description="GST invoices ready for PDF + WhatsApp share."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New invoice</Button>
          </>
        } />
      <div className="grid gap-4 px-6 pt-6 md:grid-cols-3">
        <StatCard label="Invoices" value={String(live.length)} icon={FileText} tone="info" />
        <StatCard label="Billed" value={inr(total)} icon={IndianRupee} tone="primary" />
        <StatCard label="Unpaid" value={inr(unpaid)} icon={AlertTriangle} tone="warning" />
      </div>
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">All sales invoices</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead><TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Taxable</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id} className={i.cancelled ? "opacity-60" : ""}>
                  <TableCell className="font-mono text-xs">{i.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.date}</TableCell>
                  <TableCell className={`font-medium ${i.cancelled ? "line-through" : ""}`}>{i.party}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.amount - i.gst)}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.gst)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(i.amount)}</TableCell>
                  <TableCell>
                    {i.cancelled
                      ? <Badge variant="outline" className="bg-destructive/15 text-destructive">Cancelled</Badge>
                      : <Badge variant="outline" className={tone(i.status)}>{i.status}</Badge>}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => downloadInvoice(i)}><FileDown className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => shareWhatsApp(i)}><Share2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" disabled={i.cancelled} onClick={() => { setEditing(i); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" disabled={i.cancelled} onClick={() => setCancelTarget(i)}><Ban className="h-3.5 w-3.5 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Sales Invoice" fields={fields} mode={editing ? "edit" : "create"}
        initial={editing ?? { date: new Date().toISOString().slice(0, 10), status: "Unpaid", no: `INV-${Date.now().toString().slice(-6)}` }}
        onSubmit={handleSubmit} />
      <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Cancel ${cancelTarget.no}` : "Cancel"}
        onConfirm={(remark) => { if (cancelTarget) { cancel("salesInvoices", cancelTarget.id, remark); toast.warning(`${cancelTarget.no} cancelled`, { description: remark }); } }} />
    </div>
  );
}
