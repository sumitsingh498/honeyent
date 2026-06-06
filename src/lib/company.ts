// Company profile + owner contact. Persisted to localStorage so the
// user can edit it from Settings and have it reflected on every PDF.

export interface CompanyProfile {
  name: string;
  tagline: string;
  gstin: string;
  address: string;
  phone: string;          // primary contact / owner WhatsApp
  email: string;          // primary email
  bank: string;
  upi: string;
}

const KEY = "honey-erp-company";

export const DEFAULT_COMPANY: CompanyProfile = {
  name: "HONEY ENTERPRISES",
  tagline: "Stone Crusher • Aggregate Trading • Transport",
  gstin: "06ABCDE1234F1Z5",
  address: "Yard No. 12, NH-48, Gurugram, Haryana",
  phone: "8059075260",
  email: "sumit2and2singh@gmail.com",
  bank: "HDFC Bank • A/c 50200012345678 • IFSC HDFC0001234",
  upi: "honey@upi",
};

export function loadCompany(): CompanyProfile {
  if (typeof window === "undefined") return DEFAULT_COMPANY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_COMPANY;
    return { ...DEFAULT_COMPANY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_COMPANY;
  }
}

export function saveCompany(p: CompanyProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}
