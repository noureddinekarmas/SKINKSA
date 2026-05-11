export function isValidSaudiMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(?:\+?966|0)?5\d{8}$/.test(cleaned);
}

export function normalizeSaudiMobile(phone: string): { e164: string; digits: string } {
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("966")) cleaned = cleaned.slice(3);
  else if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  const digits = `966${cleaned}`;
  const e164 = `+${digits}`;
  return { e164, digits };
}
