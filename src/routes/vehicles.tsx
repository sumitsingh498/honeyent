import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { daysUntil, vehicles } from "@/lib/mock-data";

export const Route = createFileRoute("/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles — Honey Enterprises ERP" }] }),
  component: VehiclesPage,
});

function expiryBadge(date: string) {
  const d = daysUntil(date);
  const tone = d <= 7 ? "bg-destructive/15 text-destructive" : d <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success";
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{date}</span>
      <Badge variant="outline" className={`mt-0.5 w-fit ${tone}`}>{d <= 0 ? "Expired" : `${d}d left`}</Badge>
    </div>
  );
}

function VehiclesPage() {
  return (
    <div>
      <PageHeader
        title="Vehicles"
        description="Fleet master with RC, insurance, fitness and permit expiry tracking."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New vehicle</Button>}
      />
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">{vehicles.length} vehicles</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle No</TableHead>
                <TableHead>Ownership</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Fitness</TableHead>
                <TableHead>Permit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-xs font-semibold">{v.number}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={v.ownership === "Own" ? "bg-primary/15 text-primary" : "bg-info/15 text-info"}>{v.ownership}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{v.capacity} MT</TableCell>
                  <TableCell>{expiryBadge(v.insuranceExpiry)}</TableCell>
                  <TableCell>{expiryBadge(v.fitnessExpiry)}</TableCell>
                  <TableCell>{expiryBadge(v.permitExpiry)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
