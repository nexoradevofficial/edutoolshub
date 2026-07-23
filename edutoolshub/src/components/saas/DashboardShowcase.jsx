"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function DashboardShowcase({ images = {} }) {
  const src = images.dashboard || images.hero;

  return (
    <section className="relative overflow-hidden bg-saas-ink py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(13,148,136,0.18),_transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Dashboard"
          title="One command center for your institute"
          subtitle="Monitor admissions, fees, attendance and academics from a calm, premium workspace."
        />

        <div className="relative mt-14">
          <motion.div
            className="mx-auto max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 p-2 shadow-2xl shadow-black/40 sm:p-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
              {src ? (
                <Image
                  src={src}
                  alt="Institute admin dashboard preview"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                />
              ) : null}
            </div>
          </motion.div>

          {[
            { t: "Scan Voucher", d: "QR fee verification", pos: "-left-2 top-10 sm:left-0" },
            { t: "WhatsApp QR", d: "Messaging via scan", pos: "-right-2 top-24 sm:right-0" },
            { t: "Subscription", d: "Active · cloud hosted", pos: "bottom-8 left-1/4" },
          ].map((card, i) => (
            <motion.div
              key={card.t}
              className={`saas-glass absolute hidden rounded-2xl border border-white/20 px-3.5 py-2.5 shadow-xl md:block ${card.pos}`}
              animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-[11px] font-semibold text-saas-ink">{card.t}</p>
              <p className="text-[10px] text-slate-500">{card.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
