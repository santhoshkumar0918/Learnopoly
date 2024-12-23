// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Define public routes (no authentication required)
// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware(async (auth, request) => {
//   // Protect routes that are not public
//   if (!isPublicRoute(request)) {
//     await auth.protect(); // Protect the route
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };




import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "./app/lib/supabase";

export default clerkMiddleware(async (req) => {
  const auth = getAuth(req);
  const { userId } = auth;

  if (userId) {
    const { data, error } = await supabase
      .from("users")
      .select("clerk_id")
      .eq("clerk_id", userId)
      .single();

    if (!data) {
      const clerkUser = await fetchClerkUser(userId);

      if (clerkUser) {
        await supabase.from("users").insert([
          {
            clerk_id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
          },
        ]);
      }
    }
  }

  return NextResponse.next();
});

async function fetchClerkUser(userId: string) {
  const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });
  return res.ok ? await res.json() : null;
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
