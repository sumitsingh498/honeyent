// Share helpers — open WhatsApp / Email with prefilled body.
import { loadCompany } from "./company";

export function shareWhatsApp(message: string, phone?: string): void {
  const p = (phone || loadCompany().phone || "").replace(/\D/g, "");
  const num = p.length === 10 ? `91${p}` : p;
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function shareEmail(subject: string, body: string, to?: string): void {
  const addr = to || loadCompany().email;
  const url = `mailto:${addr}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}
