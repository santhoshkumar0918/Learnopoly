


// import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { supabase } from "./lib/supabase";

// export default clerkMiddleware(async (auth, req) => {
//   console.log("Middleware triggered...");

//   // Safely get auth without throwing an error
//   const authData = getAuth(req) || {};
//   const { userId } = authData;

//   if (!userId) {
//     console.log("No userId found, skipping user sync.");
//     return NextResponse.next();
//   }

//   console.log("Authenticated user:", userId);

//   const { data, error } = await supabase
//     .from("users")
//     .select("clerk_id")
//     .eq("clerk_id", userId)
//     .single();

//   if (error && error.code !== "PGRST116") {
//     console.error("Supabase error:", error.message);
//   }

//   if (!data) {
//     console.log("User not found in Supabase, fetching from Clerk...");
//     const clerkUser = await fetchClerkUser(userId);

//     if (clerkUser) {
//       console.log(
//         "Inserting new user into Supabase:",
//         clerkUser.emailAddresses[0].emailAddress
//       );
//       const { error: insertError } = await supabase.from("users").insert([
//         {
//           clerk_id: clerkUser.id,
//           email: clerkUser.emailAddresses[0].emailAddress,
//         },
//       ]);

//       if (insertError) {
//         console.error("Failed to insert user:", insertError.message);
//       }
//     } else {
//       console.error("Failed to fetch user from Clerk.");
//     }
//   }

//   return NextResponse.next();
// });

// // Fetch Clerk user info
// async function fetchClerkUser(userId: string) {
//   console.log("Fetching Clerk user:", userId);
//   const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//     },
//   });

//   if (!res.ok) {
//     console.error("Failed to fetch Clerk user. Status:", res.status);
//     return null;
//   }

//   return await res.json();
// }

// // Apply to all routes except static files, _next, etc.
// export const config = {
//   matcher: ["/((?!_next|static|favicon.ico).*)"],
// };


import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

export default clerkMiddleware(async (auth, req) => {
  console.log("Middleware triggered for:", req.url);

  // Skip for public routes
  if (req.url.includes("/auth/sign-up")) {
    console.log("Public route, skipping middleware.");
    return NextResponse.next();
  }

  const authData = getAuth(req) || {};
  const { userId } = authData;

  if (!userId) {
    console.log("No userId found, skipping user sync.");
    return NextResponse.next();
  }

  console.log("Authenticated user:", userId);

  try {
    const { data, error } = await supabase
      .from("users")
      .select("clerk_id")
      .eq("clerk_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error.message);
    }

    if (!data) {
      console.log("User not found in Supabase, fetching from Clerk...");
      const clerkUser = await fetchClerkUser(userId);

      if (clerkUser) {
        console.log("Inserting new user into Supabase.");
        const { error: insertError } = await supabase.from("users").insert([
          {
            clerk_id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
          },
        ]);

        if (insertError) {
          console.error("Failed to insert user:", insertError.message);
        }
      } else {
        console.error("Failed to fetch user from Clerk.");
      }
    }
  } catch (e) {
    console.error("Middleware error:", e);
  }

  return NextResponse.next();
});

async function fetchClerkUser(userId: string) {
  console.log("Fetching Clerk user:", userId);
  const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch Clerk user. Status:", res.status);
    return null;
  }

  return await res.json();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|auth/sign-up).*)"],
};
