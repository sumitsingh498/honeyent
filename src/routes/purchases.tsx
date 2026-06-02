import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, purchaseInvoices } from "@/lib/mock-data";

export const Route = createFileRoute("/purchases")({
  head: () => ({ meta: [{ title: "Purchases — Honey Enterprises ERP" }] }),
  component: PurchasesPage,
});

function invoiceTone(s: string) {
  return s === "Paid" ? "bg-success/15 text-success" : s === "Partial" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";
}

function PurchasesPage() {
  return (
    <div>
      <PageHeader
        title="Purchases"
        description="Crusher and material purchase invoices, GST and payables."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New purchase</Button>}
      />
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">{purchaseInvoices.length} purchase invoices</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Taxable</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseInvoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{i.date}</TableCell>
                  <TableCell className="font-medium">{i.party}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.amount - i.gst)}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(i.gst)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(i.amount)}</TableCell>
                  <TableCell><Badge variant="outline" className={invoiceTone(i.status)}>{i.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
