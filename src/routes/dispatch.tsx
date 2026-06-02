import { createFileRoute } from "@tanstack/react-router";
import { Truck, FileDown, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, statusTone } from "@/lib/mock-data";

export const Route = createFileRoute("/dispatch")({
  head: () => ({ meta: [{ title: "Dispatch — Honey Enterprises ERP" }] }),
  component: DispatchPage,
});

function DispatchPage() {
  const active = orders.filter((o) =>
    ["Approved", "Loaded", "In Transit", "Delivered"].includes(o.status),
  );

  return (
    <div>
      <PageHeader
        title="Dispatch"
        description="Generate challans, track in-transit loads and capture POD on delivery."
        actions={<Button size="sm"><Truck className="mr-1 h-4 w-4" />New dispatch</Button>}
      />
      <div className="p-6">
        <ListShell
          toolbar={
            <>
              <p className="text-sm font-medium">Active dispatch</p>
              <p className="text-xs text-muted-foreground">{active.length} in pipeline</p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challan</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">DC-{o.no.slice(-3)}</TableCell>
                  <TableCell className="font-mono text-xs">{o.vehicle}</TableCell>
                  <TableCell>{o.driver}</TableCell>
                  <TableCell className="font-medium">{o.customer}</TableCell>
                  <TableCell>{o.product}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusTone[o.status]}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><FileDown className="mr-1 h-3.5 w-3.5" />PDF</Button>
                    <Button variant="ghost" size="sm"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Mark POD</Button>
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
