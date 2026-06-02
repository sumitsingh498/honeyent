import { createFileRoute } from "@tanstack/react-router";
import { Plus, Share2, FileDown } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, salesInvoices } from "@/lib/mock-data";
import { IndianRupee, FileText, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales — Honey Enterprises ERP" }] }),
  component: SalesPage,
});

function invoiceTone(s: string) {
  return s === "Paid" ? "bg-success/15 text-success" : s === "Partial" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";
}

function SalesPage() {
  const total = salesInvoices.reduce((a, i) => a + i.amount, 0);
  const unpaid = salesInvoices.filter((i) => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);

  return (
    <div>
      <PageHeader
        title="Sales"
        description="GST invoices ready for PDF + WhatsApp share."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New invoice</Button>}
      />
      <div className="grid gap-4 px-6 pt-6 md:grid-cols-3">
        <StatCard label="Invoices" value={String(salesInvoices.length)} icon={FileText} tone="info" />
        <StatCard label="Billed" value={inr(total)} icon={IndianRupee} tone="primary" />
        <StatCard label="Unpaid" value={inr(unpaid)} icon={AlertTriangle} tone="warning" />
      </div>
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">All sales invoices</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Taxable</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesInvoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.date}</TableCell>
                  <TableCell className="font-medium">{i.party}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.amount - i.gst)}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.gst)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(i.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={invoiceTone(i.status)}>{i.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><FileDown className="mr-1 h-3.5 w-3.5" />PDF</Button>
                    <Button variant="ghost" size="sm"><Share2 className="mr-1 h-3.5 w-3.5" />Share</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
