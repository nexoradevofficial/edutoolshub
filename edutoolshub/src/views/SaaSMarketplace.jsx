"use client";

import { motion } from "framer-motion";
import { getAllSaasSolutions } from "@/data/saasSolutions";
import FloatingBackground from "@/components/saas/FloatingBackground";
import SectionHeading from "@/components/saas/SectionHeading";
import SaaSProductCard from "@/components/saas/SaaSProductCard";
import MarketplaceLeadCTAs from "@/components/saas/MarketplaceLeadCTAs";
import { LeadModalProvider } from "@/components/saas/LeadModalProvider";

export default function SaaSMarketplace() {
  const products = getAllSaasSolutions();

  return (
    <LeadModalProvider productTitle="EduToolsHub SaaS Solutions">
      <div className="relative overflow-hidden bg-[#f8fafc]">
        <section className="relative border-b border-slate-100 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <FloatingBackground />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saas-teal">
                Marketplace
              </p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-saas-ink sm:text-5xl">
                Enterprise SaaS Solutions
              </h1>
              <p className="mt-5 text-pretty text-base leading-relaxed text-slate-500 sm:text-lg">
                Powerful cloud-based software solutions designed to automate businesses,
                educational institutes and organizations.
              </p>
              <MarketplaceLeadCTAs />
            </motion.div>
          </div>
        </section>

        <section className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Solutions"
              title="Explore our SaaS products"
              subtitle="Each product is independently packaged — add more anytime from a single catalog."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {products.map((product, i) => (
                <SaaSProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-saas-ink">
              Need Custom Software?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
              We also develop custom SaaS solutions for every business — hospitals, HR, gyms,
              inventory, restaurants, libraries, CRM, POS and more.
            </p>
            <div className="mt-6 flex justify-center">
              <MarketplaceLeadCTAs />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-saas-mist py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-saas-ink">
              Cloud SaaS for schools, colleges and businesses
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              EduToolsHub SaaS Solutions is a growing marketplace of cloud software for educational
              institutes and organizations. Start with our School &amp; College Management System —
              a complete ERP for admissions, fees, QR attendance, WhatsApp messaging, exams and
              Admin/Teacher portals — then expand to more industry solutions as they launch.
            </p>
          </div>
        </section>
      </div>
    </LeadModalProvider>
  );
}
