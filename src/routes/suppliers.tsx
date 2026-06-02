import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, suppliers } from "@/lib/mock-data";

export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Honey Enterprises ERP" }] }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <div>
      <PageHeader
        title="Suppliers & Crushers"
        description="Crusher and material supplier master with payables."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New supplier</Button>}
      />
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">{suppliers.length} suppliers</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Crusher / Supplier</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs">{s.gst}</TableCell>
                  <TableCell className="font-mono text-xs">{s.mobile}</TableCell>
                  <TableCell>{s.city}</TableCell>
                  <TableCell className={`text-right tabular-nums ${s.outstanding > 0 ? "text-warning" : "text-muted-foreground"}`}>{inr(s.outstanding)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
