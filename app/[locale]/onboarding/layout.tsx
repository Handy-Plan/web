import type { Metadata } from "next";
import { noIndex } from "@/lib/site";

// The setup wizard is part of the app, not something to find on Google.
export const metadata: Metadata = { robots: noIndex };

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
