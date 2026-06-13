import { useState } from "react";

const SECTIONS = [
  {
    id: "overview",
    title: "How this tool works",
    content: (
      <>
        <p>
          The Lesson Planner is a complete planning workspace for international teachers. Everything
          runs in your browser — create lesson plans, schedule them on a calendar, map your
          curriculum across the year, and prepare substitute teacher handouts without signing up or
          connecting to a server.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            <strong>Start with Lesson Plans</strong> — build or duplicate plans from templates, with
            drag-and-drop sections you can customise.
          </li>
          <li>
            <strong>Organise with Units</strong> — group related lessons into units and drag them
            onto a weekly, monthly, or term calendar.
          </li>
          <li>
            <strong>Map the Curriculum</strong> — align topics week-by-week to IB, Cambridge, or
            CBSE standards and track what has been taught.
          </li>
          <li>
            <strong>Prepare Substitute Plans</strong> — attach your lesson plans, add schedules,
            behaviour notes, and emergency fallback activities for print-ready handouts.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "linked",
    title: "How the modules are linked",
    content: (
      <>
        <p>All four modules share the same data. Changes in one place appear everywhere else:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Lesson Plans → Units:</strong> When editing a plan, you can link it to a unit
            using the &quot;Link to Unit&quot; field. Linked plans appear in that unit&apos;s
            progress and can be filtered on the calendar.
          </li>
          <li>
            <strong>Lesson Plans → Calendar:</strong> Any saved plan can be dragged from the lesson
            pool onto a calendar day. Click a placed lesson to mark it as taught.
          </li>
          <li>
            <strong>Lesson Plans → Substitute:</strong> In the Substitute module, tick existing
            lesson plans to attach their full content to a print-ready substitute handout.
          </li>
          <li>
            <strong>Curriculum → Lesson Plans:</strong> The curriculum mapper tracks topics and
            standards separately, but you can align your weekly topics with the lessons you teach.
            Use both together to see big-picture coverage and day-to-day detail.
          </li>
        </ul>
        <p className="mt-3 rounded-xl bg-primary/5 px-4 py-3 text-sm text-text">
          <strong>Tip:</strong> Build lesson plans first, then create units, drag plans onto the
          calendar, map curriculum topics for the term, and keep a substitute plan ready for
          unexpected absences.
        </p>
      </>
    ),
  },
  {
    id: "lesson-plans",
    title: "Lesson Plans module",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Pick a template by subject, grade, and duration, or start from a blank plan.</li>
        <li>
          Drag sections (Objectives, Activities, Resources, Assessment) to reorder them. Add custom
          sections for anything else you need.
        </li>
        <li>
          Add your own <strong>custom subjects, grades, and durations</strong> using the
          &quot;+ Add custom&quot; link below each dropdown — they are saved for future plans.
        </li>
        <li>Duplicate any plan to reuse structure for a new class or week.</li>
        <li>Print from the browser or export a PDF copy of any plan.</li>
      </ul>
    ),
  },
  {
    id: "units",
    title: "Unit Planner module",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Create units with a name, subject, grade, class, date range, and colour.</li>
        <li>
          Switch between <strong>weekly</strong>, <strong>monthly</strong>, and{" "}
          <strong>term</strong> calendar views.
        </li>
        <li>Drag unplaced lessons from the pool at the bottom onto any calendar day.</li>
        <li>Colour-code by subject or class using the sidebar setting.</li>
        <li>
          Click a lesson on the calendar to toggle between <em>planned</em> and <em>taught</em>.
          Progress bars show how much of each unit is complete.
        </li>
        <li>Focus on a single unit to see only its scheduled lessons.</li>
      </ul>
    ),
  },
  {
    id: "curriculum",
    title: "Curriculum module",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Set your school year start and end dates to generate teaching weeks automatically.</li>
        <li>Add terms (Term 1, Term 2, etc.) with their own date ranges.</li>
        <li>
          Map topics week by week and align each to <strong>IB</strong>,{" "}
          <strong>Cambridge</strong>, <strong>CBSE</strong>, or any <strong>custom framework</strong>{" "}
          you add (e.g. Common Core, Australian Curriculum).
        </li>
        <li>Type your own standard reference for any framework.</li>
        <li>Track each topic as pending, taught, or skipped using the coverage dashboard.</li>
        <li>Export your full curriculum map as a PDF or CSV spreadsheet.</li>
      </ul>
    ),
  },
  {
    id: "substitute",
    title: "Substitute module",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Fill in class info, room, period, and the regular teacher&apos;s name.</li>
        <li>Edit the daily schedule table or add extra time slots.</li>
        <li>Attach one or more saved lesson plans — their full sections print with the handout.</li>
        <li>
          Keep an <strong>emergency fallback</strong> section ready (e.g. silent reading, journal
          writing) if technology or materials fail.
        </li>
        <li>Add student behaviour notes and general instructions for the substitute.</li>
        <li>Save multiple substitute plans and print a clean, professional layout.</li>
      </ul>
    ),
  },
  {
    id: "no-database",
    title: "Why no database is needed",
    content: (
      <>
        <p>
          This tool stores everything in your browser&apos;s <strong>localStorage</strong> — a
          built-in storage area that keeps data on your device only. That means:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>No account or login</strong> — open the tool and start planning immediately.
          </li>
          <li>
            <strong>No internet required</strong> after the page loads — plans save and load offline
            on the same browser.
          </li>
          <li>
            <strong>Your data stays private</strong> — nothing is sent to a server, database, or
            third party. Lesson plans never leave your computer unless you export or print them.
          </li>
          <li>
            <strong>Instant saves</strong> — every change is written to localStorage automatically.
            There is no &quot;Save to cloud&quot; step.
          </li>
          <li>
            <strong>Works worldwide</strong> — no regional servers, API keys, or school IT setup
            required. Ideal for teachers in any country or curriculum system.
          </li>
        </ul>
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Important:</strong> Data is tied to this browser on this device. Clearing browser
          data or switching browsers will remove your plans. Use Print or PDF export to keep backups
          of important documents.
        </p>
      </>
    ),
  },
];

export default function LessonPlannerGuide() {
  const [expanded, setExpanded] = useState(true);
  const [openSection, setOpenSection] = useState("overview");

  return (
    <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 print:hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Getting started
          </p>
          <h2 className="mt-0.5 text-base font-bold text-text sm:text-lg">
            How the Lesson Planner works
          </h2>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            Guides for each module, how they connect, and why everything saves locally
          </p>
        </div>
        <span
          className={`shrink-0 text-xl text-primary transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="border-t border-primary/10 px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="flex flex-wrap gap-2 pt-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setOpenSection(section.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  openSection === section.id
                    ? "bg-primary text-white"
                    : "bg-surface text-text-muted hover:bg-surface/80 hover:text-text"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface/80 p-4 text-sm leading-relaxed text-text sm:p-5">
            {SECTIONS.find((s) => s.id === openSection)?.content}
          </div>
        </div>
      )}
    </div>
  );
}
