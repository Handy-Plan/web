import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";
import Story from "@/components/sections/Story";
import Signals from "@/components/sections/Signals";
import Problem from "@/components/sections/Problem";
import Market from "@/components/sections/Market";
import CustomerFlow from "@/components/sections/CustomerFlow";
import WhyHandyPlan from "@/components/sections/WhyHandyPlan";
import BusinessModel from "@/components/sections/BusinessModel";
import Languages from "@/components/sections/Languages";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SmoothScroll />
      <Navbar />
      {/* Opaque and above the footer, so the footer is uncovered like a curtain */}
      <main className="relative z-10 bg-canvas">
        <Story />
        <Signals />
        <Problem />
        <Market />
        <CustomerFlow />
        <WhyHandyPlan />
        <BusinessModel />
        <Languages />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
