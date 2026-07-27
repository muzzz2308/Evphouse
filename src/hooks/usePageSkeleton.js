import { useEffect, useState } from "react";

/** Brief skeleton on static pages so layout feels consistent while painting. */
export function usePageSkeleton(delayMs = 400) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);

  return loading;
}
