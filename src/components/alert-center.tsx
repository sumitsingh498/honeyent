import { Link } from "@tanstack/react-router";
import { AlertTriangle, BellRing, Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useErp, active } from "@/lib/store";
import { buildAlerts, type Alert } from "@/lib/insights";

const sevIcon = { critical: ShieldAlert, warning: AlertTriangle, info: Info } as const;
const sevClass: Record<Alert["severity"], string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  info: "bg-info/15 text-info border-info/30",
};

export function useAlerts() {
  const customers = active(useErp((s) => s.customers));
  const vehicles = active(useErp((s) => s.vehicles));
  const drivers = active(useErp((s) => s.drivers));
  const orders = active(useErp((s) => s.orders));
  const invoices = active(useErp((s) => s.salesInvoices));
  const payments = useErp((s) => s.payments);
  return buildAlerts({ customers, vehicles, drivers, orders, invoices, payments });
}

export function AlertCenter({ limit }: { limit?: number }) {
  const alerts = useAlerts();
  const list = typeof limit === "number" ? alerts.slice(0, limit) : alerts;
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-warning" />
          <h2 className="font-display text-sm font-semibold">Smart alerts</h2>
        </div>
        <Badge variant="outline" className="text-[10px]">{alerts.length}</Badge>
      </div>
      <ul className="divide-y divide-border">
        {list.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-muted-foreground">All clear — nothing needs attention.</li>
        )}
        {list.map((a) => {
          const Icon = sevIcon[a.severity];
          const inner = (
            <div className="flex items-start gap-3 px-4 py-3 transition hover:bg-muted/30">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${sevClass[a.severity]}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.category} • {a.detail}</p>
              </div>
            </div>
          );
          return (
            <li key={a.id}>
              {a.href ? <Link to={a.href}>{inner}</Link> : inner}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
