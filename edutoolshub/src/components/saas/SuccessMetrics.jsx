"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";

function Counter({ value, suffix = "", display }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || display) return;
    const isFloat = !Number.isInteger(value);
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = value * eased;
      setN(isFloat ? Number(current.toFixed(1)) : Math.round(current));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, display]);

  return (
    <span ref={ref}>
      {display || (
        <>
          {n}
          {suffix}
        </>
      )}
    </span>
  );
}

export default function SuccessMetrics({ metrics }) {
  return (
    <section className="bg-saas-mist py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer success metrics"
          title="Numbers that matter to institutes"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <p className="text-3xl font-bold tracking-tight text-saas-ink sm:text-4xl">
                <Counter value={m.value} suffix={m.suffix} display={m.display} />
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
