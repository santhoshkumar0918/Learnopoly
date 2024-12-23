import { clerkClient } from "@clerk/nextjs/server";
import { supabase } from "./supabase";

export const syncClerkUserToSupabase = async (clerkUserId: string) => {
  const user = await clerkClient.users.getUser(clerkUserId);
  const { error } = await supabase.from("users").upsert(
    {
      clerk_id: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
    { onConflict: ["clerk_id"] }
  );

  if (error) {
    console.error("Failed to sync user:", error);
  }
};
