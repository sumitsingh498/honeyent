// Centralized mock data for the ERP v1.
// Replace with API/server functions when backend is wired.

export type OrderStatus =
  | "Pending"
  | "Approved"
  | "Loaded"
  | "In Transit"
  | "Delivered"
  | "Billed"
  | "Closed";

export interface Customer {
  id: string;
  code: string;
  name: string;
  gst: string;
  mobile: string;
  city: string;
  creditLimit: number;
  outstanding: number;
  status: "Active" | "Inactive";
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  gst: string;
  mobile: string;
  city: string;
  outstanding: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  hsn: string;
  unit: string;
  gst: number;
  rate: number;
}

export interface Vehicle {
  id: string;
  number: string;
  ownership: "Own" | "Hired";
  capacity: number; // tonnes
  insuranceExpiry: string;
  fitnessExpiry: string;
  permitExpiry: string;
}

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  license: string;
  licenseExpiry: string;
  status: "Active" | "Off Duty";
}

export interface Order {
  id: string;
  no: string;
  date: string;
  customer: string;
  product: string;
  qty: number;
  rate: number;
  vehicle: string;
  driver: string;
  status: OrderStatus;
}

export interface WeighSlip {
  id: string;
  slipNo: string;
  date: string;
  vehicle: string;
  product: string;
  gross: number;
  tare: number;
  net: number;
  customerWeight?: number;
  loss?: number;
}

export interface Trip {
  id: string;
  tripNo: string;
  date: string;
  vehicle: string;
  driver: string;
  source: string;
  destination: string;
  weight: number;
  revenue: number;
  expense: number;
}

export interface Invoice {
  id: string;
  no: string;
  date: string;
  party: string;
  amount: number;
  gst: number;
  status: "Paid" | "Unpaid" | "Partial";
}

export const customers: Customer[] = [
  { id: "c1", code: "CUST001", name: "Sharma Construction", gst: "06ABCDE1234F1Z5", mobile: "9812345671", city: "Gurugram", creditLimit: 500000, outstanding: 124300, status: "Active" },
  { id: "c2", code: "CUST002", name: "Delhi Infra Pvt Ltd", gst: "07ABCDE1234F2Z3", mobile: "9812345672", city: "New Delhi", creditLimit: 1000000, outstanding: 432100, status: "Active" },
  { id: "c3", code: "CUST003", name: "NHAI Project Site 14", gst: "06ABCDE1234F3Z1", mobile: "9812345673", city: "Rewari", creditLimit: 2000000, outstanding: 985400, status: "Active" },
  { id: "c4", code: "CUST004", name: "Kumar Builders", gst: "06ABCDE1234F4Z9", mobile: "9812345674", city: "Faridabad", creditLimit: 300000, outstanding: 0, status: "Active" },
  { id: "c5", code: "CUST005", name: "Royal Cement Works", gst: "06ABCDE1234F5Z7", mobile: "9812345675", city: "Bhiwadi", creditLimit: 800000, outstanding: 215000, status: "Inactive" },
];

export const suppliers: Supplier[] = [
  { id: "s1", code: "SUP001", name: "Aravalli Stone Crusher", gst: "08ABCDE1111F1Z2", mobile: "9876500001", city: "Alwar", outstanding: 312000 },
  { id: "s2", code: "SUP002", name: "Haryana Aggregates", gst: "06ABCDE2222F1Z3", mobile: "9876500002", city: "Sohna", outstanding: 0 },
  { id: "s3", code: "SUP003", name: "Yamuna Sand Co.", gst: "09ABCDE3333F1Z4", mobile: "9876500003", city: "Saharanpur", outstanding: 145000 },
];

export const products: Product[] = [
  { id: "p1", code: "DUST", name: "Stone Dust", hsn: "25171010", unit: "MT", gst: 5, rate: 420 },
  { id: "p2", code: "10MM", name: "10mm Aggregate", hsn: "25171010", unit: "MT", gst: 5, rate: 580 },
  { id: "p3", code: "20MM", name: "20mm Aggregate", hsn: "25171010", unit: "MT", gst: 5, rate: 560 },
  { id: "p4", code: "40MM", name: "40mm Aggregate", hsn: "25171010", unit: "MT", gst: 5, rate: 540 },
  { id: "p5", code: "BLDR", name: "Boulder", hsn: "25171010", unit: "MT", gst: 5, rate: 360 },
  { id: "p6", code: "GSB", name: "GSB", hsn: "25171010", unit: "MT", gst: 5, rate: 480 },
  { id: "p7", code: "WMM", name: "WMM", hsn: "25171010", unit: "MT", gst: 5, rate: 520 },
  { id: "p8", code: "MSND", name: "M-Sand", hsn: "25051019", unit: "MT", gst: 5, rate: 640 },
  { id: "p9", code: "RSND", name: "River Sand", hsn: "25051019", unit: "MT", gst: 5, rate: 720 },
];

export const vehicles: Vehicle[] = [
  { id: "v1", number: "HR55AB1234", ownership: "Own", capacity: 25, insuranceExpiry: "2026-04-12", fitnessExpiry: "2026-08-30", permitExpiry: "2026-02-15" },
  { id: "v2", number: "HR38C5678", ownership: "Own", capacity: 16, insuranceExpiry: "2026-01-04", fitnessExpiry: "2025-12-28", permitExpiry: "2026-06-20" },
  { id: "v3", number: "RJ14GA9012", ownership: "Hired", capacity: 28, insuranceExpiry: "2026-09-19", fitnessExpiry: "2026-03-10", permitExpiry: "2026-07-01" },
  { id: "v4", number: "UP16T4521", ownership: "Hired", capacity: 22, insuranceExpiry: "2025-12-15", fitnessExpiry: "2026-05-22", permitExpiry: "2025-12-08" },
  { id: "v5", number: "DL1LT8800", ownership: "Own", capacity: 18, insuranceExpiry: "2026-11-02", fitnessExpiry: "2026-10-18", permitExpiry: "2026-09-14" },
];

export const drivers: Driver[] = [
  { id: "d1", name: "Ramesh Yadav", mobile: "9911100001", license: "HR-0420110012345", licenseExpiry: "2027-05-12", status: "Active" },
  { id: "d2", name: "Suresh Kumar", mobile: "9911100002", license: "HR-0420090054321", licenseExpiry: "2026-03-30", status: "Active" },
  { id: "d3", name: "Mohd. Asif", mobile: "9911100003", license: "DL-1320150087654", licenseExpiry: "2028-11-08", status: "Off Duty" },
  { id: "d4", name: "Vikram Singh", mobile: "9911100004", license: "RJ-1420130045678", licenseExpiry: "2026-09-19", status: "Active" },
];

export const orders: Order[] = [
  { id: "o1", no: "ORD-2406-001", date: "2026-06-01", customer: "Sharma Construction", product: "20mm Aggregate", qty: 25, rate: 560, vehicle: "HR55AB1234", driver: "Ramesh Yadav", status: "In Transit" },
  { id: "o2", no: "ORD-2406-002", date: "2026-06-01", customer: "Delhi Infra Pvt Ltd", product: "Stone Dust", qty: 16, rate: 420, vehicle: "HR38C5678", driver: "Suresh Kumar", status: "Loaded" },
  { id: "o3", no: "ORD-2406-003", date: "2026-06-01", customer: "NHAI Project Site 14", product: "GSB", qty: 28, rate: 480, vehicle: "RJ14GA9012", driver: "Vikram Singh", status: "Delivered" },
  { id: "o4", no: "ORD-2406-004", date: "2026-06-02", customer: "Kumar Builders", product: "M-Sand", qty: 18, rate: 640, vehicle: "DL1LT8800", driver: "Ramesh Yadav", status: "Pending" },
  { id: "o5", no: "ORD-2406-005", date: "2026-06-02", customer: "Royal Cement Works", product: "Boulder", qty: 22, rate: 360, vehicle: "UP16T4521", driver: "Mohd. Asif", status: "Approved" },
  { id: "o6", no: "ORD-2406-006", date: "2026-06-02", customer: "Sharma Construction", product: "10mm Aggregate", qty: 25, rate: 580, vehicle: "HR55AB1234", driver: "Ramesh Yadav", status: "Billed" },
];

export const weighSlips: WeighSlip[] = [
  { id: "w1", slipNo: "WB-001241", date: "2026-06-01", vehicle: "HR55AB1234", product: "20mm Aggregate", gross: 38520, tare: 13420, net: 25100, customerWeight: 24980, loss: 120 },
  { id: "w2", slipNo: "WB-001242", date: "2026-06-01", vehicle: "HR38C5678", product: "Stone Dust", gross: 28200, tare: 12100, net: 16100, customerWeight: 16080, loss: 20 },
  { id: "w3", slipNo: "WB-001243", date: "2026-06-01", vehicle: "RJ14GA9012", product: "GSB", gross: 41800, tare: 13620, net: 28180, customerWeight: 28000, loss: 180 },
  { id: "w4", slipNo: "WB-001244", date: "2026-06-02", vehicle: "DL1LT8800", product: "M-Sand", gross: 30900, tare: 12800, net: 18100 },
];

export const trips: Trip[] = [
  { id: "t1", tripNo: "TRP-1001", date: "2026-06-01", vehicle: "HR55AB1234", driver: "Ramesh Yadav", source: "Alwar Crusher", destination: "Gurugram Site A", weight: 25, revenue: 14000, expense: 8200 },
  { id: "t2", tripNo: "TRP-1002", date: "2026-06-01", vehicle: "HR38C5678", driver: "Suresh Kumar", source: "Sohna Crusher", destination: "Delhi Dwarka", weight: 16, revenue: 9200, expense: 5400 },
  { id: "t3", tripNo: "TRP-1003", date: "2026-06-01", vehicle: "RJ14GA9012", driver: "Vikram Singh", source: "Alwar Crusher", destination: "NHAI Site 14", weight: 28, revenue: 18500, expense: 11200 },
  { id: "t4", tripNo: "TRP-1004", date: "2026-06-02", vehicle: "DL1LT8800", driver: "Ramesh Yadav", source: "Saharanpur", destination: "Faridabad Yard", weight: 18, revenue: 12800, expense: 7600 },
];

export const salesInvoices: Invoice[] = [
  { id: "si1", no: "INV-2406-001", date: "2026-06-01", party: "Sharma Construction", amount: 147000, gst: 7350, status: "Unpaid" },
  { id: "si2", no: "INV-2406-002", date: "2026-06-01", party: "Delhi Infra Pvt Ltd", amount: 70560, gst: 3360, status: "Partial" },
  { id: "si3", no: "INV-2405-088", date: "2026-05-29", party: "NHAI Project Site 14", amount: 282240, gst: 13440, status: "Paid" },
];

export const purchaseInvoices: Invoice[] = [
  { id: "pi1", no: "PUR-2406-014", date: "2026-06-01", party: "Aravalli Stone Crusher", amount: 215000, gst: 10250, status: "Unpaid" },
  { id: "pi2", no: "PUR-2406-015", date: "2026-06-01", party: "Haryana Aggregates", amount: 98400, gst: 4690, status: "Paid" },
  { id: "pi3", no: "PUR-2405-098", date: "2026-05-28", party: "Yamuna Sand Co.", amount: 145000, gst: 6910, status: "Partial" },
];

export const statusTone: Record<OrderStatus, string> = {
  Pending: "bg-muted text-muted-foreground",
  Approved: "bg-info/15 text-info",
  Loaded: "bg-warning/15 text-warning",
  "In Transit": "bg-primary/15 text-primary",
  Delivered: "bg-success/15 text-success",
  Billed: "bg-accent/15 text-accent-foreground",
  Closed: "bg-muted text-muted-foreground",
};

export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function daysUntil(dateStr: string): number {
  const d = new Date(dateStr).getTime();
  return Math.ceil((d - Date.now()) / (1000 * 60 * 60 * 24));
}
