import Link from "next/link";

const guides = [
  {
    title: "How GPA actually works (and why credit hours matter)",
    body: [
      "GPA is a weighted average of your course grades, not a simple mean of letter grades. Each course contributes grade points multiplied by credit hours, then the total is divided by credits attempted. That is why a low grade in a 4-credit lab hurts more than the same letter in a 1-credit seminar.",
      "Most U.S. colleges use a 4.0 scale (A = 4.0). Other regions use 5.0, 7.0, or 10.0 scales, and some schools add weight for honors or AP courses. When you compare GPAs across countries or institutions, always confirm the scale first — a 3.5 on a 4.0 scale is not the same as 3.5 on a 5.0 scale.",
      "Use our free GPA calculator to model semester and cumulative GPA with your school’s scale, then convert results with the GPA ↔ percentage tools when an application form asks for a different format.",
    ],
    links: [
      { href: "/tools/gpa-calculator", label: "GPA / CGPA Calculator" },
      { href: "/tools/gpa-to-percentage", label: "GPA to Percentage" },
      { href: "/tools/percentage-to-gpa", label: "Percentage to GPA" },
    ],
  },
  {
    title: "Planning toward a target grade on your final exam",
    body: [
      "Finals often carry 20–40% of a course grade. Before exam week, calculate the minimum score you need on the final to land the letter grade you want. That number turns vague stress into a concrete study target.",
      "Start from your current weighted average and the final’s weight. If you need an 88% overall and the final is worth 30%, you can solve for the required final score instead of guessing. Our Final Grade Calculator does that math for you in seconds.",
      "Pair the result with a realistic study plan: list subjects by difficulty, allocate daily hours until the exam, and adjust when one topic needs more time. The Study Time Calculator helps turn remaining days into a daily schedule.",
    ],
    links: [
      { href: "/tools/final-grade-calculator", label: "Final Grade Calculator" },
      { href: "/tools/study-time-calculator", label: "Study Time Calculator" },
    ],
  },
  {
    title: "Teacher workflows that save hours every week",
    body: [
      "Teachers spend disproportionate time on attendance grids, report comments, rubrics, and certificates — work that is necessary but rarely creative. Digitizing those routines frees time for lesson design and student feedback.",
      "Build a printable attendance sheet with holidays and custom columns, draft report-card comments from performance levels you can edit, and print clear rubrics so students know how work will be scored. Certificates and behavior charts reinforce recognition without starting from a blank design file.",
      "Every teacher tool on EduToolsHub runs in the browser with no account. Class lists and grades stay on your device unless you choose to print or export them yourself.",
    ],
    links: [
      { href: "/tools/attendance-sheet", label: "Attendance Sheet Generator" },
      { href: "/tools/report-card-comment-generator", label: "Report Card Comments" },
      { href: "/tools/rubric-generator", label: "Rubric Generator" },
      { href: "/tools/lesson-planner", label: "Lesson Planner" },
    ],
  },
  {
    title: "Citing sources correctly (APA 7 and MLA 9)",
    body: [
      "Proper citation protects academic integrity and helps readers find your sources. APA 7 is common in social sciences; MLA 9 is common in humanities. Both require accurate author names, titles, dates, and container details — missing one field can make a citation incomplete.",
      "Generate a draft citation for a website, book, or journal article, then verify it against your institution’s style guide before submitting. Our Citation Generator produces copy-ready bibliography entries and in-text forms so you can focus on writing, not formatting punctuation.",
    ],
    links: [{ href: "/tools/citation-generator", label: "Citation Generator" }],
  },
];

export default function HomeEducationalContent() {
  return (
    <section className="border-t border-border bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Learning guides
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Practical education guides built around real tools
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
          EduToolsHub is more than a directory of calculators. Below are original, practical
          guides that explain how students and teachers actually use grading, planning, and
          classroom workflows — with free tools you can open immediately, no signup required.
        </p>

        <div className="mt-10 space-y-12">
          {guides.map((guide) => (
            <article key={guide.title}>
              <h3 className="text-xl font-semibold tracking-tight text-text">{guide.title}</h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-muted sm:text-base">
                {guide.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {guide.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-surface-muted/60 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-text">
            Free education tools and school software in one place
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
            Students and teachers can use free GPA calculators, final-grade planners, citation
            helpers, attendance sheets, lesson planners, rubrics, and more — instantly in the
            browser. Institutes that need full automation can explore our{" "}
            <Link
              href="/saas/school-college-management-system"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              School &amp; College Management System
            </Link>
            , a cloud SaaS for admissions, fees, attendance, messaging, and exams. Browse the{" "}
            <Link href="/tools" className="font-medium text-primary underline-offset-2 hover:underline">
              full tools library
            </Link>{" "}
            or read deeper how-tos on the{" "}
            <Link href="/blog" className="font-medium text-primary underline-offset-2 hover:underline">
              EduToolsHub blog
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
