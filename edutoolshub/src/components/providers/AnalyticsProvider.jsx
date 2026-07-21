"use client";

import { useEffect } from "react";
import { scheduleAnalytics } from "@/utils/analytics";

export default function AnalyticsProvider({ children }) {
  useEffect(() => {
    return scheduleAnalytics();
  }, []);

  return children;
}
