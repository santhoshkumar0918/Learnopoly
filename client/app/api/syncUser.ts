import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../lib/supabase";


export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await fetchClerkUser(userId);

  if (!clerkUser) {
    return NextResponse.json(
      { error: "Failed to fetch Clerk user" },
      { status: 500 }
    );
  }

  const { error } = await supabase.from("users").upsert(
    {
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
    },
    { onConflict: "clerk_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User synced successfully" });
}

// Fetch Clerk user
async function fetchClerkUser(userId: string) {
  const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });
  return res.ok ? await res.json() : null;
}
