import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Ban, Download } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/mock-data";
import { useErp, newId, active, type CProduct } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Products — Honey Enterprises ERP" }] }),
  component: ProductsPage,
});

const fields: FieldDef[] = [
  { name: "code", label: "Code", required: true, half: true },
  { name: "name", label: "Name", required: true, half: true },
  { name: "hsn", label: "HSN", half: true },
  { name: "unit", label: "Unit", half: true, placeholder: "MT" },
  { name: "gst", label: "GST %", type: "number", half: true },
  { name: "rate", label: "Standard Rate", type: "number", half: true },
];

function ProductsPage() {
  const products = useErp((s) => s.products);
  const add = useErp((s) => s.add);
  const update = useErp((s) => s.update);
  const cancel = useErp((s) => s.cancel);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CProduct | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CProduct | null>(null);
  const visible = active(products);

  function handleSubmit(v: Record<string, unknown>) {
    if (editing) { update("products", editing.id, v as Partial<CProduct>); toast.success(`${editing.name} updated`); }
    else { add("products", {
      id: newId("p"), code: String(v.code), name: String(v.name), hsn: String(v.hsn || ""),
      unit: String(v.unit || "MT"), gst: Number(v.gst || 5), rate: Number(v.rate || 0),
    }); toast.success(`Product ${v.name} added`); }
    setEditing(null);
  }

  function exportPdf() {
    generatePdf({
      title: "Product Master", filename: `products-${Date.now()}.pdf`,
      head: ["Code", "Name", "HSN", "Unit", "GST %", "Rate"],
      body: visible.map((p) => [p.code, p.name, p.hsn, p.unit, p.gst, inr(p.rate)]),
    });
  }

  return (
    <div>
      <PageHeader title="Products"
        description="Aggregate and sand catalogue with HSN, GST and standard rates."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New product</Button>
          </>
        } />
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">{visible.length} products</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>HSN</TableHead>
                <TableHead>Unit</TableHead><TableHead className="text-right">GST %</TableHead>
                <TableHead className="text-right">Standard Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.code}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.hsn}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.gst}%</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(p.rate)} / {p.unit}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setCancelTarget(p)}><Ban className="h-3.5 w-3.5 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Product" fields={fields} mode={editing ? "edit" : "create"}
        initial={editing ?? { unit: "MT", gst: 5 }} onSubmit={handleSubmit} />
      <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Remove ${cancelTarget.name}` : "Remove"}
        onConfirm={(remark) => { if (cancelTarget) { cancel("products", cancelTarget.id, remark); toast.warning(`${cancelTarget.name} removed`); } }} />
    </div>
  );
}
