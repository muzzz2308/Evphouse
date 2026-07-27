/**
 * Shared skeleton primitives + page layouts.
 * Uses brand-tinted shimmer (navy / slate / amber accents via CSS).
 */

export function Skeleton({ className = "" }) {
  return <div className={`skeleton-bone ${className}`} aria-hidden />;
}

export function PageHeaderSkeleton({ lines = 2 }) {
  return (
    <div className="bg-[#0F172A] py-12 sm:py-16 px-4 flex flex-col items-center gap-3">
      <Skeleton className="h-9 sm:h-12 w-48 sm:w-72 rounded-lg bg-white/10" />
      {lines > 1 && <Skeleton className="h-4 w-64 sm:w-96 max-w-full rounded-md bg-white/10" />}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="animate-in" role="status" aria-label="Loading page">
      <section className="bg-[#0F172A] px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center md:text-left">
            <Skeleton className="h-3 w-28 rounded bg-white/10 mx-auto md:mx-0" />
            <Skeleton className="h-10 sm:h-14 w-full max-w-md rounded-lg bg-white/10 mx-auto md:mx-0" />
            <Skeleton className="h-10 w-3/4 max-w-sm rounded-lg bg-white/10 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-full max-w-xl rounded bg-white/10 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-2/3 max-w-md rounded bg-white/10 mx-auto md:mx-0" />
            <div className="flex gap-3 justify-center md:justify-start pt-2">
              <Skeleton className="h-11 w-32 rounded-md bg-white/15" />
              <Skeleton className="h-11 w-36 rounded-md bg-white/10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 h-[300px] sm:h-[380px] md:h-105">
            <Skeleton className="h-full rounded-xl bg-white/10" />
            <Skeleton className="h-full rounded-xl bg-white/10" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F8FAFC] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-8">
            <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
                <Skeleton className="h-28 sm:h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4 mx-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-1 w-16 mx-auto mb-6 rounded bg-[#F59E0B]/40" />
          <Skeleton className="h-8 w-64 mx-auto mb-3 rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full mx-auto mb-10 rounded" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-100 space-y-3">
                <Skeleton className="h-6 w-32 mx-auto rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 mx-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-[#F8FAFC] px-4 sm:px-6">
        <Skeleton className="h-10 w-56 sm:w-80 mx-auto mb-10 rounded-lg" />
        <div className="max-w-7xl mx-auto flex gap-4 overflow-hidden px-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-[40%] sm:min-w-0 space-y-0">
              <Skeleton className="h-56 sm:h-72 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ProductsSkeleton() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen" role="status" aria-label="Loading products">
      <PageHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex gap-2 justify-center mb-10 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 sm:w-28 rounded-full shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="h-52 sm:h-64 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4 mx-auto rounded" />
                <Skeleton className="h-3 w-1/3 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen" role="status" aria-label="Loading product">
      <PageHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <Skeleton className="h-72 sm:h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-48 w-full rounded-lg mt-6" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-36 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="mt-16 space-y-6">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 space-y-3">
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-5 w-2/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen" role="status" aria-label="Loading about">
      <PageHeaderSkeleton />
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <Skeleton className="h-64 md:h-80 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/5 rounded" />
          </div>
        </div>
      </section>
      <section className="bg-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-10 w-16 mx-auto rounded-lg" />
              <Skeleton className="h-4 w-24 mx-auto rounded" />
            </div>
          ))}
        </div>
      </section>
      <section className="py-12 sm:py-20 px-4">
        <Skeleton className="h-8 w-56 mx-auto mb-10 rounded-lg" />
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 sm:h-20 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#0F172A]"
      role="status"
      aria-label="Loading contact"
    >
      <div className="text-center py-12 sm:py-20 px-4 space-y-3">
        <Skeleton className="h-10 sm:h-12 w-72 max-w-full mx-auto rounded-lg bg-white/10" />
        <Skeleton className="h-4 w-96 max-w-full mx-auto rounded bg-white/10" />
      </div>
      <Skeleton className="w-full h-56 sm:h-80 rounded-none bg-white/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-5 w-5 rounded bg-white/10 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-28 rounded bg-white/10" />
                <Skeleton className="h-4 w-48 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 space-y-4">
          <Skeleton className="h-7 w-48 rounded bg-white/10" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg bg-white/10" />
          ))}
          <Skeleton className="h-24 w-full rounded-lg bg-white/10" />
          <Skeleton className="h-12 w-full rounded-lg bg-white/15" />
        </div>
      </div>
    </div>
  );
}

export function AdminListSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" role="status">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100 last:border-0"
        >
          <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function AdminGridSkeleton({ cards = 4 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="p-3 flex justify-between gap-2">
            <Skeleton className="h-4 w-1/2 rounded" />
            <div className="flex gap-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RangeCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8" role="status">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <Skeleton className="h-28 sm:h-40 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4 mx-auto rounded" />
        </div>
      ))}
    </div>
  );
}

export function CertsCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-10" role="status">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-1 min-w-[45%] sm:min-w-0">
          <Skeleton className="h-56 sm:h-72 w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3 mx-auto mt-3 rounded" />
        </div>
      ))}
    </div>
  );
}
