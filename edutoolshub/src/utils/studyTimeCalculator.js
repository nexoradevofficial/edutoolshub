export function calculateStudyPlan({ subjects, daysUntilExam, hoursPerDay }) {
  const parsedSubjects = subjects
    .map((s) => ({
      name: String(s.name ?? "").trim(),
      hours: Number(s.hours),
    }))
    .filter((s) => s.name && Number.isFinite(s.hours) && s.hours > 0);

  const days = Number(daysUntilExam);
  const daily = Number(hoursPerDay);

  const errors = {};
  if (!Number.isFinite(days) || days < 1) errors.days = "Enter at least 1 day until the exam.";
  if (!Number.isFinite(daily) || daily <= 0) errors.hoursPerDay = "Enter valid study hours per day.";
  if (parsedSubjects.length === 0) errors.subjects = "Add at least one subject with study hours.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const totalHoursNeeded = parsedSubjects.reduce((sum, s) => sum + s.hours, 0);
  const totalAvailable = days * daily;
  const deficit = totalHoursNeeded - totalAvailable;
  const recommendedDaily = Math.ceil((totalHoursNeeded / days) * 10) / 10;

  const schedule = parsedSubjects.map((subject) => {
    const share = subject.hours / totalHoursNeeded;
    const minutesPerDay = Math.round(share * daily * 60);
    const daysNeeded = Math.ceil(subject.hours / (share * daily || 1));
    return {
      ...subject,
      sharePercent: Math.round(share * 100),
      minutesPerDay,
      daysNeeded: Math.min(daysNeeded, days),
    };
  });

  return {
    ok: true,
    totalHoursNeeded: Math.round(totalHoursNeeded * 10) / 10,
    totalAvailable: Math.round(totalAvailable * 10) / 10,
    recommendedDaily,
    deficit: Math.round(deficit * 10) / 10,
    isFeasible: deficit <= 0,
    schedule,
  };
}
