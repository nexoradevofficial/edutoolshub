"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "./SectionHeading";

function DeviceFrame({ label, className, children }) {
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="ml-2 text-[10px] font-medium text-slate-400">{label}</span>
        </div>
        <div className="bg-slate-100">{children}</div>
      </div>
    </div>
  );
}

function ScreenImage({ src, alt, aspect = "aspect-[16/10]" }) {
  if (!src) return <div className={`${aspect} bg-saas-mist`} />;
  return (
    <div className={`relative ${aspect}`}>
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 768px) 90vw, 700px" />
    </div>
  );
}

export default function ProductScreens({ images = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yLaptop = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yTablet = useTransform(scrollYProgress, [0, 1], [80, -20]);
  const yMobile = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="relative bg-saas-mist py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Product screens"
          title="Built for every screen your staff uses"
          subtitle="Desktop admin console, tablet workflows and mobile access — one system, everywhere."
        />

        <div className="relative mt-16 min-h-[22rem] sm:min-h-[30rem]">
          <motion.div style={{ y: yLaptop }} className="relative z-20 mx-auto max-w-3xl">
            <DeviceFrame label="Laptop · Admin console">
              <ScreenImage
                src={images.laptop || images.dashboard}
                alt="Laptop admin console dashboard"
              />
            </DeviceFrame>
          </motion.div>
          <motion.div
            style={{ y: yTablet }}
            className="absolute bottom-0 left-0 z-10 hidden w-[44%] max-w-sm md:block"
          >
            <DeviceFrame label="Tablet · Dashboard">
              <ScreenImage
                src={images.tablet || images.dashboard}
                alt="Tablet dashboard view"
                aspect="aspect-[4/3]"
              />
            </DeviceFrame>
          </motion.div>
          <motion.div
            style={{ y: yMobile }}
            className="absolute bottom-2 right-0 z-30 hidden w-[26%] max-w-[10.5rem] md:block"
          >
            <DeviceFrame label="Mobile">
              <ScreenImage
                src={images.mobile}
                alt="Mobile dashboard"
                aspect="aspect-[9/16]"
              />
            </DeviceFrame>
          </motion.div>
        </div>

        {images.login && (
          <motion.div
            className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-saas-ink">
              Secure login portal
            </div>
            <div className="relative aspect-[16/9]">
              <Image
                src={images.login}
                alt="School management system login page"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
