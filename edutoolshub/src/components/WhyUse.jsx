import { IconGift, IconShield, IconUser, IconZap } from "./icons/ToolIcons";

const benefits = [
  {
    icon: IconGift,
    title: "Free to use",
    description: "Every tool is 100% free with no hidden fees or subscriptions.",
  },
  {
    icon: IconUser,
    title: "No login required",
    description: "Open a tool and start immediately. Your data stays in your browser.",
  },
  {
    icon: IconShield,
    title: "Built for teachers & students",
    description: "Designed for classrooms anywhere in the world.",
  },
  {
    icon: IconZap,
    title: "Fast and mobile friendly",
    description: "Works on phones, tablets, and desktops with instant results.",
  },
];

export default function WhyUse() {
  return (
    <section id="about" className="bg-surface-muted py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Why EduToolsHub</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Why use EduToolsHub?
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Simple, trustworthy tools built for modern education — no complexity, no signup.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
