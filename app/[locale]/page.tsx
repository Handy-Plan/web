import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Problem from "@/components/sections/Problem";
import Market from "@/components/sections/Market";
import HowItWorks from "@/components/sections/HowItWorks";
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
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Market />
        <HowItWorks />
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
