"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../ui/Button";
import UniversityCard from "./UniversityCard";
import {
  getDetailVerdict,
  matchBadgeClasses,
} from "../../../services/universities/matchLogic";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function StatBox({ label, value, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-white"
      }`}
    >
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p
        className={`mt-2 text-2xl font-bold sm:text-3xl ${
          highlight ? "text-primary" : "text-text"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function UniversityDetailContent({ university, similar = [] }) {
  const [studentGpa, setStudentGpa] = useState("");
  const verdict = getDetailVerdict(
    studentGpa !== "" ? Number(studentGpa) : null,
    Number(university.min_gpa),
    Number(university.avg_gpa)
  );

  return (
    <div className="space-y-8">
      <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-dark">
        Updated 2026
      </span>

      <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href="/tools/college-university-gpa-requirement-checker"
              className="hover:text-primary"
            >
              GPA Checker
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-text">{university.name}</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          {university.name} GPA Requirements 2026
        </h1>
        <p className="mt-2 text-sm text-text-muted sm:text-base">
          {university.city}
          {university.state_province ? `, ${university.state_province}` : ""}, {university.country} ·{" "}
          {university.type} · QS World Ranking{" "}
          {university.qs_ranking ? `#${university.qs_ranking}` : "N/A"}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox
          label="Minimum GPA Required"
          value={Number(university.min_gpa).toFixed(2)}
          highlight
        />
        <StatBox
          label="Average Admitted GPA"
          value={Number(university.avg_gpa).toFixed(2)}
        />
        <StatBox
          label="Acceptance Rate"
          value={
            university.acceptance_rate != null
              ? `${Number(university.acceptance_rate).toFixed(1)}%`
              : "N/A"
          }
        />
        <StatBox
          label="QS World Ranking"
          value={university.qs_ranking ? `#${university.qs_ranking}` : "N/A"}
        />
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-text">Compare Your GPA</h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter your GPA on a {Number(university.gpa_scale).toFixed(1)} scale to see how you compare.
        </p>
        <div className="mt-4 max-w-xs">
          <label htmlFor="detail-gpa" className="mb-1 block text-sm font-medium text-text">
            Your GPA
          </label>
          <input
            id="detail-gpa"
            type="number"
            min="0"
            max={university.gpa_scale}
            step="0.01"
            value={studentGpa}
            onChange={(e) => setStudentGpa(e.target.value)}
            placeholder="e.g. 3.70"
            className={inputClass}
          />
        </div>
        {verdict.label && (
          <div
            className={`mt-4 rounded-xl border p-4 ${matchBadgeClasses(verdict.label)}`}
          >
            <p className="font-semibold">{verdict.label}</p>
            <p className="mt-1 text-sm">{verdict.explanation}</p>
          </div>
        )}
      </section>

      {(university.sat_range || university.act_range) && (
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-text">Test Score Ranges</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {university.sat_range && (
              <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                <p className="text-sm font-medium text-text-muted">SAT (middle 50%)</p>
                <p className="mt-1 text-lg font-semibold text-text">{university.sat_range}</p>
              </div>
            )}
            {university.act_range && (
              <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                <p className="text-sm font-medium text-text-muted">ACT (middle 50%)</p>
                <p className="mt-1 text-lg font-semibold text-text">{university.act_range}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {university.popular_programs?.length > 0 && (
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-text">Popular Programs</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {university.popular_programs.map((program) => (
              <li
                key={program}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {program}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(university.admission_policy || university.admission_notes) && (
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-text">Admissions Notes</h2>
          {university.admission_policy && (
            <p className="mt-3 text-sm leading-relaxed text-text">{university.admission_policy}</p>
          )}
          {university.admission_notes && (
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {university.admission_notes}
            </p>
          )}
        </section>
      )}

      <div>
        <Button href={university.website_url} target="_blank" rel="noopener noreferrer">
          Visit Official Admissions Page
        </Button>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text">Similar Universities</h2>
          <p className="mt-1 text-sm text-text-muted">
            Explore alternatives with comparable GPA requirements in {university.country}.
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {similar.map((u) => (
              <UniversityCard key={u.slug} university={u} />
            ))}
          </div>
        </section>
      )}

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm">
        <Link
          href="/tools/college-university-gpa-requirement-checker"
          className="font-medium text-primary hover:underline"
        >
          ← Back to College / University GPA Requirement Checker
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8 print:hidden">
        <h2 className="text-lg font-semibold text-text">How to use this GPA snapshot</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-muted">
          <p>
            This page summarizes published GPA-related admissions indicators for{" "}
            {university.name} on a {Number(university.gpa_scale).toFixed(1)} scale.
            Minimum GPA is a floor many applicants should clear; average admitted GPA
            reflects the middle of a competitive pool and is usually higher.
          </p>
          <p>
            GPA is only one part of holistic review. Test scores (where used), essays,
            recommendations, coursework rigor, and program capacity also matter. Always
            confirm requirements on the school’s official admissions site before applying —
            published averages change by year and campus.
          </p>
          <p>
            Compare your standing here, then model semester or cumulative GPA with our{" "}
            <Link href="/tools/gpa-calculator" className="font-medium text-primary hover:underline">
              GPA calculator
            </Link>{" "}
            and browse more schools in the{" "}
            <Link
              href="/tools/college-university-gpa-requirement-checker"
              className="font-medium text-primary hover:underline"
            >
              full GPA requirement checker
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}