"use client";

import { useEffect } from "react";

export default function PageViewTracker() {
  useEffect(() => {
    fetch("/api/analytics", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
