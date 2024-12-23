"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ResponsiveNav from "./components/Header/Responsivenav";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize QueryClient inside the component to avoid shared state between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ResponsiveNav />
      <main>{children}</main>
    </QueryClientProvider>
  );
}
