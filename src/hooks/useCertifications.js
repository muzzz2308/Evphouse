import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { fallbackCertifications } from "../data/fallback";

export function useCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setCertifications(fallbackCertifications);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setCertifications(fallbackCertifications);
      setUsingFallback(true);
    } else {
      setCertifications(data ?? []);
      setUsingFallback(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { certifications, loading, error, usingFallback, refresh };
}
