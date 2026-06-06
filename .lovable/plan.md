# Honey Enterprises ERP — Final Advanced Build (v2)

A focused upgrade of the existing frontend-only ERP. No backend changes; everything persists in browser (localStorage) so it stays instant and offline-friendly. Owner contact `8059075260` / `sumit2and2singh@gmail.com` is wired into share actions.

## 1. Auto-numbered documents + duplicate guard
- Central `numbering.ts`: sequential, year-prefixed series per document
  - Orders `ORD/26-27/0001`, Challan `DC/26-27/0001`, Weigh `WB/26-27/0001`, Trip `TR/26-27/0001`, Sales `INV/26-27/0001`, Purchase `PUR/26-27/0001`
- All "No." fields become **read-only, auto-filled** on New; counters persisted in store.
- Duplicate-check helper rejects:
  - duplicate Customer/Supplier (by GSTIN or name+phone)
  - duplicate Vehicle number, Driver licence, Product code, HSN code
  - duplicate document numbers across modules
- Friendly toast on conflict; no silent overwrite.

## 2. Master data — expanded
- **Customer**: name, GSTIN, phone, email, address, state, credit limit, opening balance.
- **Supplier**: same shape + bank details.
- **Driver**: name, phone, licence no, licence expiry, address, joining date.
- **Vehicle**: number, type, owner, capacity, RC/insurance/fitness/permit/PUC expiry.
- **Product**: name, code, **HSN**, **GST %**, UOM, default rate, category.
- **NEW masters** (auto-included as best-practice):
  - **HSN catalog** (HSN ↔ GST% mapping, reusable across products)
  - **Sites / Ship-to addresses** (per customer + freeform)
  - **Expense heads** (diesel, toll, fine, repair…) for trip P&L
  - **Company profile** (name, GSTIN, address, logo text, owner phone/email) → printed on every PDF

## 3. One-Shot Order form (the "single entry" you asked for)
A single guided dialog captures:
Customer · Ship-to · Supplier · Product (auto-fills HSN/GST/rate) · Vehicle · Driver · Qty · Rate · Freight · Ship-to override · Remark · Payment terms · Expected delivery

On **Save** the system auto-creates (linked by one `dealId`):
1. **Order** (Approved)
2. **Delivery Challan** (with HSN/GST lines)
3. **Weigh Slip** draft (gross/tare editable later; net auto)
4. **Trip sheet** (vehicle/driver/route, expenses ready)
5. **Sales Invoice** to customer (taxable, CGST/SGST or IGST by state)
6. **Purchase Invoice** from supplier (if supplier set)

All six are visible in their own modules and a new **Deal** view shows the bundle.

## 4. Reports — View first, then PDF
Each report opens in a **View Report** sheet (filters + on-screen table + totals). Buttons: `Download PDF`, `Share WhatsApp`, `Email`. Cancelled docs already excluded.
Reports kept: Sales register, Purchase register, GSTR-1 summary, GSTR-3B summary, HSN summary, Customer ledger, Supplier ledger, Outstanding (AR/AP aging), Vehicle P&L, Driver performance, Trip P&L, Daily weighbridge, Stock movement, Top customers/products.

## 5. Advanced / futuristic features
- **Global Command Palette** (`⌘K`): jump to any record, run "New Order", search customers/vehicles.
- **AI Assistant (chat widget, bottom-right)**: uses Lovable AI Gateway (`google/gemini-3-flash-preview`) via a TanStack server function. Knows current totals (sales today, outstanding, top customer) and answers in plain English. *Requires enabling Lovable Cloud — will prompt before adding.* If you prefer to stay fully offline I'll ship a deterministic rule-based assistant instead.
- **Smart Alerts panel** on dashboard: document expiry (RC/insurance/licence ≤30d), credit-limit breach, idle vehicles, pending POD > 2 days.
- **WhatsApp + Email share** prefilled to `8059075260` / `sumit2and2singh@gmail.com` for every PDF (invoice/challan/weighslip/report).
- **Print-ready A4 PDF theme** with company header, GST breakup, amount in words, signature block, QR (UPI placeholder).
- **CSV import/export** for every master.
- **Audit trail** (created/edited/cancelled with timestamp + remark) shown per record.
- **Dark + Light** toggle (Industrial Slate stays default).
- **PWA install** prompt (mobile-first, offline-ready).
- **Backup / Restore**: one-click JSON export & import of entire ERP data.

## Technical notes (for me)
- New files: `src/lib/numbering.ts`, `src/lib/dedupe.ts`, `src/lib/deal.ts`, `src/lib/company.ts`, `src/components/one-shot-order.tsx`, `src/components/report-view.tsx`, `src/components/command-palette.tsx`, `src/components/ai-assistant.tsx`, `src/routes/masters.hsn.tsx`, `src/routes/deals.tsx`, `src/routes/settings.tsx`.
- Extend `store.ts` with `counters`, `companyProfile`, `hsnCatalog`, `expenseHeads`, `siteAddresses`, `auditLog`, `deals`.
- Extend `pdf.ts` with company header + amount-in-words + GST breakup.
- All existing modules keep working; "New" buttons route to One-Shot Order where it makes sense.

## Open question before I build
The AI Assistant needs Lovable Cloud (server-side key). Two options:
- **A. Enable Lovable Cloud** → real Gemini-powered assistant.
- **B. Stay frontend-only** → I'll ship a smart rule-based assistant (totals, lookups, "show me top customer this month") with no cloud.

I'll proceed with everything else immediately and ask you A/B for the AI before wiring it.
