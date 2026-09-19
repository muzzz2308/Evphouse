import { useCallback, useEffect, useState } from "react";
import { fallbackProductRanges } from "../data/fallback";
import { loadRemoteList, peekCache } from "../lib/dataCache";

const RANGES_KEY = "product_ranges";
const RANGES_SELECT = "id,name,image_url,sort_order";

function loadRanges(force = false) {
  return loadRemoteList({
    key: RANGES_KEY,
    table: "product_ranges",
    fallback: fallbackProductRanges,
    select: RANGES_SELECT,
    force,
  });
}

export function prefetchProductRanges() {
  return loadRanges(false);
}

export function useProductRanges({ blocking = false } = {}) {
  const cached = peekCache(RANGES_KEY);
  const [ranges, setRanges] = useState(
    () => cached?.data ?? (blocking ? [] : fallbackProductRanges),
  );
  const [loading, setLoading] = useState(() => blocking && !cached);
  const [error, setError] = useState(cached?.error ?? null);
  const [usingFallback, setUsingFallback] = useState(
    cached?.usingFallback ?? !cached,
  );

  const refresh = useCallback(
    async (force = true) => {
      if (force || (blocking && !peekCache(RANGES_KEY))) setLoading(true);
      setError(null);

      const result = await loadRanges(force);
      setRanges(result.data);
      setUsingFallback(result.usingFallback);
      setError(result.error);
      setLoading(false);
      return result;
    },
    [blocking],
  );

  useEffect(() => {
    refresh(false);
  }, [refresh]);

  return { ranges, loading, error, usingFallback, refresh: () => refresh(true) };
}
