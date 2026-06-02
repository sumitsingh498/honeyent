import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Download } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, orders, statusTone } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Honey Enterprises ERP" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Orders"
        description="Customer orders from booking to delivery and billing."
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" />Export</Button>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />New order</Button>
          </>
        }
      />
      <div className="p-6">
        <ListShell
          toolbar={
            <>
              <div className="flex flex-1 items-center gap-2">
                <Input placeholder="Search by order no, customer, vehicle…" className="h-9 max-w-sm bg-background" />
                <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
              </div>
              <p className="text-xs text-muted-foreground">{orders.length} orders</p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty (MT)</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.no}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="font-medium">{o.customer}</TableCell>
                  <TableCell>{o.product}</TableCell>
                  <TableCell className="text-right tabular-nums">{o.qty}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(o.rate)}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{inr(o.qty * o.rate)}</TableCell>
                  <TableCell className="font-mono text-xs">{o.vehicle}</TableCell>
                  <TableCell className="text-xs">{o.driver}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusTone[o.status]}>{o.status}</Badge>
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
