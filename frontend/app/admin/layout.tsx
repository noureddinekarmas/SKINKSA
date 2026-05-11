import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-brand-mist)] text-[var(--color-brand-ink)]" dir="ltr">
      {children}
    </div>
  );
}
