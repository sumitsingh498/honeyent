import { Calendar as CalIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DateRange {
  from: string;
  to: string;
}

export const EMPTY_RANGE: DateRange = { from: "", to: "" };

export function inRange(date: string, r: DateRange): boolean {
  if (!r.from && !r.to) return true;
  if (r.from && date < r.from) return false;
  if (r.to && date > r.to) return false;
  return true;
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function monthStart(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: "Today", range: () => ({ from: isoDaysAgo(0), to: isoDaysAgo(0) }) },
  { label: "Yesterday", range: () => ({ from: isoDaysAgo(1), to: isoDaysAgo(1) }) },
  { label: "7d", range: () => ({ from: isoDaysAgo(6), to: isoDaysAgo(0) }) },
  { label: "30d", range: () => ({ from: isoDaysAgo(29), to: isoDaysAgo(0) }) },
  { label: "This month", range: () => ({ from: monthStart(), to: isoDaysAgo(0) }) },
];

interface Props {
  value: DateRange;
  onChange: (r: DateRange) => void;
  compact?: boolean;
}

export function DateRangeFilter({ value, onChange, compact }: Props) {
  const active = !!(value.from || value.to);
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "rounded-lg border border-border bg-card/40 p-1.5"}`}>
      <span className="ml-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        <CalIcon className="h-3 w-3" />Date
      </span>
      <Input
        type="date"
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        className="h-8 w-[140px] bg-background text-xs"
      />
      <span className="text-xs text-muted-foreground">→</span>
      <Input
        type="date"
        value={value.to}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
        className="h-8 w-[140px] bg-background text-xs"
      />
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px]"
            onClick={() => onChange(p.range())}
          >
            {p.label}
          </Button>
        ))}
        {active && (
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => onChange(EMPTY_RANGE)}>
            <X className="mr-0.5 h-3 w-3" />Clear
          </Button>
        )}
      </div>
    </div>
  );
}
