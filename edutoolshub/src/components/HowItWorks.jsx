const steps = [
  {
    step: "01",
    title: "Select Tool",
    description:
      "Pick from our tools grid — GPA calculator, university GPA checker, attendance sheets, and more.",
  },
  {
    step: "02",
    title: "Enter Data",
    description:
      "Add your GPA, search universities, or fill in class details — all in your browser.",
  },
  {
    step: "03",
    title: "Get Results Instantly",
    description:
      "See your GPA, match scores for colleges, or print your attendance sheet right away.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Three simple steps
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-sm shadow-primary/30">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
