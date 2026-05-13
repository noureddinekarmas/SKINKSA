import type { ShopCurrency } from "@/lib/content/product-landing-data";

const KSA_MOBILE = /^(?:\+?966|0)?5\d{8}$/;
/** Qatar: 8-digit mobile, typically 3/5/6/7… */
const QA_MOBILE = /^(?:\+?974)?[3567]\d{7}$/;
/** Kuwait: 8-digit mobile, often 5/6/9… */
const KW_MOBILE = /^(?:\+?965)?[569]\d{7}$/;

export function isValidSaudiMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return KSA_MOBILE.test(cleaned);
}

export function isValidQatarMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return QA_MOBILE.test(cleaned);
}

export function isValidKuwaitMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return KW_MOBILE.test(cleaned);
}

export function isValidPhoneForCurrency(phone: string, currency: ShopCurrency): boolean {
  if (currency === "SAR") return isValidSaudiMobile(phone);
  if (currency === "QAR") return isValidQatarMobile(phone);
  return isValidKuwaitMobile(phone);
}

/** GCC national format for the storefront currency, or 7–15 digit international (include country code). */
export function isValidOrderPhone(phone: string, currency: ShopCurrency): boolean {
  if (isValidPhoneForCurrency(phone, currency)) return true;
  const d = phone.replace(/\D/g, "");
  return d.length >= 7 && d.length <= 15;
}

export function normalizeSaudiMobile(phone: string): { e164: string; digits: string } {
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("966")) cleaned = cleaned.slice(3);
  else if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  const national = cleaned;
  const digits = `966${national}`;
  const e164 = `+${digits}`;
  return { e164, digits };
}

function stripTel(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  return cleaned;
}

export function normalizeQatarMobile(phone: string): { e164: string; digits: string } {
  let cleaned = stripTel(phone);
  if (cleaned.startsWith("974")) cleaned = cleaned.slice(3);
  const national = cleaned;
  const digits = `974${national}`;
  return { e164: `+${digits}`, digits };
}

export function normalizeKuwaitMobile(phone: string): { e164: string; digits: string } {
  let cleaned = stripTel(phone);
  if (cleaned.startsWith("965")) cleaned = cleaned.slice(3);
  const national = cleaned;
  const digits = `965${national}`;
  return { e164: `+${digits}`, digits };
}

export function normalizeOrderPhone(phone: string, currency: ShopCurrency): { e164: string; digits: string } {
  if (isValidPhoneForCurrency(phone, currency)) {
    if (currency === "SAR") return normalizeSaudiMobile(phone);
    if (currency === "QAR") return normalizeQatarMobile(phone);
    return normalizeKuwaitMobile(phone);
  }
  const d = phone.replace(/\D/g, "");
  return { e164: `+${d}`, digits: d };
}
