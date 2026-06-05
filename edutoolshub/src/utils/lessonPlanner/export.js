import { jsPDF } from "jspdf";
import { format, parseISO, eachWeekOfInterval, endOfWeek, startOfWeek } from "date-fns";

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLessonPlanPdf(plan) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(18);
  doc.text(plan.title, margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  const meta = [
    plan.subject && `Subject: ${plan.subject}`,
    plan.grade && `Grade: ${plan.grade}`,
    plan.duration && `Duration: ${plan.duration} min`,
    plan.className && `Class: ${plan.className}`,
    plan.date && `Date: ${plan.date}`,
  ]
    .filter(Boolean)
    .join("  |  ");
  doc.text(meta, margin, y);
  y += 12;
  doc.setTextColor(0);

  const sorted = [...plan.sections].sort((a, b) => a.order - b.order);
  for (const section of sorted) {
    if (y > 260) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(section.content || "(No content)", 170);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 8;
  }

  doc.save(`${plan.title.replace(/[^a-z0-9]/gi, "_")}_lesson_plan.pdf`);
}

export function exportCurriculumCsv(curriculum, topics) {
  const headers = [
    "Week",
    "Week Start",
    "Week End",
    "Topic",
    "Framework",
    "Standard",
    "Status",
    "Notes",
  ];
  const rows = topics.map((t) => {
    const weekStart = t.weekStart ? format(parseISO(t.weekStart), "yyyy-MM-dd") : "";
    const weekEnd = t.weekEnd ? format(parseISO(t.weekEnd), "yyyy-MM-dd") : "";
    return [
      t.weekNumber ?? "",
      weekStart,
      weekEnd,
      t.title ?? "",
      t.framework ?? "",
      t.standard ?? "",
      t.status ?? "pending",
      (t.notes ?? "").replace(/"/g, '""'),
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  downloadBlob(csv, "curriculum_map.csv", "text/csv;charset=utf-8;");
}

export function exportCurriculumPdf(curriculum, topics) {
  const doc = new jsPDF();
  const margin = 15;
  let y = margin;

  doc.setFontSize(16);
  doc.text("Curriculum Map", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(100);
  const yearLabel =
    curriculum.schoolYearStart && curriculum.schoolYearEnd
      ? `${curriculum.schoolYearStart} — ${curriculum.schoolYearEnd}`
      : "School Year";
  doc.text(yearLabel, margin, y);
  y += 12;
  doc.setTextColor(0);

  for (const topic of topics) {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const weekLabel = topic.weekNumber ? `Week ${topic.weekNumber}: ` : "";
    doc.text(`${weekLabel}${topic.title}`, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const details = [
      topic.framework && `Framework: ${topic.framework}`,
      topic.standard && `Standard: ${topic.standard}`,
      `Status: ${topic.status}`,
    ]
      .filter(Boolean)
      .join("  |  ");
    doc.text(details, margin, y);
    y += 5;
    if (topic.notes) {
      const lines = doc.splitTextToSize(topic.notes, 180);
      doc.text(lines, margin, y);
      y += lines.length * 4 + 4;
    }
    y += 4;
  }

  doc.save("curriculum_map.pdf");
}

export function getWeeksInRange(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
  return weeks.map((weekStart, i) => ({
    weekNumber: i + 1,
    weekStart: format(weekStart, "yyyy-MM-dd"),
    weekEnd: format(endOfWeek(weekStart, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  }));
}

export function getMonthDays(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(format(date, "yyyy-MM-dd"));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getWeekDays(dateStr) {
  const date = parseISO(dateStr);
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return format(d, "yyyy-MM-dd");
  });
}
