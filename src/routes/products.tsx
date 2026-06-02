import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, products } from "@/lib/mock-data";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Products — Honey Enterprises ERP" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Aggregate and sand catalogue with HSN, GST and standard rates."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New product</Button>}
      />
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">{products.length} products</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">GST %</TableHead>
                <TableHead className="text-right">Standard Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.code}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.hsn}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.gst}%</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(p.rate)} / {p.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
