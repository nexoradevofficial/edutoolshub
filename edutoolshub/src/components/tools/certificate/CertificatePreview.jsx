import { motion, useReducedMotion } from "framer-motion";

const THEMES = {
  classic: {
    label: "Classic blue",
    border: "border-primary",
    innerBorder: "border-primary/30",
    gradient: "from-primary/25 via-white to-sky-100/80",
    shapeA: "bg-primary/20",
    shapeB: "bg-sky-300/25",
    shapeC: "bg-accent/15",
    accent: "text-primary",
    icon: "text-primary",
    ribbon: "from-primary to-blue-700",
    seal: "border-primary bg-primary/10 text-primary",
  },
  gold: {
    label: "Gold achievement",
    border: "border-amber-400",
    innerBorder: "border-amber-300/50",
    gradient: "from-amber-100 via-white to-yellow-50",
    shapeA: "bg-amber-300/30",
    shapeB: "bg-yellow-200/40",
    shapeC: "bg-orange-200/25",
    accent: "text-amber-700",
    icon: "text-amber-500",
    ribbon: "from-amber-400 to-amber-600",
    seal: "border-amber-500 bg-amber-50 text-amber-700",
  },
  green: {
    label: "Academic green",
    border: "border-accent",
    innerBorder: "border-accent/30",
    gradient: "from-accent/20 via-white to-emerald-50",
    shapeA: "bg-accent/20",
    shapeB: "bg-emerald-200/30",
    shapeC: "bg-teal-200/20",
    accent: "text-accent-dark",
    icon: "text-accent",
    ribbon: "from-accent to-emerald-600",
    seal: "border-accent bg-accent/10 text-accent-dark",
  },
};

function IconTrophy({ className = "h-10 w-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 3h12v2a4 4 0 0 1-4 4h-.5v2H14a1 1 0 0 1 1 1v1H9v-1a1 1 0 0 1 1-1h1.5V9H11a4 4 0 0 1-4-4V3zm2 2v.5A2 2 0 0 0 10 7.5h4A2 2 0 0 0 16 5.5V5H8zm1 14h6l1 3H8l1-3z" />
    </svg>
  );
}

function IconMedal({ className = "h-9 w-9" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.2 4.5 4.9.7-3.55 3.5.85 4.95L12 13.9l-4.4 2.25.85-4.95L4.9 7.2l4.9-.7L12 2zm0 4.2L11 7.8 9.2 8.1l1.3 1.25-.3 1.85L12 10.4l1.8.8-.3-1.85 1.3-1.25-1.8-.3L12 6.2z" />
      <circle cx="12" cy="14.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconStar({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.9H22l-5.8 4.3 2.2 6.8L12 16.8 5.6 20l2.2-6.8L2 8.9h7.1L12 2z" />
    </svg>
  );
}

function IconLaurel({ className = "h-14 w-14" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" aria-hidden>
      <path
        opacity="0.85"
        d="M32 8c-6 8-14 10-20 8 2 6 6 12 14 14-2 4-2 8 0 12 8-2 14-8 18-16 4 8 10 14 18 16 2-4 2-8 0-12 8-2 12-8 14-14-6 2-14 0-20-8-4 6-10 10-16 10s-12-4-16-10z"
      />
    </svg>
  );
}

function BackgroundShapes({ theme, reducedMotion }) {
  const shapes = [
    { className: `left-[-8%] top-[-10%] h-48 w-48 rounded-full ${theme.shapeA}`, delay: 0 },
    { className: `right-[-6%] top-[8%] h-36 w-36 rotate-12 rounded-3xl ${theme.shapeB}`, delay: 0.1 },
    { className: `bottom-[-12%] left-[12%] h-52 w-52 rounded-full ${theme.shapeC}`, delay: 0.15 },
    { className: `bottom-[10%] right-[8%] h-28 w-28 rotate-45 rounded-2xl ${theme.shapeA}`, delay: 0.2 },
    { className: `left-[40%] top-[55%] h-20 w-20 rounded-full ${theme.shapeB}`, delay: 0.25 },
  ];

  return (
    <div className="certificate-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {shapes.map((shape, index) =>
        reducedMotion ? (
          <div key={index} className={`certificate-shape absolute ${shape.className}`} />
        ) : (
          <motion.div
            key={index}
            className={`certificate-shape absolute ${shape.className}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: shape.delay, ease: "easeOut" }}
          />
        )
      )}
      <div className={`certificate-shape absolute left-0 top-0 h-24 w-24 -translate-x-1/3 -translate-y-1/3 rotate-45 ${theme.shapeC}`} />
      <div className={`certificate-shape absolute bottom-0 right-0 h-24 w-24 translate-x-1/3 translate-y-1/3 rotate-12 ${theme.shapeC}`} />
    </div>
  );
}

function WinningIcons({ theme, reducedMotion }) {
  const iconWrap = (children, delay = 0) =>
    reducedMotion ? (
      <div className="certificate-icon">{children}</div>
    ) : (
      <motion.div
        className="certificate-icon"
        initial={{ opacity: 0, y: 12, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay, type: "spring", stiffness: 260, damping: 18 }}
      >
        {children}
      </motion.div>
    );

  return (
    <div className="relative z-10 mb-2 flex items-center justify-center gap-3 sm:gap-5">
      {iconWrap(
        <div className={`flex items-center gap-1 ${theme.icon}`}>
          <IconStar className="h-5 w-5 sm:h-6 sm:w-6" />
          <IconMedal className="h-8 w-8 sm:h-9 sm:w-9" />
        </div>,
        0.2
      )}
      {iconWrap(
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white/70 shadow-md sm:h-[4.5rem] sm:w-[4.5rem] ${theme.seal}`}
        >
          <IconTrophy className="h-9 w-9 sm:h-10 sm:w-10" />
        </div>,
        0.35
      )}
      {iconWrap(
        <div className={`flex items-center gap-1 ${theme.icon}`}>
          <IconMedal className="h-8 w-8 sm:h-9 sm:w-9" />
          <IconStar className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>,
        0.2
      )}
    </div>
  );
}

export function CertificatePreview({
  studentName,
  achievement,
  presentedBy,
  schoolName,
  date,
  themeKey = "classic",
}) {
  const theme = THEMES[themeKey] ?? THEMES.classic;
  const reducedMotion = useReducedMotion();

  const formattedDate = date
    ? new Date(date + "T12:00:00").toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date";

  const ContentWrapper = reducedMotion ? "div" : motion.div;
  const contentProps = reducedMotion
    ? { className: "relative z-10 flex flex-col items-center px-4 py-2 sm:px-8" }
    : {
        className: "relative z-10 flex flex-col items-center px-4 py-2 sm:px-8",
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, delay: 0.15, ease: "easeOut" },
      };

  return (
    <div
      id="certificate-print"
      className={`certificate relative mx-auto min-h-[440px] w-full max-w-4xl overflow-hidden rounded-2xl border-[5px] p-3 shadow-lg sm:min-h-[480px] sm:p-4 print:min-h-0 print:rounded-none print:shadow-none ${theme.border}`}
    >
      <div
        className={`certificate-inner relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 bg-gradient-to-br px-6 py-10 text-center sm:min-h-[440px] sm:px-10 sm:py-12 print:min-h-0 ${theme.innerBorder} ${theme.gradient}`}
      >
        <BackgroundShapes theme={theme} reducedMotion={reducedMotion} />

        <IconLaurel
          className={`certificate-shape pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 opacity-20 sm:block ${theme.icon}`}
        />
        <IconLaurel
          className={`certificate-shape pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 scale-x-[-1] opacity-20 sm:block ${theme.icon}`}
        />

        <ContentWrapper {...contentProps}>
          <div
            className={`mb-4 inline-block rounded-full bg-gradient-to-r px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-white shadow-sm sm:text-xs ${theme.ribbon}`}
          >
            Winner
          </div>

          <WinningIcons theme={theme} reducedMotion={reducedMotion} />

          {schoolName ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted sm:text-sm">
              {schoolName}
            </p>
          ) : null}

          <p className={`mt-2 text-xs font-bold uppercase tracking-[0.35em] sm:text-sm ${theme.accent}`}>
            Certificate of Achievement
          </p>

          <p className="mt-5 text-sm text-text-muted sm:text-base">
            This certificate is proudly presented to
          </p>

          <h2 className="certificate-name mt-3 font-serif text-3xl font-bold text-text sm:text-5xl print:text-black">
            {studentName || "Student Name"}
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
            <IconStar className="h-4 w-4" />
            <IconStar className="h-5 w-5" />
            <IconStar className="h-4 w-4" />
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-lg">
            For {achievement || "outstanding effort and achievement"}
          </p>

          <div className="mt-10 flex w-full max-w-xl items-end justify-between gap-6 text-xs text-text-muted sm:text-sm">
            <div className="flex-1 border-t border-text/20 pt-2">
              {presentedBy || "Teacher / Principal"}
            </div>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold uppercase leading-tight ${theme.seal}`}
            >
              Official Seal
            </div>
            <div className="flex-1 border-t border-text/20 pt-2">{formattedDate}</div>
          </div>
        </ContentWrapper>
      </div>
    </div>
  );
}

export const CERTIFICATE_THEMES = Object.entries(THEMES).map(([value, t]) => ({
  value,
  label: t.label,
}));

export { THEMES };
