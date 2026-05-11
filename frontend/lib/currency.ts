/** Plain number string for SAR displays; pair with «ر.س» in Arabic copy or `sar-glyph` styling where used. */
export function formatSar(n: string | number): string {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(v);
}
