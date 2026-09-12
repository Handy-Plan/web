import { cookies } from "next/headers";
import type { DashboardRole } from "@/lib/content";

/**
 * Which dashboard to show. Placeholder until real accounts exist: reads an
 * `hp_role` cookie and defaults to the business (Handwerker) dashboard.
 */
export async function readRole(): Promise<DashboardRole> {
  const value = (await cookies()).get("hp_role")?.value;
  return value === "customer" ? "customer" : "business";
}
