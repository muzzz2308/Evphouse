import { isSupabaseConfigured, supabase } from "./supabase";

const cache = new Map();
const inflight = new Map();

export function peekCache(key) {
  return cache.get(key) ?? null;
}

export function invalidateCache(key) {
  cache.delete(key);
  inflight.delete(key);
}

export async function loadRemoteList({
  key,
  table,
  fallback,
  select = "*",
  orderBy = "sort_order",
  force = false,
  map = (rows) => rows,
}) {
  if (!force) {
    const hit = cache.get(key);
    if (hit) return hit;
    const pending = inflight.get(key);
    if (pending) return pending;
  } else {
    invalidateCache(key);
  }

  const run = (async () => {
    if (!isSupabaseConfigured || !supabase) {
      const result = { data: map(fallback), usingFallback: true, error: null };
      cache.set(key, result);
      return result;
    }

    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order(orderBy, { ascending: true });

    if (error) {
      const result = {
        data: map(fallback),
        usingFallback: true,
        error: error.message,
      };
      cache.set(key, result);
      return result;
    }

    const result = {
      data: map(data ?? []),
      usingFallback: false,
      error: null,
    };
    cache.set(key, result);
    return result;
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, run);
  return run;
}
