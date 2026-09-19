import { useCallback, useEffect, useState } from "react";
import { fallbackCertifications } from "../data/fallback";
import { loadRemoteList, peekCache } from "../lib/dataCache";

const CERTS_KEY = "certifications";
const CERTS_SELECT = "id,title,image_url,pdf_url,sort_order";

function loadCertifications(force = false) {
  return loadRemoteList({
    key: CERTS_KEY,
    table: "certifications",
    fallback: fallbackCertifications,
    select: CERTS_SELECT,
    force,
  });
}

export function prefetchCertifications() {
  return loadCertifications(false);
}

export function useCertifications({ blocking = false } = {}) {
  const cached = peekCache(CERTS_KEY);
  const [certifications, setCertifications] = useState(
    () => cached?.data ?? (blocking ? [] : fallbackCertifications),
  );
  const [loading, setLoading] = useState(() => blocking && !cached);
  const [error, setError] = useState(cached?.error ?? null);
  const [usingFallback, setUsingFallback] = useState(
    cached?.usingFallback ?? !cached,
  );

  const refresh = useCallback(
    async (force = true) => {
      if (force || (blocking && !peekCache(CERTS_KEY))) setLoading(true);
      setError(null);

      const result = await loadCertifications(force);
      setCertifications(result.data);
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

  return {
    certifications,
    loading,
    error,
    usingFallback,
    refresh: () => refresh(true),
  };
}
