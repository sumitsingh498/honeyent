import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, Upload, Save } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products, vehicles, weighSlips } from "@/lib/mock-data";

export const Route = createFileRoute("/weighbridge")({
  head: () => ({ meta: [{ title: "Weighbridge — Honey Enterprises ERP" }] }),
  component: WeighbridgePage,
});

function WeighbridgePage() {
  const [gross, setGross] = useState<number>(0);
  const [tare, setTare] = useState<number>(0);
  const net = Math.max(gross - tare, 0);

  return (
    <div>
      <PageHeader
        title="Weighbridge"
        description="Capture gross & tare weights — net is calculated automatically."
        actions={<Button size="sm"><Scale className="mr-1 h-4 w-4" />New slip</Button>}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={(e) => { e.preventDefault(); }}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="font-display text-base font-semibold">Capture new slip</h2>
          <p className="text-xs text-muted-foreground">Form-based entry. Hardware integration is planned.</p>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="slip">Slip No</Label>
              <Input id="slip" defaultValue={`WB-00${weighSlips.length + 1245}`} className="bg-background font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="vehicle">Vehicle</Label>
                <select id="vehicle" className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                  {vehicles.map((v) => <option key={v.id}>{v.number}</option>)}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="product">Product</Label>
                <select id="product" className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                  {products.map((p) => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="gross">Gross (kg)</Label>
                <Input id="gross" type="number" value={gross || ""} onChange={(e) => setGross(Number(e.target.value))} className="bg-background tabular-nums" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tare">Tare (kg)</Label>
                <Input id="tare" type="number" value={tare || ""} onChange={(e) => setTare(Number(e.target.value))} className="bg-background tabular-nums" />
              </div>
            </div>
            <div className="rounded-lg border border-primary/40 bg-primary/10 p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Net weight</p>
              <p className="font-display text-3xl font-semibold tabular-nums text-primary">{net.toLocaleString("en-IN")} kg</p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1"><Upload className="mr-1 h-4 w-4" />Slip image</Button>
              <Button type="submit" className="flex-1"><Save className="mr-1 h-4 w-4" />Save slip</Button>
            </div>
          </div>
        </form>

        <ListShell toolbar={<p className="text-sm font-medium">Recent slips</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slip No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Tare</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-right">Cust. Wt</TableHead>
                <TableHead className="text-right">Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weighSlips.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-xs">{w.slipNo}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{w.date}</TableCell>
                  <TableCell className="font-mono text-xs">{w.vehicle}</TableCell>
                  <TableCell>{w.product}</TableCell>
                  <TableCell className="text-right tabular-nums">{w.gross.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right tabular-nums">{w.tare.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{w.net.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{w.customerWeight?.toLocaleString("en-IN") ?? "—"}</TableCell>
                  <TableCell className={`text-right tabular-nums ${w.loss && w.loss > 100 ? "text-destructive" : "text-muted-foreground"}`}>{w.loss ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
