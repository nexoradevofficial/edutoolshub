"use client";

import dynamic from "next/dynamic";
import FeatureGrid from "@/components/saas/FeatureGrid";
import SectionHeading from "@/components/saas/SectionHeading";
import { LeadModalProvider } from "@/components/saas/LeadModalProvider";

const SaaSHero = dynamic(() => import("@/components/saas/SaaSHero"));
const ProductScreens = dynamic(() => import("@/components/saas/ProductScreens"));
const ModuleGrid = dynamic(() => import("@/components/saas/ModuleGrid"));
const FeatureTimeline = dynamic(() => import("@/components/saas/FeatureTimeline"));
const WhyChooseUs = dynamic(() => import("@/components/saas/WhyChooseUs"));
const DashboardShowcase = dynamic(() => import("@/components/saas/DashboardShowcase"));
const ScreenshotsGallery = dynamic(() => import("@/components/saas/ScreenshotsGallery"));
const ImplementationProcess = dynamic(() => import("@/components/saas/ImplementationProcess"));
const SuccessMetrics = dynamic(() => import("@/components/saas/SuccessMetrics"));
const UsedBy = dynamic(() => import("@/components/saas/UsedBy"));
const SecurityPrivacy = dynamic(() => import("@/components/saas/SecurityPrivacy"));
const TechSupport = dynamic(() => import("@/components/saas/TechSupport"));
const CustomizationNotice = dynamic(() => import("@/components/saas/CustomizationNotice"));
const PricingSection = dynamic(() => import("@/components/saas/PricingSection"));
const FAQSection = dynamic(() => import("@/components/saas/FAQSection"));
const CTASection = dynamic(() => import("@/components/saas/CTASection"));
const SaasSeoContent = dynamic(() => import("@/components/saas/SaasSeoContent"));

export default function SaaSProductLanding({ product }) {
  return (
    <LeadModalProvider productTitle={product.title}>
      <article>
        <SaaSHero product={product} />

        <section className="border-b border-slate-100 bg-white py-12 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Trusted foundation"
              title="Cloud-native. Secure. Always on."
            />
            <div className="mt-10">
              <FeatureGrid items={product.trusted} columns={6} />
            </div>
          </div>
        </section>

        <UsedBy usedBy={product.usedBy} />
        <SuccessMetrics metrics={product.metrics} />
        <ProductScreens images={product.images} />
        <ModuleGrid modules={product.modules} />
        <FeatureTimeline highlights={product.highlights} />
        <WhyChooseUs items={product.whyChoose} />
        <DashboardShowcase images={product.images} />
        <ScreenshotsGallery screenshots={product.screenshots} />
        <ImplementationProcess process={product.process} />
        <SecurityPrivacy security={product.security} />
        <TechSupport support={product.support} />
        <CustomizationNotice customization={product.customization} />
        <PricingSection pricing={product.pricing} whatsapp={product.buttons.whatsapp} />
        <FAQSection faq={product.faq} />
        <SaasSeoContent product={product} />
        <CTASection
          cta={product.cta}
          buttons={product.buttons}
          footerCta={product.footerCta}
        />
      </article>
    </LeadModalProvider>
  );
}
