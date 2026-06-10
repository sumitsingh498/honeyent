// CSV + Excel exporters for ReportData.
import * as XLSX from "xlsx";

function stripCurrency(v: string | number): string | number {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return String(v);
  // Convert "₹1,23,456" → 123456 so Excel treats it as a number
  if (/^₹/.test(v)) {
    const n = Number(v.replace(/[₹,\s]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return v;
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportCsv(title: string, head: string[], body: (string | number)[][]): void {
  const rows = [head, ...body];
  const csv = rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell ?? "");
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(","),
    )
    .join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${sanitizeFilename(title)}-${Date.now()}.csv`);
}

export function exportExcel(
  title: string,
  head: string[],
  body: (string | number)[][],
  totals?: { label: string; value: string }[],
): void {
  const aoa: (string | number)[][] = [head, ...body.map((r) => r.map(stripCurrency))];
  if (totals?.length) {
    aoa.push([]);
    totals.forEach((t) => aoa.push([t.label, t.value]));
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Auto width
  const widths = head.map((h, i) => {
    const max = Math.max(
      String(h).length,
      ...body.map((r) => String(r[i] ?? "").length),
    );
    return { wch: Math.min(Math.max(max + 2, 10), 40) };
  });
  ws["!cols"] = widths;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 28) || "Report");
  XLSX.writeFile(wb, `${sanitizeFilename(title)}-${Date.now()}.xlsx`);
}
