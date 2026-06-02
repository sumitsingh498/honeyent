import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers — Honey Enterprises ERP" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="Customer master with GST, credit limits and outstanding."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New customer</Button>}
      />
      <div className="p-6">
        <ListShell
          toolbar={
            <>
              <Input placeholder="Search by name, GST, mobile…" className="h-9 max-w-sm bg-background" />
              <p className="text-xs text-muted-foreground">{customers.length} customers</p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.gst}</TableCell>
                  <TableCell className="font-mono text-xs">{c.mobile}</TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell className="text-right tabular-nums">{inr(c.creditLimit)}</TableCell>
                  <TableCell className={`text-right tabular-nums ${c.outstanding > 0 ? "text-warning" : "text-muted-foreground"}`}>{inr(c.outstanding)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}>{c.status}</Badge>
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
