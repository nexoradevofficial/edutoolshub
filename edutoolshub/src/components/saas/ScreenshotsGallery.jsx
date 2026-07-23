"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function ScreenshotsGallery({ screenshots }) {
  return (
    <section id="gallery" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Screenshots gallery"
          title="A closer look at the experience"
          subtitle="Real product screens from the School & College Management System."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {screenshots.map((shot, i) => (
            <motion.figure
              key={shot.id}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-saas-mist shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={`relative bg-slate-200 ${
                  shot.id === "mobile" ? "aspect-[9/16] max-h-80 mx-auto w-full max-w-[14rem]" : "aspect-[16/10]"
                }`}
              >
                {shot.image ? (
                  <Image
                    src={shot.image}
                    alt={shot.title}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>
              <figcaption className="p-5">
                <p className="font-semibold text-saas-ink">{shot.title}</p>
                <p className="mt-1 text-sm text-slate-500">{shot.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
