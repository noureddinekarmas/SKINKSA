"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { captureAttribution } from "@/lib/tracking";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    captureAttribution();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
