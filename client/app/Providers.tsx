// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";
// import ResponsiveNav from "./components/Header/Responsivenav";

// export default function ClientProviders({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000,
//             refetchOnWindowFocus: false,
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ResponsiveNav />
//       <main>{children}</main>
//     </QueryClientProvider>
//   );
// }

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ResponsiveNav from "./components/Header/Responsivenav";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
   
   <QueryClientProvider client={queryClient}>
  <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-900 text-white">
    {/* Sidebar */}
    <ResponsiveNav />

    {/* Main Content */}
    <main className="flex-1">{children}</main>
  </div>
</QueryClientProvider>
  )
}


 // <QueryClientProvider client={queryClient}>
    //   <div className="flex">
    //     <ResponsiveNav />
    //     <main className="mx-auto ml-64 w-full">{children}</main>
    //   </div>
    // </QueryClientProvider>
