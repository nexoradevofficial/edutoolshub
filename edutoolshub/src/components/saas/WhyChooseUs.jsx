"use client";

import SectionHeading from "./SectionHeading";
import AnimatedCard from "./AnimatedCard";
import { SaasIcon } from "./icons";

export default function WhyChooseUs({ items }) {
  return (
    <section className="bg-saas-mist py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why choose us"
          title="Built like a product company, priced for institutes"
          subtitle="Premium experience without enterprise theater."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <AnimatedCard key={item.id} delay={i * 0.04} className="group h-full">
              <article className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-teal-100 hover:shadow-xl hover:shadow-teal-500/10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 text-saas-teal ring-1 ring-teal-100">
                  <SaasIcon name={item.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold text-saas-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </article>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
