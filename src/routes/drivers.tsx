import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { daysUntil, drivers } from "@/lib/mock-data";

export const Route = createFileRoute("/drivers")({
  head: () => ({ meta: [{ title: "Drivers — Honey Enterprises ERP" }] }),
  component: DriversPage,
});

function DriversPage() {
  return (
    <div>
      <PageHeader
        title="Drivers"
        description="Driver master with license, attendance and performance hooks."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New driver</Button>}
      />
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">{drivers.length} drivers</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>License</TableHead>
                <TableHead>License Expiry</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => {
                const days = daysUntil(d.licenseExpiry);
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="font-mono text-xs">{d.mobile}</TableCell>
                    <TableCell className="font-mono text-xs">{d.license}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{d.licenseExpiry}</span>
                      <Badge variant="outline" className={`ml-2 ${days <= 30 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>{days}d</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={d.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}>{d.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ListShell>
      </div>
    </div>
  );
}
