import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Ban, Download, Eye } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/mock-data";
import { useErp, newId, active, type CSupplier } from "@/lib/store";
import { EntityDialog, CancelDialog, type FieldDef } from "@/components/entity-dialog";
import { generatePdf } from "@/lib/pdf";

export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Honey Enterprises ERP" }] }),
  component: SuppliersPage,
});

const fields: FieldDef[] = [
  { name: "code", label: "Code", required: true, half: true },
  { name: "name", label: "Supplier / Crusher", required: true, half: true },
  { name: "gst", label: "GSTIN", half: true },
  { name: "mobile", label: "Mobile", required: true, half: true },
  { name: "city", label: "City", half: true },
  { name: "outstanding", label: "Opening Payable", type: "number", half: true },
];

function SuppliersPage() {
  const suppliers = useErp((s) => s.suppliers);
  const add = useErp((s) => s.add);
  const update = useErp((s) => s.update);
  const cancel = useErp((s) => s.cancel);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CSupplier | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CSupplier | null>(null);

  const visible = suppliers.filter((s) => !s.cancelled && (!query || s.name.toLowerCase().includes(query.toLowerCase())));

  function handleSubmit(v: Record<string, unknown>) {
    if (editing) {
      update("suppliers", editing.id, v as Partial<CSupplier>);
      toast.success(`${editing.name} updated`);
    } else {
      add("suppliers", {
        id: newId("s"),
        code: String(v.code), name: String(v.name), gst: String(v.gst || ""),
        mobile: String(v.mobile), city: String(v.city || ""), outstanding: Number(v.outstanding || 0),
      });
      toast.success(`Supplier ${v.name} added`);
    }
    setEditing(null);
  }

  function exportPdf() {
    generatePdf({
      title: "Supplier Master",
      filename: `suppliers-${Date.now()}.pdf`,
      head: ["Code", "Name", "GST", "Mobile", "City", "Payable"],
      body: active(suppliers).map((s) => [s.code, s.name, s.gst, s.mobile, s.city, inr(s.outstanding)]),
      totals: [{ label: "Total payable", value: inr(active(suppliers).reduce((a, s) => a + s.outstanding, 0)) }],
    });
  }

  return (
    <div>
      <PageHeader
        title="Suppliers & Crushers"
        description="Crusher and material supplier master with payables."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-1 h-4 w-4" />Export PDF</Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1 h-4 w-4" />New supplier</Button>
          </>
        }
      />
      <div className="p-6">
        <ListShell toolbar={
          <>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers…" className="h-9 max-w-sm bg-background" />
            <p className="text-xs text-muted-foreground">{visible.length} suppliers</p>
          </>
        }>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead><TableHead>Crusher / Supplier</TableHead>
                <TableHead>GST</TableHead><TableHead>Mobile</TableHead><TableHead>City</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs">{s.gst}</TableCell>
                  <TableCell className="font-mono text-xs">{s.mobile}</TableCell>
                  <TableCell>{s.city}</TableCell>
                  <TableCell className={`text-right tabular-nums ${s.outstanding > 0 ? "text-warning" : "text-muted-foreground"}`}>{inr(s.outstanding)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" asChild><Link to="/suppliers/$id" params={{ id: s.id }}><Eye className="h-3.5 w-3.5" /></Link></Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setCancelTarget(s)}><Ban className="h-3.5 w-3.5 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>

      <EntityDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}
        title="Supplier" fields={fields} mode={editing ? "edit" : "create"}
        initial={editing ?? {}} onSubmit={handleSubmit} />
      <CancelDialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}
        title={cancelTarget ? `Remove ${cancelTarget.name}` : "Remove"}
        onConfirm={(remark) => { if (cancelTarget) { cancel("suppliers", cancelTarget.id, remark); toast.warning(`${cancelTarget.name} removed`); } }} />
    </div>
  );
}
