"use client";

import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId } = useAuth();

  if (!userId) {
    return <div>You must be signed in to view this page.</div>;
  }

  return <div>Welcome to your dashboard!</div>;
}
