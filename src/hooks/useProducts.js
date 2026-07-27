import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { fallbackProducts } from "../data/fallback";

function normalizeProduct(row) {
  return {
    ...row,
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    specs:
      row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
        ? row.specs
        : {},
    image: row.image_url,
  };
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured || !supabase) {
      setProducts(fallbackProducts.map(normalizeProduct));
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setProducts(fallbackProducts.map(normalizeProduct));
      setUsingFallback(true);
    } else {
      setProducts((data ?? []).map(normalizeProduct));
      setUsingFallback(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, error, usingFallback, refresh };
}

export function useProduct(id) {
  const { products, loading, error, usingFallback, refresh } = useProducts();
  const product = products.find((p) => String(p.id) === String(id)) ?? null;
  return { product, products, loading, error, usingFallback, refresh };
}
