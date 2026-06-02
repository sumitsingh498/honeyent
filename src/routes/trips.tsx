import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ListShell } from "@/components/list-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, trips } from "@/lib/mock-data";
import { IndianRupee, Route as RouteIcon, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/trips")({
  head: () => ({ meta: [{ title: "Trips — Honey Enterprises ERP" }] }),
  component: TripsPage,
});

function TripsPage() {
  const revenue = trips.reduce((a, t) => a + t.revenue, 0);
  const expense = trips.reduce((a, t) => a + t.expense, 0);

  return (
    <div>
      <PageHeader
        title="Trips"
        description="Trip-wise revenue, expense and profitability across the fleet."
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New trip</Button>}
      />
      <div className="grid gap-4 px-6 pt-6 md:grid-cols-3">
        <StatCard label="Trips" value={String(trips.length)} icon={RouteIcon} tone="info" />
        <StatCard label="Revenue" value={inr(revenue)} icon={IndianRupee} tone="success" />
        <StatCard label="Profit" value={inr(revenue - expense)} hint={`Expenses ${inr(expense)}`} icon={TrendingUp} tone="primary" />
      </div>
      <div className="p-6">
        <ListShell toolbar={<p className="text-sm font-medium">All trips</p>}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Weight (MT)</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Expense</TableHead>
                <TableHead className="text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((t) => {
                const profit = t.revenue - t.expense;
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.tripNo}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="font-mono text-xs">{t.vehicle}</TableCell>
                    <TableCell>{t.driver}</TableCell>
                    <TableCell>{t.source}</TableCell>
                    <TableCell>{t.destination}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.weight}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(t.revenue)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{inr(t.expense)}</TableCell>
                    <TableCell className={`text-right font-medium tabular-nums ${profit >= 0 ? "text-success" : "text-destructive"}`}>{inr(profit)}</TableCell>
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
