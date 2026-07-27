import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { fallbackProductRanges } from "../data/fallback";

export function useProductRanges() {
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setRanges(fallbackProductRanges);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("product_ranges")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setRanges(fallbackProductRanges);
      setUsingFallback(true);
    } else {
      setRanges(data ?? []);
      setUsingFallback(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ranges, loading, error, usingFallback, refresh };
}
