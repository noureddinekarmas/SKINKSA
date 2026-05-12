const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.officialskinksa.store";

export interface AdminTrafficSourceRow {
  utm_source: string;
  utm_medium: string;
  sessions: number;
  page_views: number;
  orders_kpi: number;
  conversion_rate: number;
}

export interface AdminTrafficAttribution {
  start: string;
  end_exclusive: string;
  rows: AdminTrafficSourceRow[];
  total_valid_sessions: number;
  total_valid_page_views: number;
  total_orders_kpi: number;
  overall_conversion_rate: number;
}

export interface AdminProductSalesRow {
  product_id: string;
  product_slug: string;
  product_sku: string | null;
  product_title_ar: string;
  line_type: string;
  geo_country: string | null;
  order_count: number;
  units_sold: number;
  revenue_sar: string;
}

export interface AdminMetrics {
  start: string;
  end_exclusive: string;
  valid_page_views: number;
  valid_product_views: number;
  valid_add_to_cart: number;
  valid_begin_checkout: number;
  valid_events_total: number;
  valid_sessions: number;
  finalized_orders_valid_geo: number;
  finalized_orders_all: number;
  revenue_valid_sar: string;
  revenue_all_sar: string;
  conversion_valid_sessions_to_order: number;
  conversion_valid_product_views_to_order: number;
}

export interface AdminOrderRow {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  total_sar: string;
  customer_name: string;
  customer_phone_e164: string;
  customer_province: string | null;
  geo_country: string | null;
  geo_is_vpn: boolean;
  geo_is_proxy: boolean;
  geo_is_tor: boolean;
  geo_secondary_vpn: boolean;
  counts_as_valid_kpi: boolean;
  utm_source: string | null;
  utm_campaign: string | null;
}

export interface AdminOrderDetail {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone_raw: string;
  customer_phone_e164: string;
  customer_address: string | null;
  customer_province: string | null;
  currency: string;
  subtotal_sar: string;
  upsell_sar: string;
  total_sar: string;
  selected_offer_code: string | null;
  upsell_decision: string | null;
  source_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  user_agent: string | null;
  ip_address: string | null;
  geo_country: string | null;
  geo_city: string | null;
  geo_subdivision: string | null;
  geo_postal_code: string | null;
  geo_is_vpn: boolean;
  geo_is_proxy: boolean;
  geo_is_tor: boolean;
  geo_secondary_vpn: boolean;
  geo_risk_score: number | null;
  geo_source: string | null;
  webhook_sent: boolean;
  items: Array<{
    id: string;
    title_snapshot: string;
    quantity: number;
    unit_price_sar: string;
    line_total_sar: string;
    is_upsell: boolean;
    product_slug?: string | null;
    sku?: string | null;
  }>;
  webhook_deliveries: Array<{
    id: string;
    target: string;
    status: string;
    attempt_count: number;
    last_error: string | null;
    last_attempt_at: string | null;
    created_at: string;
  }>;
  counts_as_valid_kpi: boolean;
}

function authHeader(user: string, password: string): HeadersInit {
  const token = btoa(`${user}:${password}`);
  return { Authorization: `Basic ${token}` };
}

export async function fetchAdminTrafficAttribution(
  user: string,
  password: string,
  from: string,
  to: string
): Promise<AdminTrafficAttribution> {
  const q = new URLSearchParams({ from, to });
  const res = await fetch(`${API_BASE}/v1/admin/traffic-attribution?${q}`, {
    headers: { ...authHeader(user, password) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchAdminProductSales(
  user: string,
  password: string,
  from: string,
  to: string,
  opts?: { finalizedOnly?: boolean }
): Promise<AdminProductSalesRow[]> {
  const q = new URLSearchParams({ from, to });
  if (opts?.finalizedOnly === false) {
    q.set("finalized_only", "false");
  }
  const res = await fetch(`${API_BASE}/v1/admin/sales-by-product?${q}`, {
    headers: { ...authHeader(user, password) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchAdminMetrics(
  user: string,
  password: string,
  from: string,
  to: string
): Promise<AdminMetrics> {
  const q = new URLSearchParams({ from, to });
  const res = await fetch(`${API_BASE}/v1/admin/metrics?${q}`, {
    headers: { ...authHeader(user, password) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchAdminOrders(
  user: string,
  password: string,
  opts?: { from?: string; to?: string; status?: string; limit?: number; offset?: number }
): Promise<AdminOrderRow[]> {
  const q = new URLSearchParams();
  if (opts?.from) q.set("from", opts.from);
  if (opts?.to) q.set("to", opts.to);
  if (opts?.status) q.set("status", opts.status);
  if (opts?.limit != null) q.set("limit", String(opts.limit));
  if (opts?.offset != null) q.set("offset", String(opts.offset));
  const res = await fetch(`${API_BASE}/v1/admin/orders?${q}`, {
    headers: { ...authHeader(user, password) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchAdminOrderDetail(
  user: string,
  password: string,
  orderId: string
): Promise<AdminOrderDetail> {
  const res = await fetch(`${API_BASE}/v1/admin/orders/${orderId}`, {
    headers: { ...authHeader(user, password) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`);
  }
  return res.json();
}
