import { cookies } from "next/headers";
import type { DashboardRole } from "@/lib/content";

/**
 * Where to go after login/signup, from a `?next=` parameter. Only in-app
 * dashboard paths are accepted, so the parameter can't be used to send people
 * to another site (open redirect).
 */
export function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return /^\/dashboard(\/[a-z-]+)?(\?[\w=&.%-]*)?$/.test(value) ? value : undefined;
}

/** Placeholder session until real accounts exist: which dashboard to show. */
export async function setRole(role: DashboardRole) {
  (await cookies()).set("hp_role", role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
