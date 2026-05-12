"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  fetchAdminMetrics,
  fetchAdminOrderDetail,
  fetchAdminOrders,
  fetchAdminProductSales,
  type AdminMetrics,
  type AdminOrderDetail,
  type AdminOrderRow,
  type AdminProductSalesRow,
} from "@/lib/api/admin";

function formatSar(n: string | number): string {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("en-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 2 }).format(v);
}

function formatPct(x: number): string {
  return `${(x * 100).toFixed(2)}%`;
}

function defaultDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export default function AdminDashboardPage() {
  const [{ from, to }, setRange] = useState(defaultDateRange);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = useState<"overview" | "orders" | "products">("overview");
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [productSales, setProductSales] = useState<AdminProductSalesRow[]>([]);
  const [salesFinalizedOnly, setSalesFinalizedOnly] = useState(true);
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creds = useMemo(() => ({ user, password }), [user, password]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, list, sales] = await Promise.all([
        fetchAdminMetrics(creds.user, creds.password, from, to),
        fetchAdminOrders(creds.user, creds.password, { from, to, limit: 100 }),
        fetchAdminProductSales(creds.user, creds.password, from, to, {
          finalizedOnly: salesFinalizedOnly,
        }),
      ]);
      setMetrics(m);
      setOrders(list);
      setProductSales(sales);
      setConnected(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [creds.user, creds.password, from, to, salesFinalizedOnly]);

  const openOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchAdminOrderDetail(creds.user, creds.password, id);
      setDetail(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 flex flex-col gap-4 border-b border-[var(--color-brand-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-brand-slate)]">
            SKINKSA operations
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-inter)] text-2xl font-semibold text-[var(--color-brand-deep)]">
            Admin dashboard
          </h1>
        </div>
        <Link
          href="/"
          className="text-sm text-[var(--color-brand-primary)] underline-offset-4 hover:underline"
        >
          ← Back to store
        </Link>
      </header>

      {!connected ? (
        <section className="mx-auto max-w-md rounded-2xl border border-[var(--color-brand-border)] bg-white p-8 shadow-sm">
          <h2 className="font-[family-name:var(--font-inter)] text-lg font-semibold text-[var(--color-brand-deep)]">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-[var(--color-brand-slate)]">
            Use the same username and password as configured in the API environment (
            <code className="text-xs">ADMIN_BASIC_AUTH_*</code>).
          </p>
          <label className="mt-6 block text-sm font-medium text-[var(--color-brand-ink)]">
            Username
            <input
              className="mt-1 w-full rounded-lg border border-[var(--color-brand-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-[var(--color-brand-ink)]">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-[var(--color-brand-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-[var(--color-brand-primary)] py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
            onClick={() => void loadAll()}
          >
            Connect
          </button>
          {error ? <p className="mt-4 text-sm text-[var(--color-brand-error)]">{error}</p> : null}
        </section>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 border-b border-[var(--color-brand-border)] pb-4">
            {(
              [
                ["overview", "Overview"],
                ["orders", "Orders"],
                ["products", "Products & countries"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tab === id
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "bg-white text-[var(--color-brand-slate)] ring-1 ring-[var(--color-brand-border)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="text-sm font-medium">
              From
              <input
                type="date"
                className="ml-2 rounded-lg border border-[var(--color-brand-border)] px-2 py-1.5 text-sm"
                value={from}
                onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              />
            </label>
            <label className="text-sm font-medium">
              To
              <input
                type="date"
                className="ml-2 rounded-lg border border-[var(--color-brand-border)] px-2 py-1.5 text-sm"
                value={to}
                onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              />
            </label>
            <button
              type="button"
              className="rounded-lg bg-[var(--color-brand-deep)] px-4 py-2 text-sm font-medium text-white"
              onClick={() => void loadAll()}
              disabled={loading}
            >
              Apply range
            </button>
            <button
              type="button"
              className="rounded-lg border border-[var(--color-brand-border)] bg-white px-4 py-2 text-sm text-[var(--color-brand-slate)]"
              onClick={() => {
                setConnected(false);
                setMetrics(null);
                setOrders([]);
                setProductSales([]);
                setDetail(null);
              }}
            >
              Log out
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-[var(--color-brand-error)]">{error}</p> : null}

          {tab === "overview" && loading && !metrics ? (
            <p className="mt-8 text-sm text-[var(--color-brand-slate)]">Loading metrics…</p>
          ) : null}

          {tab === "overview" && metrics ? (
            <section className="mt-8 space-y-6">
              <p className="text-sm text-[var(--color-brand-slate)]">
                Figures below include only{" "}
                <strong className="text-[var(--color-brand-ink)]">Saudi (SA) IPs</strong> with{" "}
                <strong className="text-[var(--color-brand-ink)]">no VPN / proxy / Tor</strong> from
                MaxMind and, when configured, IPQualityScore.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard title="Valid page views" value={metrics.valid_page_views} />
                <MetricCard title="Valid product views" value={metrics.valid_product_views} />
                <MetricCard title="Valid add to cart" value={metrics.valid_add_to_cart} />
                <MetricCard title="Valid begin checkout" value={metrics.valid_begin_checkout} />
                <MetricCard title="Valid sessions" value={metrics.valid_sessions} />
                <MetricCard
                  title="Orders (KPI geo)"
                  value={metrics.finalized_orders_valid_geo}
                  hint={`All finalized: ${metrics.finalized_orders_all}`}
                />
                <MetricCard
                  title="Revenue (KPI geo)"
                  value={formatSar(metrics.revenue_valid_sar)}
                  hint={`All: ${formatSar(metrics.revenue_all_sar)}`}
                />
                <MetricCard
                  title="Conversion (session → order)"
                  value={formatPct(metrics.conversion_valid_sessions_to_order)}
                />
                <MetricCard
                  title="Conversion (product view → order)"
                  value={formatPct(metrics.conversion_valid_product_views_to_order)}
                />
              </div>
            </section>
          ) : null}

          {tab === "products" ? (
            <section className="mt-8 space-y-4">
              <p className="text-sm text-[var(--color-brand-slate)]">
                Rows group <strong>catalog product</strong> (slug + SKU from your DB),{" "}
                <strong>buyer country</strong> from MaxMind on the order, and whether the line is{" "}
                <strong>primary</strong> or <strong>upsell</strong>. Set each product&apos;s{" "}
                <code className="text-xs">sku</code> in the database so it shows here.
              </p>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--color-brand-ink)]">
                <input
                  type="checkbox"
                  className="rounded border-[var(--color-brand-border)]"
                  checked={salesFinalizedOnly}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setSalesFinalizedOnly(v);
                    if (!connected) return;
                    void (async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const sales = await fetchAdminProductSales(creds.user, creds.password, from, to, {
                          finalizedOnly: v,
                        });
                        setProductSales(sales);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to refresh");
                      } finally {
                        setLoading(false);
                      }
                    })();
                  }}
                />
                Finalized COD only (status = pending_confirmation)
              </label>
              <div className="overflow-x-auto rounded-2xl border border-[var(--color-brand-border)] bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[var(--color-brand-border)] bg-[var(--color-brand-mist)] font-[family-name:var(--font-inter)] text-xs uppercase tracking-wide text-[var(--color-brand-slate)]">
                    <tr>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Country</th>
                      <th className="px-4 py-3">Line</th>
                      <th className="px-4 py-3 text-right">Orders</th>
                      <th className="px-4 py-3 text-right">Units</th>
                      <th className="px-4 py-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSales.map((row, idx) => (
                      <tr
                        key={`${row.product_id}-${row.geo_country ?? "null"}-${row.line_type}-${row.product_sku ?? ""}-${idx}`}
                        className="border-b border-[var(--color-brand-border)] last:border-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs">{row.product_sku || "—"}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[var(--color-brand-primary)]">
                          {row.product_slug}
                        </td>
                        <td className="max-w-[200px] px-4 py-3 text-xs leading-snug text-[var(--color-brand-ink)]">
                          {row.product_title_ar}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{row.geo_country || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              row.line_type === "upsell"
                                ? "bg-[var(--color-brand-accent)]/20 text-[var(--color-brand-deep)]"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {row.line_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.order_count}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.units_sold}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          {formatSar(row.revenue_sar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {productSales.length === 0 && !loading ? (
                  <p className="p-6 text-center text-sm text-[var(--color-brand-slate)]">
                    No matching line items in this range.
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {tab === "orders" ? (
            <section className="mt-8 overflow-x-auto rounded-2xl border border-[var(--color-brand-border)] bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--color-brand-border)] bg-[var(--color-brand-mist)] font-[family-name:var(--font-inter)] text-xs uppercase tracking-wide text-[var(--color-brand-slate)]">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">When</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">KPI</th>
                    <th className="px-4 py-3">UTM</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="cursor-pointer border-b border-[var(--color-brand-border)] last:border-0 hover:bg-[#f8fbff]"
                      onClick={() => void openOrder(o.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                      <td className="px-4 py-3 text-[var(--color-brand-slate)]">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.customer_name}</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">{o.customer_phone_e164}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">{formatSar(o.total_sar)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            o.counts_as_valid_kpi
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-900"
                          }`}
                        >
                          {o.counts_as_valid_kpi ? "Counts" : "Excluded"}
                        </span>
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-xs text-[var(--color-brand-slate)]">
                        {o.utm_source || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && !loading ? (
                <p className="p-6 text-center text-sm text-[var(--color-brand-slate)]">No orders in range.</p>
              ) : null}
            </section>
          ) : null}

          {detail ? (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
              role="dialog"
              aria-modal
              onClick={() => setDetail(null)}
            >
              <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <OrderPreview order={detail} onClose={() => setDetail(null)} />
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-brand-border)] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-brand-slate)]">{title}</p>
      <p className="mt-2 font-[family-name:var(--font-inter)] text-2xl font-semibold text-[var(--color-brand-deep)]">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-[var(--color-brand-slate)]">{hint}</p> : null}
    </div>
  );
}

function OrderPreview({ order, onClose }: { order: AdminOrderDetail; onClose: () => void }) {
  return (
    <div className="relative">
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full p-1 text-[var(--color-brand-slate)] hover:bg-[var(--color-brand-mist)]"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
      <div className="border-b border-[var(--color-brand-border)] bg-gradient-to-br from-[var(--color-brand-mist)] to-white px-6 pb-6 pt-8">
        <p className="text-xs uppercase tracking-wide text-[var(--color-brand-slate)]">Order</p>
        <h2 className="mt-1 font-[family-name:var(--font-inter)] text-xl font-semibold text-[var(--color-brand-deep)]">
          {order.order_number}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-brand-slate)]">
          {new Date(order.created_at).toLocaleString()}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium ring-1 ring-[var(--color-brand-border)]">
            {order.status}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              order.counts_as_valid_kpi ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
            }`}
          >
            {order.counts_as_valid_kpi ? "Counts for KPI" : "Excluded from KPI"}
          </span>
        </div>
      </div>
      <div className="space-y-6 px-6 py-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-slate)]">
            Customer
          </h3>
          <p className="mt-2 font-medium">{order.customer_name}</p>
          <p className="text-sm text-[var(--color-brand-slate)]">{order.customer_phone_e164}</p>
          {order.customer_address ? (
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-brand-ink)]">{order.customer_address}</p>
          ) : null}
          {order.customer_province ? (
            <p className="text-sm text-[var(--color-brand-slate)]">{order.customer_province}</p>
          ) : null}
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-slate)]">
            Line items
          </h3>
          <ul className="mt-3 divide-y divide-[var(--color-brand-border)] rounded-xl border border-[var(--color-brand-border)]">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--color-brand-ink)]">{it.title_snapshot}</p>
                  <p className="text-xs text-[var(--color-brand-slate)]">
                    {it.product_slug || it.sku ? (
                      <>
                        <span className="font-mono text-[var(--color-brand-primary)]">
                          {it.product_slug ? `/${it.product_slug}` : ""}
                          {it.sku ? ` · SKU ${it.sku}` : ""}
                        </span>
                        <span className="mx-1">·</span>
                      </>
                    ) : null}
                    ×{it.quantity}
                    {it.is_upsell ? (
                      <span className="ml-2 rounded bg-[var(--color-brand-accent)]/20 px-1.5 py-0.5 text-[var(--color-brand-deep)]">
                        Upsell
                      </span>
                    ) : null}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm font-semibold">{formatSar(it.line_total_sar)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-[var(--color-brand-border)] pt-3 text-sm">
            <span className="text-[var(--color-brand-slate)]">Subtotal</span>
            <span>{formatSar(order.subtotal_sar)}</span>
          </div>
          {parseFloat(order.upsell_sar) > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-brand-slate)]">Upsell</span>
              <span>{formatSar(order.upsell_sar)}</span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between text-base font-semibold text-[var(--color-brand-deep)]">
            <span>Total</span>
            <span>{formatSar(order.total_sar)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--color-brand-slate)]">Geo</p>
            <p className="mt-1">
              {(order.geo_country || "—") +
                (order.geo_city ? ` · ${order.geo_city}` : "")}
            </p>
            <p className="mt-1 text-xs text-[var(--color-brand-slate)]">
              VPN {order.geo_is_vpn ? "yes" : "no"} · Proxy {order.geo_is_proxy ? "yes" : "no"} · Tor{" "}
              {order.geo_is_tor ? "yes" : "no"}
              <br />
              Secondary VPN {order.geo_secondary_vpn ? "yes" : "no"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--color-brand-slate)]">Attribution</p>
            <p className="mt-1 break-all text-xs">{order.utm_source || "—"}</p>
            <p className="text-xs text-[var(--color-brand-slate)]">{order.utm_campaign || ""}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--color-brand-slate)]">Integrations</p>
          <p className="mt-1 text-sm">Sheets webhook: {order.webhook_sent ? "sent" : "not sent"}</p>
          <ul className="mt-2 space-y-1 text-xs text-[var(--color-brand-slate)]">
            {order.webhook_deliveries.map((w) => (
              <li key={w.id}>
                {w.target}: <strong>{w.status}</strong>
                {w.last_error ? ` — ${w.last_error}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
