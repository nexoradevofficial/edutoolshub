import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildOptionLists } from "../../../utils/lessonPlanner/customOptions";
import { DEFAULT_STATE, generateId, loadState, saveState } from "../../../utils/lessonPlanner/storage";

const LessonPlannerContext = createContext(null);

export function LessonPlannerProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((updater) => {
    setState((prev) => (typeof updater === "function" ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const lessonPlans = useMemo(
    () => ({
      list: state.lessonPlans,
      save: (plan) =>
        update((s) => {
          const exists = s.lessonPlans.find((p) => p.id === plan.id);
          const plans = exists
            ? s.lessonPlans.map((p) => (p.id === plan.id ? { ...plan, updatedAt: new Date().toISOString() } : p))
            : [...s.lessonPlans, plan];
          return { ...s, lessonPlans: plans };
        }),
      remove: (id) =>
        update((s) => ({
          ...s,
          lessonPlans: s.lessonPlans.filter((p) => p.id !== id),
          calendarPlacements: s.calendarPlacements.filter((c) => c.lessonPlanId !== id),
        })),
      duplicate: (id) =>
        update((s) => {
          const original = s.lessonPlans.find((p) => p.id === id);
          if (!original) return s;
          const copy = {
            ...original,
            id: generateId(),
            title: `${original.title} (Copy)`,
            sections: original.sections.map((sec) => ({ ...sec, id: generateId() })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { ...s, lessonPlans: [...s.lessonPlans, copy] };
        }),
      getById: (id) => state.lessonPlans.find((p) => p.id === id),
    }),
    [state.lessonPlans, update]
  );

  const units = useMemo(
    () => ({
      list: state.units,
      save: (unit) =>
        update((s) => {
          const exists = s.units.find((u) => u.id === unit.id);
          const list = exists ? s.units.map((u) => (u.id === unit.id ? unit : u)) : [...s.units, unit];
          return { ...s, units: list };
        }),
      remove: (id) =>
        update((s) => ({
          ...s,
          units: s.units.filter((u) => u.id !== id),
          lessonPlans: s.lessonPlans.map((p) => (p.unitId === id ? { ...p, unitId: null } : p)),
        })),
      getById: (id) => state.units.find((u) => u.id === id),
    }),
    [state.units, update]
  );

  const calendar = useMemo(
    () => ({
      placements: state.calendarPlacements,
      addPlacement: (placement) =>
        update((s) => ({
          ...s,
          calendarPlacements: [
            ...s.calendarPlacements,
            { ...placement, id: placement.id ?? generateId() },
          ],
        })),
      updatePlacement: (id, patch) =>
        update((s) => ({
          ...s,
          calendarPlacements: s.calendarPlacements.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),
      removePlacement: (id) =>
        update((s) => ({
          ...s,
          calendarPlacements: s.calendarPlacements.filter((p) => p.id !== id),
        })),
      movePlacement: (id, newDate) =>
        update((s) => ({
          ...s,
          calendarPlacements: s.calendarPlacements.map((p) =>
            p.id === id ? { ...p, date: newDate } : p
          ),
        })),
    }),
    [state.calendarPlacements, update]
  );

  const curriculum = useMemo(
    () => ({
      data: state.curriculum,
      update: (patch) =>
        update((s) => ({
          ...s,
          curriculum: { ...s.curriculum, ...patch },
        })),
      addTerm: (term) =>
        update((s) => ({
          ...s,
          curriculum: {
            ...s.curriculum,
            terms: [...s.curriculum.terms, { ...term, id: term.id ?? generateId() }],
          },
        })),
      removeTerm: (id) =>
        update((s) => ({
          ...s,
          curriculum: {
            ...s.curriculum,
            terms: s.curriculum.terms.filter((t) => t.id !== id),
          },
        })),
      addTopic: (topic) =>
        update((s) => ({
          ...s,
          curriculum: {
            ...s.curriculum,
            topics: [...s.curriculum.topics, { ...topic, id: topic.id ?? generateId() }],
          },
        })),
      updateTopic: (id, patch) =>
        update((s) => ({
          ...s,
          curriculum: {
            ...s.curriculum,
            topics: s.curriculum.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          },
        })),
      removeTopic: (id) =>
        update((s) => ({
          ...s,
          curriculum: {
            ...s.curriculum,
            topics: s.curriculum.topics.filter((t) => t.id !== id),
          },
        })),
    }),
    [state.curriculum, update]
  );

  const substitute = useMemo(
    () => ({
      list: state.substitutePlans,
      save: (plan) =>
        update((s) => {
          const exists = s.substitutePlans.find((p) => p.id === plan.id);
          const list = exists
            ? s.substitutePlans.map((p) => (p.id === plan.id ? plan : p))
            : [...s.substitutePlans, plan];
          return { ...s, substitutePlans: list };
        }),
      remove: (id) =>
        update((s) => ({
          ...s,
          substitutePlans: s.substitutePlans.filter((p) => p.id !== id),
        })),
      getById: (id) => state.substitutePlans.find((p) => p.id === id),
    }),
    [state.substitutePlans, update]
  );

  const settings = useMemo(
    () => ({
      ...state.settings,
      update: (patch) =>
        update((s) => ({
          ...s,
          settings: { ...s.settings, ...patch },
        })),
    }),
    [state.settings, update]
  );

  const customOptions = useMemo(() => {
    const lists = buildOptionLists(state);

    function addCustomItem(storageKey, value, mergedList) {
      const normalized = typeof value === "number" ? value : String(value).trim();
      if (normalized === "" || (typeof normalized === "number" && normalized <= 0)) return;
      if (mergedList.some((item) => String(item) === String(normalized))) return;

      update((s) => ({
        ...s,
        settings: {
          ...s.settings,
          [storageKey]: [...(s.settings[storageKey] ?? []), normalized],
        },
      }));
    }

    return {
      subjects: lists.subjects,
      grades: lists.grades,
      durations: lists.durations,
      addSubject: (value) => addCustomItem("customSubjects", value, lists.subjects),
      addGrade: (value) => addCustomItem("customGrades", value, lists.grades),
      addDuration: (value) => addCustomItem("customDurations", Number(value), lists.durations),
    };
  }, [state, update]);

  const value = useMemo(
    () => ({ lessonPlans, units, calendar, curriculum, substitute, settings, customOptions }),
    [lessonPlans, units, calendar, curriculum, substitute, settings, customOptions]
  );

  return (
    <LessonPlannerContext.Provider value={value}>{children}</LessonPlannerContext.Provider>
  );
}

export function useLessonPlanner() {
  const ctx = useContext(LessonPlannerContext);
  if (!ctx) throw new Error("useLessonPlanner must be used within LessonPlannerProvider");
  return ctx;
}
