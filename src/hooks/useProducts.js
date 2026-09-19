import { useCallback, useEffect, useState } from "react";
import { fallbackProducts } from "../data/fallback";
import { loadRemoteList, peekCache, invalidateCache } from "../lib/dataCache";

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

const PRODUCTS_KEY = "products";
const PRODUCTS_SELECT =
  "id,name,category,image_url,description,sizes,specs,sort_order";
const fallbackMapped = fallbackProducts.map(normalizeProduct);

function loadProducts(force = false) {
  return loadRemoteList({
    key: PRODUCTS_KEY,
    table: "products",
    fallback: fallbackProducts,
    select: PRODUCTS_SELECT,
    force,
    map: (rows) => rows.map(normalizeProduct),
  });
}

export function prefetchProducts() {
  return loadProducts(false);
}

export function useProducts({ blocking = false } = {}) {
  const cached = peekCache(PRODUCTS_KEY);
  const [products, setProducts] = useState(
    () => cached?.data ?? (blocking ? [] : fallbackMapped),
  );
  const [loading, setLoading] = useState(() => blocking && !cached);
  const [error, setError] = useState(cached?.error ?? null);
  const [usingFallback, setUsingFallback] = useState(
    cached?.usingFallback ?? !cached,
  );

  const refresh = useCallback(
    async (force = true) => {
      if (force || (blocking && !peekCache(PRODUCTS_KEY))) setLoading(true);
      setError(null);

      const result = await loadProducts(force);
      setProducts(result.data);
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

  return { products, loading, error, usingFallback, refresh: () => refresh(true) };
}

export function useProduct(id) {
  const { products, loading, error, usingFallback, refresh } = useProducts();
  const product = products.find((p) => String(p.id) === String(id)) ?? null;
  return { product, products, loading, error, usingFallback, refresh };
}

export function invalidateProducts() {
  invalidateCache(PRODUCTS_KEY);
}
